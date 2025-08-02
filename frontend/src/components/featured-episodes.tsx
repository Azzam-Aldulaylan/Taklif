"use client";

import React from "react";
import Image from "next/image";
import { Clock, Play, Calendar } from "lucide-react";
import { Podcast } from "@/types/podcast";
import { formatDate, truncateText, getHighResArtwork } from "@/lib/utils";

interface Episode {
  id: string;
  title: string;
  description: string;
  duration: string;
  releaseDate: string;
  podcastName: string;
  artworkUrl: string;
}

interface FeaturedEpisodesProps {
  episodes: Episode[];
  title?: string;
  maxItems?: number;
}

function generateMockEpisodes(podcasts: Podcast[]): Episode[] {
  return podcasts
    .slice(0, 8)
    .flatMap((podcast, index) =>
      Array.from({ length: Math.random() > 0.5 ? 2 : 1 }, (_, i) => ({
        id: `${podcast.collectionId}-episode-${i}`,
        title: `${podcast.collectionName}: الحلقة ${50 - (index * 3 + i)}`,
        description: "",
        duration: `${Math.floor(Math.random() * 60 + 20)}:${Math.floor(
          Math.random() * 60
        )
          .toString()
          .padStart(2, "0")}`,
        releaseDate: new Date(
          Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
        ).toISOString(),
        podcastName: podcast.collectionName,
        artworkUrl: podcast.artworkUrl100 || podcast.artworkUrl600,
      }))
    )
    .slice(0, 12);
}

export function FeaturedEpisodes({
  episodes,
  title = "أفضل الحلقات",
  maxItems = 12,
}: FeaturedEpisodesProps) {
  const displayEpisodes = episodes.slice(0, maxItems);

  if (episodes.length === 0) {
    return null;
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-light tracking-tight text-foreground">
          {title}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {displayEpisodes.map((episode) => (
          <div
            key={episode.id}
            className="flex items-start gap-4 p-4 rounded-xl border border-border/50 bg-card hover:bg-accent/30 transition-all duration-200 cursor-pointer group hover:shadow-sm"
          >
            <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
              <Image
                src={getHighResArtwork(episode.artworkUrl, 100)}
                alt={episode.podcastName}
                fill
                className="object-cover transition-transform duration-200 group-hover:scale-105"
                sizes="64px"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                <Play className="w-5 h-5 text-white" fill="white" />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-s leading-tight mb-2 text-foreground">
                {truncateText(episode.title, 50)}
              </h3>
              {episode.description && (
                <p className="text-s text-muted-foreground mb-3 line-clamp-2 font-light">
                  {truncateText(episode.description, 100)}
                </p>
              )}
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center">
                  <Calendar className="ml-1 h-4 w-4" />
                  <span dir="ltr">{formatDate(episode.releaseDate)}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="ml-1 h-4 w-4" />
                  <span dir="ltr">{episode.duration}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
export { generateMockEpisodes, type Episode };
