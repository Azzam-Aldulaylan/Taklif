import React from 'react';
import { FeaturedEpisodes } from '@/components/featured-episodes';
import { Button } from '@/components/ui/button';
import { FeaturedEpisode } from '@/hooks';

interface EpisodesSectionProps {
  episodes: FeaturedEpisode[];
  title: string;
  loadingMore: boolean;
  onLoadMore: () => void;
  maxItems?: number;
}

export const EpisodesSection: React.FC<EpisodesSectionProps> = ({
  episodes,
  title,
  loadingMore,
  onLoadMore,
  maxItems = 15
}) => {
  if (episodes.length === 0) return null;

  return (
    <div className="space-y-6">
      <FeaturedEpisodes
        episodes={episodes}
        title={title}
        maxItems={maxItems}
      />
      
      {/* Load More Episodes Button */}
      <div className="flex justify-center">
        <Button
          variant="outline"
          onClick={onLoadMore}
          disabled={loadingMore}
          className="transition-all duration-200 hover:scale-105"
        >
          {loadingMore ? "جاري التحميل..." : "تحميل المزيد من الحلقات"}
        </Button>
      </div>
    </div>
  );
};
