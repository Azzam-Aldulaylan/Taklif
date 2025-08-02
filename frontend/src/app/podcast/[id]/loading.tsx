import React from 'react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        <div className="animate-pulse">
          {/* Back button skeleton */}
          <div className="h-10 bg-muted rounded w-24 mb-8"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Podcast info skeleton */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-lg p-0 overflow-hidden">
                <div className="aspect-square bg-muted"></div>
                <div className="p-6 space-y-4">
                  <div className="h-6 bg-muted rounded w-3/4 mx-auto"></div>
                  <div className="h-4 bg-muted rounded w-1/2 mx-auto"></div>
                  <div className="h-4 bg-muted rounded w-2/3 mx-auto"></div>
                  <div className="h-10 bg-muted rounded w-full"></div>
                </div>
              </div>
            </div>
            
            {/* Episodes list skeleton */}
            <div className="lg:col-span-2">
              <div className="h-8 bg-muted rounded w-48 mb-6"></div>
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="bg-card rounded-lg p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 bg-muted rounded-lg flex-shrink-0"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-5 bg-muted rounded w-3/4"></div>
                        <div className="h-4 bg-muted rounded w-full"></div>
                        <div className="h-4 bg-muted rounded w-5/6"></div>
                        <div className="flex gap-4">
                          <div className="h-3 bg-muted rounded w-20"></div>
                          <div className="h-3 bg-muted rounded w-16"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
