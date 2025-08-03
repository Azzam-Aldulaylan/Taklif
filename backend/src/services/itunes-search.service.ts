import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ItunesSearchService {
  private readonly logger = new Logger(ItunesSearchService.name);

  constructor(private httpService: HttpService) {}

  async findEpisodeId(
    podcastId: number,
    episodeTitle: string,
    publishDate?: string,
  ): Promise<string | null> {
    try {
      // Use iTunes Search API to find episode
      const url = `https://itunes.apple.com/lookup?id=${podcastId}&entity=podcastEpisode&limit=200`;
      
      this.logger.debug(`Searching iTunes for episodes of podcast ${podcastId}`);
      
      const response = await firstValueFrom(
        this.httpService.get(url, { timeout: 5000 })
      );
      
      const episodes = response.data.results.filter(
        (item: any) => item.wrapperType === 'podcastEpisode'
      );
      
      const titleMatch = episodes.find((episode: any) => {
        const itunesTitle = episode.trackName?.toLowerCase() || '';
        const searchTitle = episodeTitle.toLowerCase();
        
        if (itunesTitle === searchTitle) return true;
        
        const overlap = this.calculateTitleOverlap(itunesTitle, searchTitle);
        return overlap > 0.5;
      });
      
      if (titleMatch) {
        this.logger.debug(`Found episode match: ${titleMatch.trackName} -> ${titleMatch.trackId}`);
        return titleMatch.trackId.toString();
      }
      
      if (publishDate) {
        const targetDate = new Date(publishDate);
        const dateMatch = episodes.find((episode: any) => {
          if (!episode.releaseDate) return false;
          
          const episodeDate = new Date(episode.releaseDate);
          const timeDiff = Math.abs(targetDate.getTime() - episodeDate.getTime());
          const daysDiff = timeDiff / (1000 * 3600 * 24);
          
          return daysDiff <= 2;
        });
        
        if (dateMatch) {
          this.logger.debug(`Found episode by date: ${dateMatch.trackName} -> ${dateMatch.trackId}`);
          return dateMatch.trackId.toString();
        }
      }
      
      this.logger.debug(`No episode match found for: ${episodeTitle}`);
      return null;
      
    } catch (error) {
      this.logger.error(`iTunes search failed for podcast ${podcastId}:`, error);
      return null;
    }
  }
  
  private calculateTitleOverlap(title1: string, title2: string): number {
    const words1 = title1.split(/\s+/).filter(w => w.length > 2);
    const words2 = title2.split(/\s+/).filter(w => w.length > 2);
    
    if (words1.length === 0 || words2.length === 0) return 0;
    
    const commonWords = words1.filter(word => 
      words2.some(w => w.includes(word) || word.includes(w))
    );
    
    return commonWords.length / Math.max(words1.length, words2.length);
  }
}
