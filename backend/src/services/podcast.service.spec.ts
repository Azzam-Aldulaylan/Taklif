import { Test, TestingModule } from '@nestjs/testing';
import { PodcastService } from '../services/podcast.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HttpService } from '@nestjs/axios';
import { Podcast } from '../entities/podcast.entity';
import { Repository } from 'typeorm';
import { of } from 'rxjs';

describe('PodcastService', () => {
  let service: PodcastService;
  let repository: Repository<Podcast>;
  let httpService: HttpService;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
  };

  const mockHttpService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PodcastService,
        {
          provide: getRepositoryToken(Podcast),
          useValue: mockRepository,
        },
        {
          provide: HttpService,
          useValue: mockHttpService,
        },
      ],
    }).compile();

    service = module.get<PodcastService>(PodcastService);
    repository = module.get<Repository<Podcast>>(getRepositoryToken(Podcast));
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('searchAndStorePodcasts', () => {
    it('should search iTunes and store podcasts', async () => {
      const mockResponse = {
        data: {
          resultCount: 1,
          results: [
            {
              trackId: 123,
              trackName: 'Test Podcast',
              artistName: 'Test Artist',
              collectionName: 'Test Collection',
            },
          ],
        },
      };

      const mockPodcast = {
        id: 1,
        trackId: 123,
        trackName: 'Test Podcast',
        artistName: 'Test Artist',
        collectionName: 'Test Collection',
      };

      mockHttpService.get.mockReturnValue(of(mockResponse));
      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(mockPodcast);
      mockRepository.save.mockResolvedValue(mockPodcast);

      const result = await service.searchAndStorePodcasts({
        term: 'test',
        country: 'US',
      });

      expect(result).toEqual([mockPodcast]);
      expect(mockHttpService.get).toHaveBeenCalled();
      expect(mockRepository.save).toHaveBeenCalled();
    });
  });

  describe('getAllPodcasts', () => {
    it('should return all podcasts', async () => {
      const mockPodcasts = [
        { id: 1, trackName: 'Podcast 1' },
        { id: 2, trackName: 'Podcast 2' },
      ];

      mockRepository.find.mockResolvedValue(mockPodcasts);

      const result = await service.getAllPodcasts();

      expect(result).toEqual(mockPodcasts);
      expect(mockRepository.find).toHaveBeenCalledWith({
        order: { createdAt: 'DESC' },
      });
    });
  });

  describe('getPodcastById', () => {
    it('should return a podcast by id', async () => {
      const mockPodcast = { id: 1, trackName: 'Test Podcast' };

      mockRepository.findOne.mockResolvedValue(mockPodcast);

      const result = await service.getPodcastById(1);

      expect(result).toEqual(mockPodcast);
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw error if podcast not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.getPodcastById(1)).rejects.toThrow(
        'Podcast with id 1 not found',
      );
    });
  });
});
