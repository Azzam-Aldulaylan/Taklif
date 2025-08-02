import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import * as Parser from 'rss-parser';
import { Episode } from '../entities/episode.entity';

// RSS parser returns 'any' types, so we need to disable some TypeScript checks
/* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-return */

@Injectable()
export class EpisodesService {
  private readonly logger = new Logger(EpisodesService.name);
  private readonly parser = new Parser();

  constructor(private httpService: HttpService) {}

  async getEpisodesByFeedUrl(
    feedUrl: string,
    podcastId?: string,
  ): Promise<Episode[]> {
    try {
      this.logger.log(
        `Fetching episodes from: ${feedUrl} for podcast ID: ${podcastId}`,
      );

      const feed = await this.parser.parseURL(feedUrl);

      // Convert RSS items to Episode objects (limit to 20 episodes)
      const episodes: Episode[] = feed.items.slice(0, 20).map((item, index) => {
        const episodeId =
          item.guid || `${podcastId || 'unknown'}-episode-${index + 1}`;
        this.logger.debug(
          `Generated episode ID: ${episodeId} for podcast ${podcastId}`,
        );
        return {
          id: episodeId,
          title: item.title || `Episode ${index + 1}`,
          description: this.cleanDescription(
            item.contentSnippet || item.content || '',
          ),
          duration: this.formatDuration(item.itunes?.duration || ''),
          publishDate: item.pubDate || item.isoDate || new Date().toISOString(),
          audioUrl: this.extractAudioUrl(item),
          episodeNumber: item.itunes?.episode
            ? parseInt(item.itunes.episode, 10)
            : undefined,
          seasonNumber: item.itunes?.season
            ? parseInt(item.itunes.season, 10)
            : undefined,
          imageUrl: this.extractImageUrl(item, feed),
        };
      });

      this.logger.log(`Successfully parsed ${episodes.length} episodes`);
      return episodes;
    } catch (error) {
      this.logger.error(`Failed to fetch episodes from ${feedUrl}:`, error);
      return []; // Return empty array if RSS parsing fails
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
}
