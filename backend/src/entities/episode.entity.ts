export interface Episode {
  id: string;
  title: string;
  description: string;
  duration: string;
  publishDate: string;
  audioUrl: string;
  episodeNumber?: number;
  seasonNumber?: number;
  imageUrl?: string;
}
