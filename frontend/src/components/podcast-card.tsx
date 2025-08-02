'use client';

import React from 'react';
import Image from 'next/image';
import { Clock, Calendar, User, Headphones } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Podcast } from '@/types/podcast';
import { formatDate, formatDuration, truncateText, getHighResArtwork } from '@/lib/utils';

interface PodcastCardProps {
  podcast: Podcast;
  featured?: boolean;
}

export function PodcastCard({ podcast, featured = false }: PodcastCardProps) {
  const artworkUrl = getHighResArtwork(podcast.artworkUrl100 || podcast.artworkUrl600, featured ? 400 : 300);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.currentTarget;
    if (target.src !== podcast.artworkUrl100) {
      target.src = podcast.artworkUrl100 || podcast.artworkUrl600;
    } else {
      target.src = '/podcast-placeholder.svg';
    }
  };

  return (
    <Card className={`h-full overflow-hidden transition-all duration-300 hover:shadow-lg border-border/50 ${featured ? 'hover:shadow-xl hover:scale-[1.02]' : ''}`}>
      <div className="relative aspect-square">
        <Image
          src={artworkUrl}
          alt={podcast.collectionName}
          fill
          className="object-cover"
          sizes={featured ? "(max-width: 768px) 90vw, (max-width: 1200px) 40vw, 25vw" : "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
          onError={handleImageError}
        />
      </div>
      
      <CardHeader className={featured ? 'pb-4' : 'pb-3'}>
        <CardTitle className={`leading-tight font-medium ${featured ? 'text-lg' : 'text-base'}`}>
          {truncateText(podcast.collectionName, featured ? 60 : 50)}
        </CardTitle>
        <div className={`flex items-center text-muted-foreground ${featured ? 'text-sm' : 'text-xs'}`}>
          <User className="ml-2 h-4 w-4" />
          {truncateText(podcast.artistName, featured ? 35 : 30)}
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center justify-center text-s text-muted-foreground">
          <div className="flex items-center">
            <Calendar className="ml-2 h-4 w-4" />
            <span dir="ltr">{formatDate(podcast.releaseDate)}</span>
          </div>
          {podcast.trackTimeMillis && (
            <div className="flex items-center mr-4">
              <Clock className="ml-2 h-4 w-4" />
              <span dir="ltr">{formatDuration(podcast.trackTimeMillis)}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-center text-s text-muted-foreground">
          <span>{podcast.primaryGenreName}</span>
          {podcast.trackCount && (
            <div className="flex items-center mr-4">
              <Headphones className="ml-2 h-4 w-4" />
              {podcast.trackCount} حلقة
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
