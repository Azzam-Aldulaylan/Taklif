import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';


// Created a utility function in a single file rather than multiple files for each utility

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleDateString('en-US', { month: 'short' });
  const year = date.getFullYear();
  
  return `${day} ${month} ${year}`;
}

export function formatDuration(milliseconds: number): string {
  const hours = Math.floor(milliseconds / (1000 * 60 * 60));
  const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength) + '...';
}

export function getHighResArtwork(artworkUrl: string, size: number = 600): string {
  // Replace the size in iTunes artwork URLs
  return artworkUrl.replace(/\/(\d+)x\d+(bb|bf|ss)\.(jpg|png)/, `/${size}x${size}bb.$3`);
}

export function formatEpisodeCount(count: number): string {
  if (count === 1) {
    return 'حلقة واحدة';
  } else if (count === 2) {
    return 'حلقتين';
  } else if (count > 2 && count < 11) { 
    return `${count} حلقات`;
  } else {
    return `${count} حلقة`;
  }
}

export function formatEpisodeDuration(duration: string): string {
  // Handle various duration formats that might come from the API
  if (!duration) return '';
  
  const hourMinuteMatch = duration.match(/^(\d{1,2}):(\d{2})$/);
  if (hourMinuteMatch) {
    const hours = parseInt(hourMinuteMatch[1]);
    const minutes = parseInt(hourMinuteMatch[2]);
    
    if (hours <= 24 && minutes <= 59) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:00`;
    }
  }
  
  const timeMatch = duration.match(/^(\d{1,3}):(\d{2})(?::(\d{2}))?$/);
  if (timeMatch) {
    const firstNumber = parseInt(timeMatch[1]);
    const secondNumber = parseInt(timeMatch[2]);
    const thirdNumber = timeMatch[3] ? parseInt(timeMatch[3]) : 0;
    
    if (timeMatch[3]) {
      return `${firstNumber}:${secondNumber.toString().padStart(2, '0')}:${thirdNumber.toString().padStart(2, '0')}`;
    }
    
    if (firstNumber > 60) {
      const hours = Math.floor(firstNumber / 60);
      const minutes = firstNumber % 60;
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secondNumber.toString().padStart(2, '0')}`;
    }
    
    return `${firstNumber}:${secondNumber.toString().padStart(2, '0')}`;
  }
  
  const minutesMatch = duration.match(/(\d+)\s*(?:minutes?|mins?|م)/i);
  const hoursMatch = duration.match(/(\d+)\s*(?:hours?|hrs?|ساعة)/i);
  
  let totalMinutes = 0;
  if (hoursMatch) {
    totalMinutes += parseInt(hoursMatch[1]) * 60;
  }
  if (minutesMatch) {
    totalMinutes += parseInt(minutesMatch[1]);
  }
  
  if (totalMinutes >= 60) {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}:${minutes.toString().padStart(2, '0')}:00`;
  } else if (totalMinutes > 0) {
    return `${totalMinutes}:00`;
  }
  
  return duration;
}
