'use client';

import React from 'react';
import { AlertCircle, X } from 'lucide-react';

interface ErrorCardProps {
  message: string;
  onDismiss?: () => void;
  isDismissed?: boolean;
  className?: string;
}

export function ErrorCard({ 
  message, 
  onDismiss, 
  isDismissed = false, 
  className = "" 
}: ErrorCardProps) {
  return (
    <div
      className={`max-w-md mx-auto ${
        isDismissed ? "animate-fade-out" : "animate-fade-in-up"
      } ${className}`}
    >
      <div className="relative bg-accent/20 border border-muted rounded-lg p-3 text-sm">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
            <p className="text-foreground font-light">{message}</p>
          </div>
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0 mt-0.5"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
