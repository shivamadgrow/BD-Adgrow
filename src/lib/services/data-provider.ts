import { Business, FilterState } from '@/types';
import { initialBusinesses } from '../data/seed-businesses';
import { BusinessSearchEngine, SearchDiagnostics } from './search-engine';

export interface SearchResult {
  businesses: Business[];
  totalCount: number;
  provider: 'local_verified_registry' | 'google_places' | 'openstreetmap';
  page: number;
  pageSize: number;
  latencyMs: number;
  diagnostics?: SearchDiagnostics;
  error?: string;
  errorMessage?: string;
}

export interface BusinessDataProvider {
  id: string;
  name: string;
  search(filter: FilterState, page?: number, pageSize?: number, googleApiKey?: string): Promise<SearchResult>;
}

export class LocalVerifiedProvider implements BusinessDataProvider {
  id = 'local_verified_registry';
  name = 'Ad Grow BD Verified Global Registry';

  async search(filter: FilterState, page: number = 1, pageSize: number = 20): Promise<SearchResult> {
    const { results, diagnostics } = BusinessSearchEngine.executeSearch(
      initialBusinesses,
      filter,
      filter.country !== 'all' ? filter.country : undefined
    );

    const startIndex = (page - 1) * pageSize;
    const paginated = results.slice(startIndex, startIndex + pageSize);

    return {
      businesses: paginated,
      totalCount: results.length,
      provider: 'local_verified_registry',
      page,
      pageSize,
      latencyMs: diagnostics.executionTimeMs,
      diagnostics,
    };
  }
}

export class GooglePlacesProvider implements BusinessDataProvider {
  id = 'google_places';
  name = 'Google Maps Platform (Places API New)';

  async search(
    filter: FilterState,
    page: number = 1,
    pageSize: number = 20,
    googleApiKey?: string
  ): Promise<SearchResult> {
    const startTime = performance.now();
    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...filter,
          query: filter.searchQuery,
          provider: 'google_places',
          googleApiKey,
          page,
          pageSize,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        return {
          businesses: [],
          totalCount: 0,
          provider: 'google_places',
          page,
          pageSize,
          latencyMs: Math.round(performance.now() - startTime),
          error: data.error || 'PROVIDER_ERROR',
          errorMessage: data.message || 'Failed to fetch from Google Places API.',
        };
      }

      return {
        businesses: data.businesses || [],
        totalCount: data.totalCount || 0,
        provider: 'google_places',
        page,
        pageSize,
        latencyMs: data.latencyMs || Math.round(performance.now() - startTime),
      };
    } catch (err: any) {
      return {
        businesses: [],
        totalCount: 0,
        provider: 'google_places',
        page,
        pageSize,
        latencyMs: Math.round(performance.now() - startTime),
        error: 'NETWORK_FAILURE',
        errorMessage: err.message,
      };
    }
  }
}

export const defaultDataProvider = new LocalVerifiedProvider();
export const googlePlacesProvider = new GooglePlacesProvider();
