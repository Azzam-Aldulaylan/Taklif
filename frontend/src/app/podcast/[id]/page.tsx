"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
  ArrowRight,
  Calendar,
  Clock,
  User,
  Headphones,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/header";
import { Podcast, Episode } from "@/types/podcast";
import { podcastApi } from "@/lib/api";
import { formatDate, getHighResArtwork, formatEpisodeCount } from "@/lib/utils";

export default function PodcastDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [podcast, setPodcast] = useState<Podcast | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalEpisodes, setTotalEpisodes] = useState(0);
  const [newlyLoadedCount, setNewlyLoadedCount] = useState(0);
  const observerTarget = useRef<HTMLDivElement>(null);

  const loadMoreEpisodes = useCallback(async () => {
    if (!podcast || loadingMore || !hasMore) {
      return;
    }

    try {
      setLoadingMore(true);
      const podcastId = parseInt(params.id as string, 10);
      const nextPage = currentPage + 1;

      const response = await podcastApi.getEpisodesByPodcastId(
        podcastId,
        nextPage,
        10
      );

      if (response.episodes.length > 0) {
        setEpisodes((prev) => [...prev, ...response.episodes]);
        setNewlyLoadedCount(response.episodes.length);
        setCurrentPage(nextPage);
        setHasMore(response.hasMore);

        // Clear animation state after animation completes
        setTimeout(() => setNewlyLoadedCount(0), 600);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error loading more episodes:", error);
      setHasMore(false);
    } finally {
      setLoadingMore(false);
    }
  }, [podcast, loadingMore, hasMore, currentPage, params.id]);

  // Intersection Observer for infinite scrolling
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasMore && !loadingMore) {
          loadMoreEpisodes();
        }
      },
      {
        threshold: 0.1,
        rootMargin: "100px", // Trigger 100px before reaching the element
      }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [loadMoreEpisodes, hasMore, loadingMore]);

  const handleHeaderSearch = (searchTerm: string) => {
    router.push(`/?search=${encodeURIComponent(searchTerm)}`);
  };

  const handleLogoClick = () => {
    router.push("/");
  };

  const handleBackClick = () => {
    // Try router.back() first, but with a fallback to a specific page
    const referrer = document.referrer;
    const isFromSameOrigin =
      referrer && referrer.includes(window.location.origin);

    if (isFromSameOrigin) {
      router.back();
    } else {
      // If no referrer or from external, go to home
      router.push("/");
    }
  };

  const handleEpisodeClick = (episode: Episode) => {
    const targetUrl = episode.itunesUrl || podcast?.trackViewUrl;

    if (!targetUrl) {
      console.warn(
        "No Apple Podcasts URL available for episode:",
        episode.title
      );
      return;
    }

    // Open in Apple Podcasts
    window.open(targetUrl, "_blank", "noopener,noreferrer");
  };

  const handleAboutClick = () => {
    console.log("Navigating to About page");
    
    router.push("/about");
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

        // Get first page of episodes from RSS feed with pagination
        try {
          const episodesResponse = await podcastApi.getEpisodesByPodcastId(
            podcastId,
            1,
            10
          );
          setEpisodes(episodesResponse.episodes || []);
          setHasMore(episodesResponse.hasMore);
          setTotalEpisodes(episodesResponse.total);
          setCurrentPage(episodesResponse.currentPage);
        } catch (episodeError) {
          console.error("Error fetching episodes:", episodeError);
          setEpisodes([]); // Show podcast without episodes if RSS fails
          setHasMore(false);
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
          onAboutClick={handleAboutClick}
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
        <div className=" flex align-items-center mb-8 animate-fade-in">
          <Button
            variant="ghost"
            className="flex gap-2"
            onClick={handleBackClick}
          >
            <ArrowRight className="ml-2 h-4 w-4" />
            العودة
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 animate-delay-1">
            <Card className="overflow-hidden bg-white/90">
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
            <div className="mb-6 animate-delay-2">
              <h2 className="text-2xl font-bold text-foreground">
                {totalEpisodes > 0
                  ? formatEpisodeCount(totalEpisodes)
                  : formatEpisodeCount(episodes.length)}
              </h2>
              {totalEpisodes > episodes.length && (
                <p className="text-sm text-muted-foreground mt-1">
                  تم تحميل {episodes.length} من {totalEpisodes} حلقة
                </p>
              )}
            </div>

            {/* Episodes content */}
            <div className="space-y-4 animate-delay-3">
              {episodes.length > 0 ? (
                <>
                  {episodes.map((episode, index) => {
                    const episodeId = episode.id || `episode-${index}`;
                    const isNewlyLoaded =
                      index >= episodes.length - newlyLoadedCount;
                    const animationDelay = isNewlyLoaded
                      ? (index - (episodes.length - newlyLoadedCount)) * 100
                      : 0;

                    return (
                      <Card
                        key={episodeId}
                        className={`bg-white/90 episode-item overflow-hidden hover:shadow-md transition-all duration-200 cursor-pointer ${
                          isNewlyLoaded ? "episode-new" : ""
                        }`}
                        style={
                          isNewlyLoaded
                            ? { animationDelay: `${animationDelay}ms` }
                            : undefined
                        }
                        onClick={() => handleEpisodeClick(episode)}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                              <Image
                                src={
                                  episode.imageUrl ||
                                  getHighResArtwork(
                                    podcast.artworkUrl600 ||
                                      podcast.artworkUrl100,
                                    100
                                  )
                                }
                                alt={episode.title}
                                fill
                                className="object-cover"
                              />
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <h3 className="font-semibold text-foreground text-lg leading-tight mb-2">
                                  {episode.title}
                                </h3>
                                <div
                                  className="flex-shrink-0"
                                  title="فتح في Apple Podcasts"
                                >
                                  <ExternalLink className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors" />
                                </div>
                              </div>

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
                    );
                  })}

                  {/* Infinite scroll trigger */}
                  {hasMore && (
                    <div
                      ref={observerTarget}
                      className="py-8 flex items-center justify-center min-h-[60px]"
                    >
                      {loadingMore ? (
                        <div className="flex items-center justify-center">
                          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                          <span className="mr-2 text-muted-foreground">
                            تحميل المزيد من الحلقات...
                          </span>
                        </div>
                      ) : (
                        <div className="text-center">
                          <Button
                            variant="outline"
                            onClick={loadMoreEpisodes}
                            disabled={loadingMore}
                            className="transition-all duration-200 hover:scale-105"
                          >
                            تحميل المزيد من الحلقات
                          </Button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* End indicator */}
                  {!hasMore && episodes.length > 0 && (
                    <div className="py-4 text-center">
                      <p className="text-muted-foreground text-sm">
                        تم عرض جميع الحلقات (
                        {formatEpisodeCount(episodes.length)})
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <Card className="animate-delay-4">
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
