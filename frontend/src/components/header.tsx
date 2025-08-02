"use client";

import Image from "next/image";
import React from "react";
import { Search, Menu, X } from "lucide-react";

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = React.useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim() && onSearch) {
      onSearch(searchTerm.trim());
      setSearchTerm("");
      setIsMobileSearchOpen(false);
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

  const handleMobileSearchToggle = () => {
    setIsMobileSearchOpen(!isMobileSearchOpen);
    setIsMobileMenuOpen(false);
  };

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setIsMobileSearchOpen(false);
  };

  const handleNavClick = (callback?: () => void) => {
    if (callback) callback();
    setIsMobileMenuOpen(false);
    setIsMobileSearchOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 md:px-6">
        {/* Main Header */}
        <div className="h-16 flex items-center justify-between">
          {/* Logo */}
          <button onClick={handleLogoClick} className="block flex-shrink-0">
            <div className="w-20 h-12 md:w-28 md:h-16 bg-primary rounded-lg flex items-center justify-center">
              <Image
                src="/logo.png"
                alt="Logo"
                width={200}
                height={200}
                className="w-full h-full object-cover"
              />
            </div>
          </button>

          {/* Desktop Search Bar */}
          <div 
            className={`hidden md:flex flex-1 max-w-md mx-6 transition-all duration-500 ease-in-out ${
              showSearchBar 
                ? 'opacity-100 scale-100 translate-y-0' 
                : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
            }`}
          >
            <form onSubmit={handleSearch} className="relative w-full">
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

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
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

          {/* Mobile Controls */}
          <div className="flex md:hidden items-center gap-2">
            {/* Mobile Search Toggle */}
            <button
              onClick={handleMobileSearchToggle}
              className="p-2 text-muted-foreground hover:text-primary transition-colors duration-200"
              aria-label="البحث"
            >
              <Search className="h-5 w-5" />
            </button>
            
            {/* Mobile Menu Toggle */}
            <button
              onClick={handleMobileMenuToggle}
              className="p-2 text-muted-foreground hover:text-primary transition-colors duration-200"
              aria-label="القائمة"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {isMobileSearchOpen && (
          <div className="md:hidden pb-4 animate-in slide-in-from-top-2 duration-200">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full h-10 pl-10 pr-4 text-sm border border-border rounded-full bg-background/50 focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                dir="rtl"
                autoFocus
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </form>
          </div>
        )}

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border/50 animate-in slide-in-from-top-2 duration-200">
            <nav className="py-4 space-y-3">
              <button
                onClick={() => handleNavClick(onSearchClick)}
                className="block w-full text-right py-2 text-lg font-medium text-muted-foreground hover:text-primary transition-colors duration-200"
              >
                بحث
              </button>
              <button
                onClick={() => handleNavClick(onBrowseClick)}
                className="block w-full text-right py-2 text-lg font-medium text-muted-foreground hover:text-primary transition-colors duration-200"
              >
                تصفح
              </button>
              <button
                onClick={() => handleNavClick(onAboutClick)}
                className="block w-full text-right py-2 text-lg font-medium text-muted-foreground hover:text-primary transition-colors duration-200"
              >
                حول
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
