import React from 'react';

interface LoadingSkeletonProps {
  sections?: number[];
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ 
  sections = [8, 6, 8] 
}) => (
  <div className="space-y-16">
    {sections.map((count, sectionIndex) => (
      <div key={sectionIndex} className="space-y-6">
        <div className="h-8 bg-gray-300 rounded w-48 animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: count }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-gray-300 aspect-square rounded-lg mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="h-3 bg-gray-300 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);
