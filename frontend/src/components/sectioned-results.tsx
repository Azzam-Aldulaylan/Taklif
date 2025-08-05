'use client';

import React from 'react';
import { FeaturedPodcasts } from '@/components/featured-podcasts';
import { EpisodesSection } from '@/components/episodes-section';
import { RemainingPodcastsSection } from '@/components/remaining-podcasts-section';
import { LoadingSkeleton } from '@/components/ui/loading-skeleton';
import { useFeaturedEpisodes } from '@/hooks';
import { Podcast } from '@/types/podcast';

interface SectionedResultsProps {
  featuredPodcasts: Podcast[];
  allPodcasts: Podcast[];
  isLoading?: boolean;
  searchTerm?: string;
}

export function SectionedResults({ 
  featuredPodcasts, 
  allPodcasts, 
  isLoading = false, 
  searchTerm 
}: SectionedResultsProps) {
  const { 
    episodes, 
    isLoading: episodesLoading, 
    loadingMore, 
    loadMoreEpisodes,
    hasEpisodes
  } = useFeaturedEpisodes(featuredPodcasts);

  // Show loading skeleton while initial data is loading
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  // Show nothing if no podcasts found
  if (allPodcasts.length === 0) {
    return null;
  }

  // Calculate remaining podcasts (after featured ones)
  const remainingPodcasts = allPodcasts.slice(8);

  // Generate dynamic titles based on search term
  const podcastsTitle = searchTerm 
    ? `أفضل البودكاست لـ "${searchTerm}"` 
    : "أفضل البودكاست";
  
  const episodesTitle = searchTerm 
    ? `أفضل الحلقات لـ "${searchTerm}"` 
    : "أفضل الحلقات";

  return (
    <div className="space-y-16">
      {/* Featured Podcasts Section */}
      {featuredPodcasts.length > 0 && (
        <FeaturedPodcasts
          podcasts={featuredPodcasts}
          title={podcastsTitle}
          maxItems={8}
        />
      )}

      {/* Featured Episodes Section */}
      {episodesLoading && (
        <div className="space-y-6">
          <h2 className="text-2xl font-light tracking-tight text-foreground">
            {episodesTitle}
          </h2>
          <LoadingSkeleton sections={[6]} />
        </div>
      )}
      
      {!episodesLoading && hasEpisodes && (
        <EpisodesSection
          episodes={episodes}
          title={episodesTitle}
          loadingMore={loadingMore}
          onLoadMore={loadMoreEpisodes}
          maxItems={15}
        />
      )}

      {/* Remaining Podcasts Section */}
      <RemainingPodcastsSection
        podcasts={remainingPodcasts}
        searchTerm={searchTerm}
      />
    </div>
  );
}
