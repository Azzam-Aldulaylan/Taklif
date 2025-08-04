"use client";

import React, { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  onSearch: (term: string) => void;
  isLoading?: boolean;
  placeholder?: string;
}

export function SearchBar({
  onSearch,
  isLoading = false,
  placeholder = "ابحث عن البودكاست المفضل لديك...",
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
    <div className="w-full max-w-2xl animate-search-enter">
      <form onSubmit={handleSubmit} className="relative">
        <Search className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSearchTerm(e.target.value)
          }
          className={`search-input pl-12 h-12 text-base bg-background border-border/50 focus:border-primary/50 rounded-xl shadow-sm transition-all duration-300 pr-10`}
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
            className="bg-white/30 border border-border/50 left-4 h-10 px-6 rounded-lg font-medium text-sm"
          >
            ابحث
          </Button>
        </div>
      </form>
    </div>
  );
}
