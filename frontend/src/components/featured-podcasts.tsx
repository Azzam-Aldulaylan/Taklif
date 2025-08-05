'use client';

import React from 'react';
import { PodcastCard } from '@/components/podcast-card';
import { Podcast } from '@/types/podcast';
import { ChevronRight } from 'lucide-react';

interface FeaturedPodcastsProps {
  podcasts: Podcast[];
  onViewAll?: () => void;
  maxItems?: number;
  title?: string;
}

export function FeaturedPodcasts({ 
  podcasts, 
  onViewAll,
  maxItems = 8,
  title
}: FeaturedPodcastsProps) {
  const displayPodcasts = podcasts.slice(0, maxItems);

  if (podcasts.length === 0) {
    return null;
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        {title && (
          <h2 className="text-2xl font-light tracking-tight text-foreground">
            {title}
          </h2>
        )}
        {podcasts.length > maxItems && onViewAll && (
          <button
            onClick={onViewAll}
            className="flex items-center text-primary hover:text-primary/80 transition-colors duration-200 group"
          >
            <span className="text-sm font-medium">عرض الكل</span>
            <ChevronRight className="ml-1 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </button>
        )}
      </div>
      
      {/* Horizontal scrolling grid for featured podcasts */}
      <div className="relative">
        <div className="flex space-x-6 overflow-x-auto pb-6 scrollbar-hide snap-x snap-mandatory">
          {displayPodcasts.map((podcast, index) => (
            <div 
              key={`${podcast.collectionId}-${podcast.trackId}`}
              className={`flex-shrink-0 w-48 sm:w-56 snap-start mb-4 animate-card-enter animate-stagger-${(index % 8) + 1}`}
            >
              <PodcastCard
                podcast={podcast}
                featured={true}
              />
            </div>
          ))}
        </div>
        
        {/* Subtle gradient fade on the right */}
        <div className="absolute top-0 right-0 h-full w-16 bg-gradient-to-l from-background via-background/80 to-transparent pointer-events-none" />
      </div>
    </section>
  );
}
