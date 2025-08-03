'use client';

import React, { useState, useEffect } from 'react';
import { ArrowRight, TrendingUp, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FeaturedPodcasts } from '@/components/featured-podcasts';
import { podcastApi } from '@/lib/api';
import { Podcast } from '@/types/podcast';

interface BrowsePageProps {
  onBack: () => void;
  onSearch: (term: string) => void;
}

const POPULAR_CATEGORIES = [
  'تقنية', 'علوم', 'تاريخ', 'فلسفة', 'أعمال', 'صحة', 
  'رياضة', 'طبخ', 'موسيقى', 'أدب', 'سياسة', 'اقتصاد'
];

const QUICK_SUGGESTIONS = [
  'بودكاست عربي', 'تطوير الذات', 'ريادة الأعمال', 'علم النفس',
  'التاريخ الإسلامي', 'برمجة', 'ذكاء اصطناعي', 'صحة ولياقة'
];

const LoadingSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {Array.from({ length: 8 }).map((_, index) => (
      <div key={index} className="animate-pulse">
        <div className="bg-gray-300 aspect-square rounded-lg mb-4"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          <div className="h-3 bg-gray-300 rounded w-1/2"></div>
          <div className="h-3 bg-gray-300 rounded w-2/3"></div>
        </div>
      </div>
    ))}
  </div>
);

interface BrowsePageProps {
  onBack: () => void;
  onSearch: (term: string) => void;
}

export function BrowsePage({ onBack, onSearch }: BrowsePageProps) {
  const [popularPodcasts, setPopularPodcasts] = useState<Podcast[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPopularPodcasts = async () => {
      try {
        setIsLoading(true);
        const response = await podcastApi.searchPodcasts('تقنية');
        setPopularPodcasts(response.podcasts?.slice(0, 12) || []);
      } catch (error) {
        console.error('Failed to fetch popular podcasts:', error);
        setPopularPodcasts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPopularPodcasts();
  }, []);

  const handleCategorySearch = (term: string) => {
    onBack();
    onSearch(term);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-12">
        {/* Back button */}
        <div className="mb-8 animate-fade-in">
          <Button 
            onClick={onBack}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <ArrowRight className="h-4 w-4" />
            <span>العودة للرئيسية</span>
          </Button>
        </div>

        <div className="space-y-12">
          {/* Page title */}
          <div className="text-center animate-delay-1">
            <h1 className="text-4xl font-light tracking-tight text-foreground mb-4">
              تصفح البودكاست
            </h1>
            <p className="text-lg text-muted-foreground">
              اكتشف أفضل البودكاست والمحتوى الأكثر شعبية
            </p>
          </div>

          {/* Categories card */}
          <Card className="animate-delay-2">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-2xl font-light">
                <TrendingUp className="h-6 w-6 text-primary" />
                <span>الفئات الشائعة</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {POPULAR_CATEGORIES.map((term, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    onClick={() => handleCategorySearch(term)}
                    className="h-12 text-base font-normal hover:bg-primary hover:text-primary-foreground"
                  >
                    {term}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Popular podcasts section */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2 animate-delay-3">
              <Star className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-light tracking-tight">
                البودكاست الأكثر شعبية
              </h2>
            </div>
            
            {/* Podcast list */}
            <div className="animate-delay-4">
              {isLoading ? (
                <LoadingSkeleton />
              ) : popularPodcasts.length > 0 ? (
                <FeaturedPodcasts
                  podcasts={popularPodcasts}
                  title="البودكاست الأكثر شعبية"
                  maxItems={12}
                />
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <p className="text-muted-foreground">
                      لا توجد بودكاست متاحة حالياً. تأكد من اتصال الخادم.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Quick suggestions card */}
          <Card className="animate-delay-4">
            <CardHeader>
              <CardTitle className="text-2xl font-light">اقتراحات البحث السريع</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {QUICK_SUGGESTIONS.map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="secondary"
                      size="sm"
                      onClick={() => handleCategorySearch(suggestion)}
                      className="text-sm"
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
