'use client';

import React from 'react';
import { PodcastCard } from '@/components/podcast-card';
import { Podcast } from '@/types/podcast';

interface PodcastGridProps {
  podcasts: Podcast[];
  isLoading?: boolean;
  emptyMessage?: string;
}

const LoadingSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {Array.from({ length: 8 }).map((_, index) => (
      <div key={index} className="animate-pulse">
        <div className="bg-gray-300 aspect-square rounded-lg mb-4"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          <div className="h-3 bg-gray-300 rounded w-1/2"></div>
          <div className="h-3 bg-gray-300 rounded w-2/3"></div>
        </div>
      </div>
    ))}
  </div>
);

const EmptyState = ({ message }: { message: string }) => (
  <div className="text-center py-12">
    <div className="mx-auto max-w-md">
      <div className="mx-auto h-12 w-12 text-gray-400">
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
      </div>
      <h3 className="mt-4 text-lg font-medium text-gray-900">No podcasts found</h3>
      <p className="mt-2 text-sm text-gray-500">{message}</p>
    </div>
  </div>
);

interface PodcastGridProps {
  podcasts: Podcast[];
  isLoading?: boolean;
  emptyMessage?: string;
}

export function PodcastGrid({ 
  podcasts, 
  isLoading = false, 
  emptyMessage = 'No podcasts found. Try a different search term.'
}: PodcastGridProps) {
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (podcasts.length === 0) {
    return <EmptyState message={emptyMessage} />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {podcasts.map((podcast) => (
        <PodcastCard
          key={`${podcast.collectionId}-${podcast.trackId}`}
          podcast={podcast}
        />
      ))}
    </div>
  );
}
