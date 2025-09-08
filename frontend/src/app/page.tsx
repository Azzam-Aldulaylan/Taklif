"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/header";
import { SearchBar } from "@/components/search-bar";
import { SectionedResults } from "@/components/sectioned-results";
import { AboutPage } from "@/components/about-page";
import { BrowsePage } from "@/components/browse-page";
import { ErrorCard } from "@/components/ui/error-card";
import { podcastApi, ApiError } from "@/lib/api";
import { Podcast } from "@/types/podcast";

function HomeContent() {
  const searchParams = useSearchParams();
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [lastSearchTerm, setLastSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<"home" | "browse" | "about">("home");
  const [showHeaderSearch, setShowHeaderSearch] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    podcastApi.getHealth().catch(() => setError("حدث خطأ في الاتصال"));
  }, []);

  const handleSearch = useCallback(async (searchTerm: string) => {
    setIsLoading(true);
    setError(null);

    if (!hasSearched) {
      setIsTransitioning(true);
      setTimeout(() => {
        setHasSearched(true);
        setIsTransitioning(false);
      }, 400);
    }

    setLastSearchTerm(searchTerm);

    try {
      const response = await podcastApi.searchPodcasts(searchTerm);
      setPodcasts(response.podcasts || []);
      sessionStorage.setItem("lastSearchTerm", searchTerm);
      sessionStorage.setItem("lastSearchResults", JSON.stringify(response.podcasts || []));

      if (response.podcasts?.length === 0) {
        setError(`لم نجد بودكاست لـ "${searchTerm}". جرب كلمة بحث أخرى`);
      }
    } catch (error) {
      setError(error instanceof ApiError ? `خطأ في البحث: ${error.message}` : "حدث خطأ غير متوقع");
      setPodcasts([]);
    } finally {
      setIsLoading(false);
    }
  }, [hasSearched]);

  // Handle URL search params and session storage
  useEffect(() => {
    const searchQuery = searchParams.get("search");
    if (searchQuery?.trim()) {
      setCurrentPage("home");
      handleSearch(searchQuery.trim());
      return;
    }

    const storedSearchTerm = sessionStorage.getItem("lastSearchTerm");
    const storedResults = sessionStorage.getItem("lastSearchResults");
    
    if (storedSearchTerm && storedResults && !hasSearched) {
      try {
        const parsedResults = JSON.parse(storedResults);
        setLastSearchTerm(storedSearchTerm);
        setPodcasts(parsedResults);
        setHasSearched(true);
      } catch (error) {
        console.error("Failed to parse stored search results:", error);
      }
    }
  }, [searchParams, hasSearched, handleSearch]);

  // Scroll detection for header search
  useEffect(() => {
    const handleScroll = () => {
      const shouldShow = window.scrollY > 200;
      if (shouldShow !== showHeaderSearch) {
        setShowHeaderSearch(shouldShow);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [showHeaderSearch]);

  const resetSearch = () => {
    setError(null);
    setHasSearched(false);
    setIsTransitioning(false);
    setPodcasts([]);
    setLastSearchTerm("");
    sessionStorage.removeItem("lastSearchTerm");
    sessionStorage.removeItem("lastSearchResults");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navigateTo = (page: typeof currentPage) => {
    setCurrentPage(page);
    if (page === "home" && currentPage === "about") {
      resetSearch();
    }
  };

  const handleBrowseSearch = async (searchTerm: string) => {
    setCurrentPage("home");
    await handleSearch(searchTerm);
  };

  const handleLogoClick = () => {
    resetSearch();
    setCurrentPage("home");
    const url = new URL(window.location.href);
    url.searchParams.delete("search");
    window.history.replaceState({}, "", url.pathname);
  };

  // Render different page sections
  const renderInitialState = () => (
    <div className="text-center animate-fade-in -mt-60">
      <div className={isTransitioning ? "animate-title-fade-out" : ""}>
        <div className="flex justify-center">
          <Image
            src="/logo.png"
            alt="Logo"
            width={280}
            height={280}
            priority
            className="rounded-full -mb-6"
          />
        </div>
        <h2 className="text-2xl md:text-3xl font-medium tracking-tight text-foreground/80 mb-16">
          كل ما عليك هو أن تبدأ بالبحث
        </h2>
      </div>

      <div className={`flex justify-center animate-delay-1 mt-8 ${isTransitioning ? "animate-search-center-to-top" : ""}`}>
        <SearchBar
          onSearch={handleSearch}
          isLoading={isLoading}
          placeholder="رحلتك تبدأ بكلمة… ابحث الآن"
          isLarge={true}
        />
      </div>
    </div>
  );

  const renderTransitionState = () => (
    <div className="text-center space-y-12">
      <div className="space-y-8 animate-title-fade-out">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-foreground mb-4">
          تكليف
        </h1>
        <h2 className="text-2xl md:text-3xl font-medium tracking-tight text-foreground/80">
          كل ما عليك هو أن تبدأ بالبحث
        </h2>
      </div>

      <div className="flex justify-center animate-search-center-to-top">
        <SearchBar
          onSearch={handleSearch}
          isLoading={isLoading}
          placeholder="رحلتك تبدأ بكلمة… ابحث الآن"
          isLarge={false}
        />
      </div>
    </div>
  );

  const renderSearchResults = () => (
    <>
      <div className="text-center pt-8 animate-content-slide-up">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-medium tracking-tight text-foreground">
            كل ما عليك هو أن تبدأ بالبحث
          </h2>
        </div>
      </div>

      <div className="text-center animate-content-slide-up">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="flex justify-center">
            <SearchBar
              onSearch={handleSearch}
              isLoading={isLoading}
              placeholder="رحلتك تبدأ بكلمة… ابحث الآن"
              isLarge={false}
            />
          </div>
        </div>
      </div>

      <div key={lastSearchTerm} className="space-y-12 animate-content-slide-up">
        {podcasts.length > 0 && !isLoading && (
          <div className="text-center animate-slide-up-delay-1">
            <p className="text-base font-light text-muted-foreground">
              وجدنا لك{" "}
              {podcasts.length === 1
                ? "بودكاست واحد"
                : podcasts.length === 2
                ? "بودكاسين"
                : `${podcasts.length} بودكاست رائع`}
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
    </>
  );

  const renderHomeContent = () => {
    const mainClasses = `container mx-auto px-6 transition-all duration-300 ease-out ${
      hasSearched ? "py-12 space-y-16" : "min-h-screen flex flex-col justify-center py-12"
    }`;

    return (
      <main className={mainClasses}>
        {error && <ErrorCard message={error} onDismiss={() => setError(null)} />}
        
        {!hasSearched && !isTransitioning && renderInitialState()}
        {isTransitioning && renderTransitionState()}
        {hasSearched && !isTransitioning && renderSearchResults()}
      </main>
    );
  };

  const renderPageContent = () => {
    switch (currentPage) {
      case "about":
        return <AboutPage onBack={() => navigateTo("home")} />;
      case "browse":
        return <BrowsePage onBack={() => navigateTo("home")} onSearch={handleBrowseSearch} />;
      default:
        return renderHomeContent();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        onSearchClick={() => navigateTo("home")}
        onBrowseClick={() => navigateTo("browse")}
        onAboutClick={() => navigateTo("about")}
        showSearchBar={currentPage === "home" && showHeaderSearch}
        onSearch={handleBrowseSearch}
        searchPlaceholder="ابحث عن بودكاست..."
        onLogoClick={handleLogoClick}
      />
      {renderPageContent()}
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div>...</div>}>
      <HomeContent />
    </Suspense>
  );
}
