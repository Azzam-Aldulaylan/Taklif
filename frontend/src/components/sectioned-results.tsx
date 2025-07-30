'use client';

import React from 'react';
import { FeaturedPodcasts } from '@/components/featured-podcasts';
import { FeaturedEpisodes, generateMockEpisodes } from '@/components/featured-episodes';
import { PodcastGrid } from '@/components/podcast-grid';
import { Podcast } from '@/types/podcast';

interface SectionedResultsProps {
  featuredPodcasts: Podcast[];
  allPodcasts: Podcast[];
  isLoading?: boolean;
  searchTerm?: string;
}

const LoadingSkeleton = () => (
  <div className="space-y-16">
    {[8, 6, 8].map((count, sectionIndex) => (
      <div key={sectionIndex} className="space-y-6">
        <div className="h-8 bg-gray-300 rounded w-48 animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: count }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-gray-300 aspect-square rounded-lg mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="h-3 bg-gray-300 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);

export function SectionedResults({ 
  featuredPodcasts, 
  allPodcasts, 
  isLoading = false, 
  searchTerm 
}: SectionedResultsProps) {
  if (isLoading) return <LoadingSkeleton />;
  if (allPodcasts.length === 0) return null;

  const remainingPodcasts = allPodcasts.slice(8);

  return (
    <div className="space-y-16">
      {featuredPodcasts.length > 0 && (
        <FeaturedPodcasts
          podcasts={featuredPodcasts}
          title={searchTerm ? `أفضل البودكاست لـ "${searchTerm}"` : "أفضل البودكاست"}
          maxItems={8}
        />
      )}

      {allPodcasts.length > 0 && (
        <FeaturedEpisodes
          episodes={generateMockEpisodes(allPodcasts)}
          title={searchTerm ? `أفضل الحلقات لـ "${searchTerm}"` : "أفضل الحلقات"}
          maxItems={12}
        />
      )}

      {remainingPodcasts.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-light tracking-tight">
              {searchTerm ? "المزيد من النتائج" : "جميع البودكاست"}
            </h2>
            <span className="text-sm text-muted-foreground font-light">
              {remainingPodcasts.length} بودكاست
            </span>
          </div>
          
          <PodcastGrid
            podcasts={remainingPodcasts}
            emptyMessage="لا توجد بودكاست إضافية."
          />
        </section>
      )}

    </div>
  );
}
