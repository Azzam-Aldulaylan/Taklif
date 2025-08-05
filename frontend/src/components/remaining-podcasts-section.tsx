import React from 'react';
import { PodcastGrid } from '@/components/podcast-grid';
import { Podcast } from '@/types/podcast';

interface RemainingPodcastsSectionProps {
  podcasts: Podcast[];
  searchTerm?: string;
}

export const RemainingPodcastsSection: React.FC<RemainingPodcastsSectionProps> = ({
  podcasts,
  searchTerm
}) => {
  if (podcasts.length === 0) return null;

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-light tracking-tight">
          {searchTerm ? "المزيد من النتائج" : "جميع البودكاست"}
        </h2>
        <span className="text-sm text-muted-foreground font-light">
          {podcasts.length} بودكاست
        </span>
      </div>
      
      <PodcastGrid
        podcasts={podcasts}
        emptyMessage="لا توجد بودكاست إضافية."
      />
    </section>
  );
};
