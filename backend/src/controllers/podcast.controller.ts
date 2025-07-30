import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpException,
  HttpStatus,
  ValidationPipe,
} from '@nestjs/common';
import { PodcastService } from '../services/podcast.service';
import { SearchPodcastDto } from '../dto/search-podcast.dto';
import { Podcast } from '../entities/podcast.entity';

@Controller('podcasts')
export class PodcastController {
  constructor(private readonly podcastService: PodcastService) {}

  @Post('search')
  async searchPodcasts(
    @Body(ValidationPipe) searchDto: SearchPodcastDto,
  ): Promise<{
    message: string;
    count: number;
    podcasts: Podcast[];
  }> {
    try {
      const podcasts =
        await this.podcastService.searchAndStorePodcasts(searchDto);

      return {
        message: 'Podcasts searched and stored successfully',
        count: podcasts.length,
        podcasts,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';
      throw new HttpException(
        {
          message: 'Failed to search and store podcasts',
          error: errorMessage,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  async getAllPodcasts(): Promise<{
    message: string;
    count: number;
    podcasts: Podcast[];
  }> {
    try {
      const podcasts = await this.podcastService.getAllPodcasts();

      return {
        message: 'Podcasts retrieved successfully',
        count: podcasts.length,
        podcasts,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';
      throw new HttpException(
        {
          message: 'Failed to retrieve podcasts',
          error: errorMessage,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async getPodcastById(@Param('id') id: string): Promise<{
    message: string;
    podcast: Podcast;
  }> {
    try {
      const podcastId = parseInt(id, 10);
      if (isNaN(podcastId)) {
        throw new HttpException(
          'Invalid podcast ID format',
          HttpStatus.BAD_REQUEST,
        );
      }

      const podcast = await this.podcastService.getPodcastById(podcastId);

      return {
        message: 'Podcast retrieved successfully',
        podcast,
      };
    } catch (error) {
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
          message: 'Failed to retrieve podcast',
          error: errorMessage,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
