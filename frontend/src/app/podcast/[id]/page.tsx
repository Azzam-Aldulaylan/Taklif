"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
  ArrowRight,
  Calendar,
  Clock,
  User,
  Headphones,
  ExternalLink,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/header";
import { Podcast, Episode } from "@/types/podcast";
import { podcastApi } from "@/lib/api";
import {
  formatDate,
  getHighResArtwork,
  formatEpisodeCount,
} from "@/lib/utils";

export default function PodcastDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [podcast, setPodcast] = useState<Podcast | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleHeaderSearch = (searchTerm: string) => {
    router.push(`/?search=${encodeURIComponent(searchTerm)}`);
  };

  const handleLogoClick = () => {
    router.push('/');
  };

  const handleBackClick = () => {
    // Use browser's history to go back, preserving search results
    if (window.history.length > 1) {
      router.back();
    } else {
      // Fallback to home page if no history
      router.push('/');
    }
  };

  useEffect(() => {
    const fetchPodcastDetails = async () => {
      if (!params.id) return;

      try {
        setLoading(true);
        setError(null);

        const podcastId = parseInt(params.id as string, 10);
        if (isNaN(podcastId)) {
          setError("معرف البودكاست غير صحيح");
          return;
        }

        // Get podcast details
        const response = await podcastApi.getPodcastById(podcastId);
        setPodcast(response.podcast);

        // Get episodes from RSS feed
        try {
          const episodesResponse = await podcastApi.getEpisodesByPodcastId(podcastId);
          setEpisodes(episodesResponse.episodes || []);
        } catch (episodeError) {
          console.error("Error fetching episodes:", episodeError);
          setEpisodes([]); // Show podcast without episodes if RSS fails
        }
      } catch (error) {
        console.error("Error fetching podcast details:", error);
        setError("فشل في تحميل تفاصيل البودكاست");
      } finally {
        setLoading(false);
      }
    };

    fetchPodcastDetails();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-6 py-8">
          {/* Loading Skeleton */}
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-32 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Podcast Info Skeleton */}
              <div className="lg:col-span-1">
                <div className="aspect-square bg-muted rounded-xl mb-6"></div>
                <div className="space-y-4">
                  <div className="h-6 bg-muted rounded w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                  <div className="h-4 bg-muted rounded w-2/3"></div>
                </div>
              </div>
              {/* Episodes List Skeleton */}
              <div className="lg:col-span-2">
                <div className="h-6 bg-muted rounded w-48 mb-6"></div>
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-20 bg-muted rounded-xl"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !podcast) {
    return (
      <div className="min-h-screen bg-background">
        <Header 
          showSearchBar={true}
          onSearch={handleHeaderSearch}
          onLogoClick={handleLogoClick}
          searchPlaceholder="ابحث عن بودكاست..."
        />
        <div className="flex items-center justify-center flex-1 mt-20">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">
              {error || "البودكاست غير موجود"}
            </h1>
            <Button variant="outline" onClick={handleBackClick}>
              <ArrowRight className="ml-2 h-4 w-4" />
              العودة
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header 
        showSearchBar={true}
        onSearch={handleHeaderSearch}
        onLogoClick={handleLogoClick}
        searchPlaceholder="ابحث عن بودكاست..."
      />
      <div className="container mx-auto px-6 py-8">
        {/* Back Button */}
        <Button variant="outline" className="mb-8" onClick={handleBackClick}>
          <ArrowRight className="ml-2 h-4 w-4" />
          العودة
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Podcast Info Card */}
          <div className="lg:col-span-1">
            <Card className="overflow-hidden">
              <div className="relative aspect-square">
                <Image
                  src={getHighResArtwork(
                    podcast.artworkUrl600 || podcast.artworkUrl100,
                    600
                  )}
                  alt={podcast.collectionName}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              <CardHeader className="text-center">
                <CardTitle className="text-xl font-bold leading-tight">
                  {podcast.collectionName}
                </CardTitle>
                <div className="flex items-center justify-center text-muted-foreground text-sm">
                  <User className="ml-2 h-4 w-4" />
                  {podcast.artistName}
                </div>
              </CardHeader>

              <CardContent className="space-y-4 text-center">
                <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Calendar className="ml-2 h-4 w-4" />
                    <span dir="ltr">{formatDate(podcast.releaseDate)}</span>
                  </div>
                  <div className="flex items-center">
                    <Headphones className="ml-2 h-4 w-4" />
                    {formatEpisodeCount(podcast.trackCount)}
                  </div>
                </div>

                <div className="text-sm text-muted-foreground">
                  <span className="px-3 py-1 bg-muted rounded-full">
                    {podcast.primaryGenreName}
                  </span>
                </div>

                {podcast.trackViewUrl && (
                  <a
                    href={podcast.trackViewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="button-style flex items-center justify-center gap-2 text-sm py-3 px-4 rounded-full w-full"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>عرض في iTunes</span>
                  </a>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Episodes List */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-foreground">
                {formatEpisodeCount(episodes.length)}
              </h2>
            </div>

            <div className="space-y-4">
              {episodes.length > 0 ? (
                episodes.map((episode, index) => (
                  <Card
                    key={episode.id || `episode-${index}`} // for some reason some podcasts don't have a episode id..?
                    className="overflow-hidden hover:shadow-md transition-shadow duration-200"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={
                              episode.imageUrl ||
                              getHighResArtwork(
                                podcast.artworkUrl600 || podcast.artworkUrl100,
                                100
                              )
                            }
                            alt={episode.title}
                            fill
                            className="object-cover"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-foreground text-lg leading-tight mb-2">
                            {episode.title}
                          </h3>

                          {episode.description && (
                            <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                              {episode.description}
                            </p>
                          )}

                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center">
                              <Calendar className="ml-1 h-3 w-3" />
                              <span dir="ltr">
                                {formatDate(episode.publishDate)}
                              </span>
                            </div>
                            {episode.duration && (
                              <div className="flex items-center">
                                <Clock className="ml-1 h-3 w-3" />
                                <span dir="ltr">{episode.duration}</span>
                              </div>
                            )}
                            {episode.episodeNumber && (
                              <div className="flex items-center">
                                <span>الحلقة {episode.episodeNumber}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-muted-foreground">
                      لا توجد حلقات متاحة لهذا البودكاست.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
