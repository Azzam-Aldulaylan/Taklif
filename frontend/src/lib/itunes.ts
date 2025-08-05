
export const openInItunes = (itunesUrl?: string, fallbackUrl?: string) => {
  const urlToOpen = itunesUrl || fallbackUrl;
  
  if (!urlToOpen) {
    console.warn('No iTunes URL or fallback URL provided');
    return;
  }

  // Open in new tab/window
  window.open(urlToOpen, '_blank', 'noopener,noreferrer');
};
