import { Podcast, SearchRequest, SearchResponse, PodcastListResponse, HealthResponse } from '@/types/podcast';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        response.status,
        errorData.message || `HTTP ${response.status}: ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    // Network or other errors
    throw new ApiError(0, error instanceof Error ? error.message : 'Network error');
  }
}

export const podcastApi = {
  // Health check
  async getHealth(): Promise<HealthResponse> {
    return apiRequest<HealthResponse>('/health');
  },

  // Search podcasts
  async searchPodcasts(searchTerm: string): Promise<SearchResponse> {
    const body: SearchRequest = { term: searchTerm };
    return apiRequest<SearchResponse>('/podcasts/search', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  // Get all podcasts
  async getAllPodcasts(): Promise<PodcastListResponse> {
    return apiRequest<PodcastListResponse>('/podcasts');
  },

  // Get podcast by ID
  async getPodcastById(id: number): Promise<Podcast> {
    return apiRequest<Podcast>(`/podcasts/${id}`);
  },
};

export { ApiError };
