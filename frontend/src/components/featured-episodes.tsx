"use client";

import React from "react";
import Image from "next/image";
import { Clock, Play, Calendar } from "lucide-react";
import { formatDate, truncateText, getHighResArtwork, openInItunes, formatEpisodeDuration } from "@/lib";

import { FeaturedEpisode } from "@/hooks";

interface FeaturedEpisodesProps {
  episodes: FeaturedEpisode[];
  title?: string;
  maxItems?: number;
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
            className="flex items-start gap-3 p-3 rounded-xl border border-border/0 bg-white hover:bg-accent/30 transition-all duration-200 cursor-pointer group hover:shadow-sm h-24"
            onClick={() => {
              if (episode.itunesUrl) {
                openInItunes(episode.itunesUrl);
              } else {
                alert('رابط iTunes غير متوفر لهذه الحلقة');
              }
            }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                if (episode.itunesUrl) {
                  openInItunes(episode.itunesUrl);
                } else {
                  alert('رابط iTunes غير متوفر لهذه الحلقة');
                }
              }
            }}
          >
            <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
              <Image
                src={getHighResArtwork(episode.artworkUrl, 100)}
                alt={episode.podcastName}
                fill
                className="object-cover transition-transform duration-200 group-hover:scale-105"
                sizes="56px"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                <Play className="w-4 h-4 text-white" fill="white" />
              </div>
            </div>

            <div className="flex-1 min-w-0 flex flex-col justify-between h-full py-1">
              <div className="flex-1 space-y-1">
                <h3 className="font-medium text-sm leading-tight text-foreground line-clamp-2">
                  {truncateText(episode.title, 70)}
                </h3>
                {episode.description && (
                  <p className="text-xs text-muted-foreground font-light line-clamp-1">
                    {truncateText(episode.description, 65)}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground flex-shrink-0 mt-1">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3 flex-shrink-0" />
                  <span dir="ltr" className="translate-y-0.5">{formatDate(episode.releaseDate)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3 flex-shrink-0" />
                  <span dir="ltr" className="translate-y-0.5">{formatEpisodeDuration(episode.duration)}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
