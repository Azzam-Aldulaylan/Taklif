import {
  Controller,
  Get,
  Param,
  Query,
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
  async getEpisodesByPodcastId(
    @Param('id') id: string,
    @Query('page') page = '1',
    @Query('limit') limit = '10',
  ): Promise<{
    message: string;
    episodes: Episode[];
    hasMore: boolean;
    total: number;
    currentPage: number;
    totalPages: number;
  }> {
    try {
      const podcastId = parseInt(id, 10);
      if (isNaN(podcastId)) {
        throw new HttpException('Invalid podcast ID', HttpStatus.BAD_REQUEST);
      }

      const currentPage = Math.max(1, parseInt(page, 10));
      const pageLimit = Math.min(50, Math.max(1, parseInt(limit, 10)));

      const podcast = await this.podcastService.getPodcastById(podcastId);
      
      if (!podcast.feedUrl) {
        return {
          message: 'No RSS feed available',
          episodes: [],
          hasMore: false,
          total: 0,
          currentPage,
          totalPages: 0,
        };
      }

      const result = await this.episodesService.getEpisodesByFeedUrl(
        podcast.feedUrl,
        podcastId.toString(),
        currentPage,
        pageLimit,
        podcast.trackId,
      );

      return {
        message: 'Episodes retrieved successfully',
        episodes: result.episodes,
        hasMore: result.hasMore,
        total: result.total,
        currentPage,
        totalPages: Math.ceil(result.total / pageLimit),
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;

      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      const status = errorMessage.includes('not found')
        ? HttpStatus.NOT_FOUND
        : HttpStatus.INTERNAL_SERVER_ERROR;

      throw new HttpException(
        `Failed to retrieve episodes: ${errorMessage}`,
        status,
      );
    }
  }
}
