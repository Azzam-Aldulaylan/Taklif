import { useState, useEffect, useCallback, useMemo } from 'react';
import { Podcast, Episode } from '@/types/podcast';
import { podcastApi } from '@/lib/api';

export interface FeaturedEpisode {
  id: string;
  title: string;
  description: string;
  duration: string;
  releaseDate: string;
  podcastName: string;
  artworkUrl: string;
  itunesUrl?: string;
}

// Convert API Episode to FeaturedEpisodes Episode format
const convertToFeaturedEpisode = (episode: Episode, podcast: Podcast): FeaturedEpisode => ({
  id: episode.id,
  title: episode.title,
  description: episode.description,
  duration: episode.duration,
  releaseDate: episode.publishDate, // API uses publishDate, component expects releaseDate
  podcastName: podcast.collectionName,
  artworkUrl: episode.imageUrl || podcast.artworkUrl100 || podcast.artworkUrl600,
  itunesUrl: episode.itunesUrl,
});

interface UseFeaturedEpisodesReturn {
  episodes: FeaturedEpisode[];
  isLoading: boolean;
  loadingMore: boolean;
  loadMoreEpisodes: () => void;
  hasEpisodes: boolean;
}

export const useFeaturedEpisodes = (podcasts: Podcast[]): UseFeaturedEpisodesReturn => {
  const [episodes, setEpisodes] = useState<FeaturedEpisode[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Create a stable reference for podcast IDs to prevent unnecessary re-fetching
  const podcastIds = useMemo(() => 
    podcasts.map(p => p.id).join(','), 
    [podcasts]
  );

  const fetchEpisodes = useCallback(async (page = 1, isLoadingMore = false) => {
    if (podcasts.length === 0) return;
    
    if (isLoadingMore) {
      setLoadingMore(true);
    } else {
      setIsLoading(true);
    }

    try {
      // Fetch episodes from first few podcasts (max 6 to avoid too many requests)
      const podcastsToFetch = podcasts.slice(0, 6);
      const episodePromises = podcastsToFetch.map(async (podcast) => {
        try {
          const result = await podcastApi.getEpisodesByPodcastId(podcast.id, page, 2);
          return result.episodes.map(episode => convertToFeaturedEpisode(episode, podcast));
        } catch (error) {
          console.warn(`Failed to fetch episodes for podcast ${podcast.id}:`, error);
          return [];
        }
      });

      const allEpisodes = await Promise.all(episodePromises);
      const flattenedEpisodes = allEpisodes.flat();
      
      if (isLoadingMore) {
        setEpisodes(prev => [...prev, ...flattenedEpisodes]);
      } else {
        setEpisodes(flattenedEpisodes.slice(0, 15));
      }
      
      setCurrentPage(page);
    } catch (error) {
      console.error('Failed to fetch episodes:', error);
      if (!isLoadingMore) {
        setEpisodes([]);
      }
    } finally {
      setIsLoading(false);
      setLoadingMore(false);
    }
  }, [podcasts]);

  // Only fetch on initial load or when podcast IDs change
  useEffect(() => {
    if (!hasLoaded && podcasts.length > 0) {
      fetchEpisodes(1, false);
      setHasLoaded(true);
    }
  }, [podcastIds, hasLoaded, fetchEpisodes, podcasts.length]);

  // Reset when podcasts change
  useEffect(() => {
    setHasLoaded(false);
    setEpisodes([]);
    setCurrentPage(1);
  }, [podcastIds]);

  const loadMoreEpisodes = useCallback(() => {
    fetchEpisodes(currentPage + 1, true);
  }, [fetchEpisodes, currentPage]);

  return { 
    episodes, 
    isLoading, 
    loadingMore, 
    loadMoreEpisodes,
    hasEpisodes: episodes.length > 0
  };
};
