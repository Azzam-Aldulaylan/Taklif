"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";

interface HeaderProps {
  onSearchClick?: () => void;
  onBrowseClick?: () => void;
  onAboutClick?: () => void;
}

export function Header({
  onSearchClick,
  onBrowseClick,
  onAboutClick,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="block">
          <div className="w-28 h-20 bg-primary rounded-lg flex items-center justify-center">
            <Image
              src="/logo.png"
              alt="Logo"
              width={250}
              height={250}
              className="w-full h-full object-cover"
            />
          </div>
        </Link>

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
