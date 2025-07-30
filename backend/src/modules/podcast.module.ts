import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { PodcastController } from '../controllers/podcast.controller';
import { PodcastService } from '../services/podcast.service';
import { Podcast } from '../entities/podcast.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Podcast]), HttpModule],
  controllers: [PodcastController],
  providers: [PodcastService],
  exports: [PodcastService],
})
export class PodcastModule {}
