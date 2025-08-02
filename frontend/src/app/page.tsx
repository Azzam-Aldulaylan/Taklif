"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { SearchBar } from "@/components/search-bar";
import { SectionedResults } from "@/components/sectioned-results";
import { AboutPage } from "@/components/about-page";
import { BrowsePage } from "@/components/browse-page";
import { ErrorCard } from "@/components/ui/error-card";
import { podcastApi, ApiError } from "@/lib/api";
import { Podcast } from "@/types/podcast";

export default function Home() {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [lastSearchTerm, setLastSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<'home' | 'browse' | 'about'>('home');

  useEffect(() => {
    podcastApi.getHealth().catch(() => setError("حدث خطأ في الاتصال"));
  }, []);

  const handleSearch = async (searchTerm: string) => {
    setIsLoading(true);
    setError(null);
    setHasSearched(true);
    setLastSearchTerm(searchTerm);

    try {
      const response = await podcastApi.searchPodcasts(searchTerm);
      setPodcasts(response.podcasts || []);

      if (response.podcasts?.length === 0) {
        setError(`لم نجد بودكاست لـ "${searchTerm}". جرب كلمة بحث أخرى`);
      }
    } catch (error) {
      setError(error instanceof ApiError ? `خطأ في البحث: ${error.message}` : "حدث خطأ غير متوقع");
      setPodcasts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const resetSearch = () => {
    setError(null);
    setHasSearched(false);
    setPodcasts([]);
    setLastSearchTerm("");
  };

  const navigateTo = (page: typeof currentPage) => {
    setCurrentPage(page);
    if (page === 'home') resetSearch();
  };

  const renderPageContent = () => {
    switch (currentPage) {
      case 'about':
        return <AboutPage onBack={() => navigateTo('home')} />;
      case 'browse':
        return <BrowsePage onBack={() => navigateTo('home')} onSearch={handleSearch} />;
      default:
        return (
          <main className="container mx-auto px-6 py-12 space-y-16">
            {error && (
              <ErrorCard 
                message={error}
                onDismiss={() => setError(null)}
              />
            )}

            <div className="text-center pt-8">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-4xl font-light tracking-tight text-foreground">
                  كل ما عليك هو أن تبدأ بالبحث
                </h2>
              </div>
            </div>

            <div className="text-center">
              <div className="max-w-3xl mx-auto space-y-8">
                <div className="flex justify-center">
                  <SearchBar
                    onSearch={handleSearch}
                    isLoading={isLoading}
                    placeholder="رحلتك تبدأ بكلمة… ابحث الآن"
                  />
                </div>
              </div>
            </div>

            {hasSearched && (
              <div key={lastSearchTerm} className="space-y-12 animate-slide-up">
                {podcasts.length > 0 && !isLoading && (
                  <div className="text-center animate-slide-up-delay-1">
                    <p className="text-base font-light text-muted-foreground">
                      وجدنا لك {
                        podcasts.length === 1 
                          ? "بودكاست واحد" 
                          : podcasts.length === 2 
                          ? "بودكاسين" 
                          : `${podcasts.length} بودكاست رائع`
                      }
                    </p>
                  </div>
                )}

                <div className="animate-slide-up-delay-2">
                  <SectionedResults
                    featuredPodcasts={podcasts.slice(0, 8)}
                    allPodcasts={podcasts}
                    isLoading={isLoading}
                    searchTerm={lastSearchTerm || undefined}
                  />
                </div>
              </div>
            )}
          </main>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        onSearchClick={() => navigateTo('home')}
        onBrowseClick={() => navigateTo('browse')}
        onAboutClick={() => navigateTo('about')}
      />
      {renderPageContent()}
    </div>
  );
}
