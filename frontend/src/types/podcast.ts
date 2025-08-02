export interface Podcast {
  id: number;
  collectionId: number;
  trackId: number;
  artistName: string;
  collectionName: string;
  trackName: string;
  collectionCensoredName: string;
  trackCensoredName: string;
  collectionViewUrl: string;
  feedUrl: string;
  trackViewUrl: string;
  artworkUrl30: string;
  artworkUrl60: string;
  artworkUrl100: string;
  artworkUrl600: string;
  collectionPrice: number;
  trackPrice: number;
  collectionHdPrice: number;
  releaseDate: string;
  collectionExplicitness: string;
  trackExplicitness: string;
  trackCount: number;
  trackTimeMillis: number;
  country: string;
  currency: string;
  primaryGenreName: string;
  contentAdvisoryRating: string;
  genreIds: string[];
  genres: string[];
  createdAt: string;
  updatedAt: string;
}

export interface SearchRequest {
  term: string;
}

export interface SearchResponse {
  podcasts: Podcast[];
  count: number;
  message: string;
}

export interface ApiResponse<T = unknown> {
  data?: T;
  message?: string;
  error?: string;
}

export interface PodcastListResponse {
  podcasts: Podcast[];
  total: number;
}

export interface HealthResponse {
  status: string;
  timestamp: string;
  service: string;
  version: string;
}
