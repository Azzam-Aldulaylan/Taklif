"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Search } from "lucide-react";

interface HeaderProps {
  onSearchClick?: () => void;
  onBrowseClick?: () => void;
  onAboutClick?: () => void;
  onLogoClick?: () => void;
  showSearchBar?: boolean;
  onSearch?: (term: string) => void;
  searchPlaceholder?: string;
}

export function Header({
  onSearchClick,
  onBrowseClick,
  onAboutClick,
  onLogoClick,
  showSearchBar = false,
  onSearch,
  searchPlaceholder = "ابحث عن بودكاست...",
}: HeaderProps) {
  const [searchTerm, setSearchTerm] = React.useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim() && onSearch) {
      onSearch(searchTerm.trim());
      setSearchTerm("");
    }
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onLogoClick) {
      onLogoClick();
    } else {
      window.location.href = '/';
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <button onClick={handleLogoClick} className="block">
          <div className="w-28 h-20 bg-primary rounded-lg flex items-center justify-center">
            <Image
              src="/logo.png"
              alt="Logo"
              width={250}
              height={250}
              className="w-full h-full object-cover"
            />
          </div>
        </button>

        {/* Search Bar in Header */}
        <div 
          className={`flex-1 max-w-md mx-6 transition-all duration-500 ease-in-out ${
            showSearchBar 
              ? 'opacity-100 scale-100 translate-y-0' 
              : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
          }`}
        >
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full h-10 pl-10 pr-4 text-sm border border-border rounded-full bg-background/50 focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200"
              dir="rtl"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </form>
        </div>

        <nav className="flex items-center gap-6">
          <button
            onClick={onSearchClick}
            className="text-lg font-medium text-muted-foreground hover:text-primary transition-colors duration-200"
          >
            بحث
          </button>
          <button
            onClick={onBrowseClick}
            className="text-lg font-medium text-muted-foreground hover:text-primary transition-colors duration-200"
          >
            تصفح
          </button>
          <button
            onClick={onAboutClick}
            className="text-lg font-medium text-muted-foreground hover:text-primary transition-colors duration-200"
          >
            حول
          </button>
        </nav>
      </div>
    </header>
  );
}
