
/**
 * Opens an iTunes podcast episode URL in a new tab/window
 * @param itunesUrl - The iTunes URL for the episode
 * @param fallbackUrl - Optional fallback URL if iTunes URL is not available
 * @param showAlert - Whether to show an alert if no URL is available (default: false)
 */
export const openInItunes = (
  itunesUrl?: string, 
  fallbackUrl?: string, 
  showAlert: boolean = false
) => {
  const urlToOpen = itunesUrl || fallbackUrl;
  
  if (!urlToOpen) {
    const message = 'No iTunes URL or fallback URL provided';
    console.warn(message);
    
    if (showAlert) {
      alert('رابط iTunes غير متوفر لهذه الحلقة');
    }
    return;
  }

  // Open in new tab/window
  window.open(urlToOpen, '_blank', 'noopener,noreferrer');
};
