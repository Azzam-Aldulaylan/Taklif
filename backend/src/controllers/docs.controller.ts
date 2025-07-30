import { Controller, Get } from '@nestjs/common';

@Controller('docs')
export class DocsController {
  @Get('examples')
  getApiExamples() {
    return {
      title: 'Thmanyah Podcast Search API - Examples',
      baseUrl: 'http://localhost:3000/api',
      endpoints: [
        {
          method: 'POST',
          path: '/podcasts/search',
          description: 'Search iTunes for podcasts and store results',
          requestBody: {
            term: 'فنجان',
            country: 'US',
            media: 'podcast',
            entity: 'podcast',
          },
          exampleCurl: `curl -X POST http://localhost:3000/api/podcasts/search \\
  -H "Content-Type: application/json" \\
  -d '{"term": "فنجان"}'`,
        },
        {
          method: 'GET',
          path: '/podcasts',
          description: 'Get all stored podcasts',
          exampleCurl: 'curl http://localhost:3000/api/podcasts',
        },
        {
          method: 'GET',
          path: '/podcasts/:id',
          description: 'Get a specific podcast by ID',
          exampleCurl: 'curl http://localhost:3000/api/podcasts/1',
        },
      ],
      iTunesApiInfo: {
        description: 'This API integrates with iTunes Search API',
        documentation:
          'https://developer.apple.com/library/archive/documentation/AudioVideo/Conceptual/iTuneSearchAPI/SearchExamples.html',
        exampleSearches: [
          { term: 'فنجان', description: 'Search for Fenjan podcast' },
          { term: 'science', description: 'Search for science podcasts' },
          { term: 'technology', description: 'Search for technology podcasts' },
        ],
      },
    };
  }

  @Get('schema')
  getPodcastSchema() {
    return {
      title: 'Podcast Entity Schema',
      description: 'Structure of the podcast data stored in the database',
      schema: {
        id: 'number (auto-generated)',
        trackId: 'number (unique iTunes track ID)',
        trackName: 'string (podcast title)',
        artistName: 'string (creator/artist name)',
        collectionName: 'string (collection name)',
        description: 'string (podcast description)',
        artworkUrl100: 'string (small artwork URL)',
        artworkUrl600: 'string (large artwork URL)',
        feedUrl: 'string (RSS feed URL)',
        trackViewUrl: 'string (iTunes link)',
        country: 'string (country code)',
        trackPrice: 'number (price)',
        currency: 'string (currency code)',
        trackCount: 'number (episode count)',
        releaseDate: 'Date (release date)',
        genres: 'string (JSON array of genres)',
        createdAt: 'Date (record created)',
        updatedAt: 'Date (record updated)',
      },
    };
  }
}
