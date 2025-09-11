"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Clock, Calendar, User, Headphones, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Podcast } from "@/types/podcast";
import {
  formatDate,
  formatDuration,
  truncateText,
  getHighResArtwork,
  formatEpisodeCount,
} from "@/lib/utils";

interface PodcastCardProps {
  podcast: Podcast;
  featured?: boolean;
}

export function PodcastCard({ podcast, featured = false }: PodcastCardProps) {
  const [imageLoaded, setImageLoaded] = React.useState(false);
  const [imageError, setImageError] = React.useState(false);
  
  const artworkUrl = getHighResArtwork(
    podcast.artworkUrl100 || podcast.artworkUrl600,
    featured ? 400 : 300
  );

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.currentTarget;
    if (target.src !== podcast.artworkUrl100 && !imageError) {
      target.src = podcast.artworkUrl100 || podcast.artworkUrl600;
    } else {
      setImageError(true);
      target.src = "/podcast-placeholder.svg";
    }
  };

  return (
    <Link href={`/podcast/${podcast.id}`} className="block h-full">
      <Card
        className={`h-full overflow-hidden transition-all duration-300 hover:shadow-lg border-border/50 cursor-pointer ${
          featured ? "hover:shadow-xl hover:scale-[1.02]" : ""
        } flex flex-col`}
      >
        <div className="relative aspect-square">
          {/* Placeholder while image is loading */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
              <div className="w-16 h-16 bg-gray-300 rounded-lg animate-pulse"></div>
            </div>
          )}
          
          <Image
            src={artworkUrl}
            alt={podcast.collectionName}
            fill
            className={`object-cover transition-opacity duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            sizes={
              featured
                ? "(max-width: 768px) 90vw, (max-width: 1200px) 40vw, 25vw"
                : "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            }
            onLoad={handleImageLoad}
            onError={handleImageError}
            priority={featured}
          />
        </div>

        <div className="flex flex-col flex-1 bg-white/90">
          <CardHeader className={`${featured ? "pb-3" : "pb-2"} flex-shrink-0`}>
            <CardTitle
              className={`text-center leading-tight font-medium ${
                featured ? "text-lg" : "text-base"
              } ${featured ? "h-14" : "h-12"} flex items-center justify-center`}
            >
              <span className="line-clamp-2">
                {truncateText(podcast.collectionName, featured ? 60 : 50)}
              </span>
            </CardTitle>
            <div
              className={`flex items-center justify-center text-muted-foreground ${
                featured ? "text-sm" : "text-xs"
              } h-6`}
            >
              <User className="ml-2 h-4 w-4 flex-shrink-0" />
              <span className="line-clamp-1">
                {truncateText(podcast.artistName, featured ? 35 : 30)}
              </span>
            </div>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col justify-between space-y-3 text-center pt-0">
            <div className="space-y-2">
              <div className="flex items-center justify-center text-sm text-muted-foreground gap-4 h-6">
                <div className="flex items-center">
                  <Calendar className="ml-2 h-4 w-4 flex-shrink-0" />
                  <span dir="ltr" className="text-xs">
                    {formatDate(podcast.releaseDate)}
                  </span>
                </div>
                {podcast.trackTimeMillis && (
                  <div className="flex items-center">
                    <Clock className="ml-2 h-4 w-4 flex-shrink-0" />
                    <span dir="ltr" className="text-xs">
                      {formatDuration(podcast.trackTimeMillis)}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-center text-sm text-muted-foreground gap-4 h-6">
                {podcast.trackCount && (
                  <div className="flex items-center">
                    <Headphones className="ml-2 h-4 w-4 flex-shrink-0" />
                    <span className="text-xs">
                      {formatEpisodeCount(podcast.trackCount)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-center pt-2 mt-auto">
              <button
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  window.open(
                    podcast.trackViewUrl,
                    "_blank",
                    "noopener,noreferrer"
                  );
                }}
                className="button-style flex items-center gap-2 text-xs py-2 px-3 rounded-full"
              >
                <ExternalLink className="h-3 w-3 flex-shrink-0 font-medium" />
                <span className=" text-sm ">عرض في iTunes</span>
              </button>
            </div>
          </CardContent>
        </div>
      </Card>
    </Link>
  );
}
