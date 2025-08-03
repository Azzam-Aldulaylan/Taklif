import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { PodcastController } from '../controllers/podcast.controller';
import { EpisodesController } from '../controllers/episodes.controller';
import { PodcastService } from '../services/podcast.service';
import { EpisodesService } from '../services/episodes.service';
import { ItunesSearchService } from '../services/itunes-search.service';
import { Podcast } from '../entities/podcast.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Podcast]), HttpModule],
  controllers: [PodcastController, EpisodesController],
  providers: [PodcastService, EpisodesService, ItunesSearchService],
  exports: [PodcastService, EpisodesService],
})
export class PodcastModule {}
