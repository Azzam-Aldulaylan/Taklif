import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import * as Parser from 'rss-parser';
import { Episode } from '../entities/episode.entity';
import { ItunesSearchService } from './itunes-search.service';

// RSS parser returns 'any' types, so we need to disable some TypeScript checks
/* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-return */

@Injectable()
export class EpisodesService {
  private readonly logger = new Logger(EpisodesService.name);
  private readonly parser = new Parser();

  constructor(
    private httpService: HttpService,
    private itunesSearchService: ItunesSearchService,
  ) {}

  async getEpisodesByFeedUrl(
    feedUrl: string,
    podcastId = 'unknown',
    page = 1,
    limit = 10,
    itunesId?: number,
  ): Promise<{ episodes: Episode[]; hasMore: boolean; total: number }> {
    try {
      this.logger.log(
        `Fetching episodes: ${feedUrl}, page ${page}, limit ${limit}`,
      );

      const feed = await this.parser.parseURL(feedUrl);
      const allItems = feed.items || [];
      const total = allItems.length;

      // Calculate pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedItems = allItems.slice(startIndex, endIndex);
      const hasMore = endIndex < total;

      // Convert RSS items to Episode objects
      const episodes: Episode[] = await Promise.all(
        paginatedItems.map(async (item, index) => {
          const episodeId =
            item.guid || `${podcastId}-episode-${startIndex + index + 1}`;

          // Debug RSS structure for first episode only
          if (index === 0) {
            this.logger.debug('RSS sample:', {
              guid: item.guid,
              link: item.link,
            });
          }

          return {
            id: episodeId,
            title: item.title || `Episode ${startIndex + index + 1}`,
            description: this.cleanDescription(
              item.contentSnippet || item.content || '',
            ),
            duration: this.formatDuration(item.itunes?.duration || ''),
            publishDate:
              item.pubDate || item.isoDate || new Date().toISOString(),
            audioUrl: this.extractAudioUrl(item),
            episodeNumber: item.itunes?.episode
              ? parseInt(item.itunes.episode, 10)
              : undefined,
            seasonNumber: item.itunes?.season
              ? parseInt(item.itunes.season, 10)
              : undefined,
            imageUrl: this.extractImageUrl(item, feed),
            itunesUrl: await this.generateItunesUrl(itunesId, item, index),
            guid: item.guid || episodeId,
          };
        }),
      );

      this.logger.log(`Successfully parsed ${episodes.length} episodes`);
      return {
        episodes,
        hasMore,
        total,
      };
    } catch (error) {
      this.logger.error(`Failed to fetch episodes from ${feedUrl}:`, error);
      return {
        episodes: [],
        hasMore: false,
        total: 0,
      }; // Return empty result if RSS parsing fails
    }
  }

  private cleanDescription(description: string): string {
    if (!description) return '';
    const cleaned = description.replace(/<[^>]*>/g, '').trim();
    return cleaned.length > 300 ? cleaned.substring(0, 300) + '...' : cleaned;
  }

  private formatDuration(duration: string): string {
    if (!duration) return '';

    if (duration.includes(':')) {
      return duration;
    }

    const seconds = parseInt(duration, 10);
    if (isNaN(seconds)) return '';

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  private extractAudioUrl(item: any): string {
    if (item.enclosure?.url) {
      return item.enclosure.url;
    }
    return item.link || '';
  }

  private extractImageUrl(item: any, feed: any): string {
    if (item.itunes?.image?.href) {
      return item.itunes.image.href;
    }

    if (feed.itunes?.image?.href) {
      return feed.itunes.image.href;
    }

    if (feed.image?.url) {
      return feed.image.url;
    }

    return '';
  }

  private async generateItunesUrl(
    itunesId?: number,
    item?: any,
    index?: number,
  ): Promise<string> {
    if (!itunesId) return '';

    const podcastUrl = `https://podcasts.apple.com/sa/podcast/id${itunesId}`;

    // Try to extract iTunes episode ID from RSS feed first
    const episodeId = this.extractEpisodeId(item);

    if (episodeId) {
      return `${podcastUrl}?i=${episodeId}`;
    }

    // Fallback: Use iTunes Search API to find episode ID (only for first 5 episodes to avoid rate limits)
    if (item?.title && itunesId && (index === undefined || index < 5)) {
      try {
        const searchedEpisodeId = await this.itunesSearchService.findEpisodeId(
          itunesId,
          item.title,
          item.pubDate || item.isoDate,
        );

        if (searchedEpisodeId) {
          this.logger.debug(
            `Found episode ID via iTunes Search: ${searchedEpisodeId} for "${item.title}"`,
          );
          return `${podcastUrl}?i=${searchedEpisodeId}`;
        }
      } catch (error) {
        this.logger.warn(
          `iTunes search failed for episode "${item.title}":`,
          error,
        );
      }
    }

    return podcastUrl;
  }

  private extractEpisodeId(item: any): string | null {
    if (!item) return null;

    // Check GUID first (most reliable source)
    if (item.guid) {
      const guid = String(item.guid);

      const itunesMatch = guid.match(/[?&]i=(\d{10,})/);
      if (itunesMatch) {
        return itunesMatch[1];
      }

      if (/^10\d{11}$/.test(guid)) {
        return guid;
      }

      const longNumMatch = guid.match(/\b(10\d{11})\b/);
      if (longNumMatch) {
        return longNumMatch[1];
      }
    }

    // Check link field as fallback
    if (item.link) {
      const linkMatch = String(item.link).match(/[?&]i=(\d{10,})/);
      if (linkMatch) {
        return linkMatch[1];
      }
    }

    return null;
  }
}
