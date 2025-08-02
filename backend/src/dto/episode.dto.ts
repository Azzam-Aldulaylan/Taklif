export interface Episode {
  id: string;
  title: string;
  description: string;
  pubDate: string;
  duration?: string;
  enclosureUrl?: string;
  enclosureType?: string;
  guid?: string;
  link?: string;
}

export interface EpisodesResponse {
  message: string;
  episodes: Episode[];
  count: number;
}
