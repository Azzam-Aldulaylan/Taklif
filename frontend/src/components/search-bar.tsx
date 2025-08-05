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
        }`} />
        <Input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSearchTerm(e.target.value)
          }
          className={`search-input pl-14 text-base bg-background border-border/50 focus:border-primary/50 rounded-xl shadow-sm transition-all duration-200 ease-out pr-10 ${
            isLarge ? 'h-16 text-lg shadow-lg border-2 mr-1 ' : 'h-12 shadow-md border'
          }`}
          disabled={isLoading}
        />
        <div
          className={`absolute left-1 top-1/2 -translate-y-1/2 transition-all duration-300 ${
            showButton
              ? "opacity-100 translate-x-0 pointer-events-auto"
              : "opacity-0 -translate-x-2 pointer-events-none"
          }`}
        >
          <Button
            type="submit"
            variant="secondary"
            disabled={!searchTerm.trim() || isLoading}
            isLoading={isLoading}
            className={`button-style bg-white/30 border border-border/50 left-6 rounded-lg font-medium transition-all duration-200 ease-out ${
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
