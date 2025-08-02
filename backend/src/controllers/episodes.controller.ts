import {
  Controller,
  Get,
  Param,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { EpisodesService } from '../services/episodes.service';
import { PodcastService } from '../services/podcast.service';
import { Episode } from '../entities/episode.entity';

@Controller('episodes')
export class EpisodesController {
  constructor(
    private readonly episodesService: EpisodesService,
    private readonly podcastService: PodcastService,
  ) {}

  @Get('podcast/:id')
  async getEpisodesByPodcastId(@Param('id') id: string): Promise<{
    message: string;
    episodes: Episode[];
  }> {
    try {
      const podcastId = parseInt(id, 10);
      if (isNaN(podcastId)) {
        throw new HttpException(
          'Invalid podcast ID format',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Get the podcast to extract the feed URL
      const podcast = await this.podcastService.getPodcastById(podcastId);
      
      if (!podcast.feedUrl) {
        return {
          message: 'No RSS feed available for this podcast',
          episodes: [],
        };
      }

      // Fetch episodes from the RSS feed
      const episodes = await this.episodesService.getEpisodesByFeedUrl(
        podcast.feedUrl,
      );

      return {
        message: 'Episodes retrieved successfully',
        episodes,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      if (error instanceof Error && error.message.includes('not found')) {
        throw new HttpException(
          {
            message: 'Podcast not found',
            error: error.message,
          },
          HttpStatus.NOT_FOUND,
        );
      }

      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';
      throw new HttpException(
        {
          message: 'Failed to retrieve episodes',
          error: errorMessage,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
