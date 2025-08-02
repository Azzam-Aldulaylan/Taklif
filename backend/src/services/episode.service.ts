import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as xml2js from 'xml2js';
import { Episode } from '../dto/episode.dto';

@Injectable()
export class EpisodeService {
  private readonly logger = new Logger(EpisodeService.name);

  constructor(private httpService: HttpService) {}

  async getEpisodesFromFeed(feedUrl: string): Promise<Episode[]> {
    try {
      this.logger.log(`Fetching episodes from feed: ${feedUrl}`);
      
      const response = await firstValueFrom(
        this.httpService.get(feedUrl, {
          timeout: 10000,
          headers: {
            'User-Agent': 'Thmanyah Podcast App/1.0',
          },
        })
      );

      const parser = new xml2js.Parser();
      const result = await parser.parseStringPromise(response.data);

      const items = result?.rss?.channel?.[0]?.item || [];
      
      const episodes: Episode[] = items.map((item: any, index: number) => {
        const enclosure = item.enclosure?.[0]?.$;
        
        return {
          id: item.guid?.[0]?._ || item.guid?.[0] || `episode-${index}`,
          title: this.cleanText(item.title?.[0] || `Episode ${index + 1}`),
          description: this.cleanText(
            item.description?.[0] || 
            item['itunes:summary']?.[0] || 
            'No description available'
          ),
          pubDate: item.pubDate?.[0] || new Date().toISOString(),
          duration: item['itunes:duration']?.[0] || undefined,
          enclosureUrl: enclosure?.url || undefined,
          enclosureType: enclosure?.type || undefined,
          link: item.link?.[0] || undefined,
        };
      });

      this.logger.log(`Successfully parsed ${episodes.length} episodes`);
      return episodes;
    } catch (error) {
      this.logger.error(`Error fetching episodes from feed ${feedUrl}:`, error.message);
      throw new Error(`Failed to fetch episodes: ${error.message}`);
    }
  }

  private cleanText(text: string): string {
    if (!text) return '';
    
    // Remove HTML tags and decode HTML entities
    return text
      .replace(/<[^>]*>/g, '')
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&nbsp;/g, ' ')
      .trim();
  }
}
