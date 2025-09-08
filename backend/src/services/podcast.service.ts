import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';
import { Podcast } from '../entities/podcast.entity';
import { SearchPodcastDto } from '../dto/search-podcast.dto';

interface iTunesSearchResponse {
  resultCount: number;
  results: iTunesPodcast[];
}

interface iTunesPodcast {
  trackId: number;
  trackName: string;
  artistName: string;
  collectionName?: string;
  description?: string;
  artworkUrl100?: string;
  artworkUrl600?: string;
  feedUrl?: string;
  trackViewUrl?: string;
  country?: string;
  trackPrice?: number;
  currency?: string;
  trackCount?: number;
  releaseDate?: string;
  primaryGenreName?: string;
  genres?: string[];
}

@Injectable()
export class PodcastService {
  private readonly logger = new Logger(PodcastService.name);
  private readonly iTunesBaseUrl = 'https://itunes.apple.com/search';

  constructor(
    @InjectRepository(Podcast)
    private podcastRepository: Repository<Podcast>,
    private httpService: HttpService,
  ) {}

  async searchAndStorePodcasts(
    searchDto: SearchPodcastDto,
  ): Promise<Podcast[]> {
    try {
      const iTunesResults = await this.searchITunes(searchDto);
      const storedPodcasts = await this.storePodcasts(iTunesResults.results);

      this.logger.log(
        `Stored ${storedPodcasts.length} podcasts from search term: ${searchDto.term}`,
      );

      return storedPodcasts;
    } catch (error) {
      this.logger.error(
        `Error searching and storing podcasts: ${(error as Error).message}`,
      );
      throw error;
    }
  }

  private async searchITunes(
    searchDto: SearchPodcastDto,
  ): Promise<iTunesSearchResponse> {
    const params = {
      term: searchDto.term,
      country: searchDto.country || 'SA',
      media: searchDto.media || 'podcast',
      entity: searchDto.entity || 'podcast',
      limit: 50,
    };

    try {
      this.logger.log(`Searching params: ${JSON.stringify(params)}`);

      const response: AxiosResponse<iTunesSearchResponse> =
        await firstValueFrom(
          this.httpService.get(this.iTunesBaseUrl, {
            params,
            timeout: 10000,
          }),
        );

      this.logger.log(
        `iTunes API returned ${response.data.resultCount} results for term: "${searchDto.term}"`,
      );

      if (response.data.resultCount === 0) {
        this.logger.warn(
          `No podcasts found for search term: "${searchDto.term}"`,
        );
      }

      return response.data;
    } catch (error) {
      this.logger.error(
        `Error calling iTunes API with params ${JSON.stringify(params)}: ${(error as Error).message}`,
      );
      this.logger.error(`Full error:`, error);
      throw new Error('Failed to fetch data from iTunes API');
    }
  }

  private async storePodcasts(
    iTunesPodcasts: iTunesPodcast[],
  ): Promise<Podcast[]> {
    const storedPodcasts: Podcast[] = [];

    for (const iTunesPodcast of iTunesPodcasts) {
      try {
        const existingPodcast = await this.podcastRepository.findOne({
          where: { trackId: iTunesPodcast.trackId },
        });

        if (existingPodcast) {
          this.logger.debug(
            `Podcast with trackId ${iTunesPodcast.trackId} already exists`,
          );
          storedPodcasts.push(existingPodcast);
          continue;
        }

        const podcastData = {
          trackId: iTunesPodcast.trackId,
          trackName: iTunesPodcast.trackName,
          artistName: iTunesPodcast.artistName,
          collectionName: iTunesPodcast.collectionName,
          description: iTunesPodcast.description,
          artworkUrl100: iTunesPodcast.artworkUrl100,
          artworkUrl600: iTunesPodcast.artworkUrl600,
          feedUrl: iTunesPodcast.feedUrl,
          trackViewUrl: iTunesPodcast.trackViewUrl,
          country: iTunesPodcast.country,
          trackPrice: iTunesPodcast.trackPrice,
          currency: iTunesPodcast.currency,
          trackCount: iTunesPodcast.trackCount,
          releaseDate: iTunesPodcast.releaseDate
            ? new Date(iTunesPodcast.releaseDate)
            : undefined,
          genres: iTunesPodcast.genres
            ? JSON.stringify(iTunesPodcast.genres)
            : undefined,
        };

        const podcast = this.podcastRepository.create(podcastData);
        const savedPodcast = await this.podcastRepository.save(podcast);
        storedPodcasts.push(savedPodcast);

        this.logger.debug(`Stored podcast: ${savedPodcast.trackName}`);
      } catch (error) {
        this.logger.error(
          `Error storing podcast ${iTunesPodcast.trackName}: ${(error as Error).message}`,
        );
        continue;
      }
    }

    return storedPodcasts;
  }

  async getAllPodcasts(): Promise<Podcast[]> {
    return this.podcastRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async getPodcastById(id: number): Promise<Podcast> {
    const podcast = await this.podcastRepository.findOne({ where: { id } });
    if (!podcast) {
      throw new Error(`Podcast with id ${id} not found`);
    }
    return podcast;
  }
}
