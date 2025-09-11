"use client";

import React, { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  onSearch: (term: string) => void;
  isLoading?: boolean;
  placeholder?: string;
  isLarge?: boolean;
}

export function SearchBar({
  onSearch,
  isLoading = false,
  placeholder = "ابحث عن البودكاست المفضل لديك...",
  isLarge = false,
}: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [direction, setDirection] = useState<'ltr' | 'rtl'>('rtl');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    // Detect if text contains Arabic characters
    const arabicRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/;
    const hasArabic = arabicRegex.test(value);
    
    // Set direction based on content
    if (value.length === 0) {
      setDirection('rtl');
    } else if (hasArabic) {
      setDirection('rtl');
    } else {
      setDirection('ltr');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm.trim());
    }
  };

  const showButton = searchTerm.trim().length > 0;

  return (
    <div className={`w-full animate-search-enter ${
      isLarge ? 'max-w-4xl search-bar-large' : 'max-w-2xl search-bar-small'
    }`}>
      <form onSubmit={handleSubmit} className="relative">

        <Search className={`absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-all duration-200 ease-out ${
          isLarge ? 'h-6 w-6' : 'h-5 w-5'
        } ${direction === 'ltr' ? 'opacity-0' : 'opacity-100'}`} />
        
        <Search className={`absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-all duration-200 ease-out ${
          isLarge ? 'h-6 w-6' : 'h-5 w-5'
        } ${direction === 'ltr' ? 'opacity-100' : 'opacity-0'}`} />
        
        <Input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={handleInputChange}
          dir={direction}
          className={`search-input text-base bg-background border-border/50 focus:border-primary/50 rounded-xl shadow-sm transition-all duration-200 ease-out ${
            isLarge ? 'h-16 text-lg shadow-lg border-2 mr-1 ' : 'h-12 shadow-md border'
          }`}
          disabled={isLoading}
        />
        <div
          className={`absolute ${direction === 'rtl' ? 'left-1' : 'right-1 mr-2'} top-1/2 -translate-y-1/2 transition-all duration-300 ${
            showButton
              ? "opacity-100 translate-x-0 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          } ${direction === 'ltr' ? '-translate-x-2' : 'translate-x-0.5'}`}
        >
          <Button
            type="submit"
            variant="secondary"
            disabled={!searchTerm.trim() || isLoading}
            isLoading={isLoading}
            className={`button-style bg-white/30 border border-border/50 rounded-lg font-medium transition-all duration-200 ease-out ${
              isLarge ? 'h-12 px-8 text-base shadow-lg' : 'h-10 px-6 text-sm shadow-md'
            }`}
          >
            ابحث
          </Button>
        </div>
      </form>
    </div>
  );
}
