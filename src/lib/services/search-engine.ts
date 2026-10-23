import { Business, FilterState, BusinessCategory } from '@/types';
import { businessCategories } from '../data/categories';

export interface SearchSuggestion {
  id: string;
  type: 'category' | 'synonym' | 'business';
  label: string;
  subLabel?: string;
  categoryId?: string;
}

export interface SearchDiagnostics {
  originalQuery: string;
  matchedCategoryIds: string[];
  matchedSynonyms: string[];
  totalRecordsScanned: number;
  totalMatchesFound: number;
  providerUsed: string;
  executionTimeMs: number;
  suggestedBroaderTerms: string[];
}

export class BusinessSearchEngine {
  /**
   * Find all category IDs that match the query or its synonyms
   */
  public static findMatchingCategories(query: string, countryCode?: string): BusinessCategory[] {
    if (!query || query.trim() === '') return [];
    const normalized = query.toLowerCase().trim();

    return businessCategories.filter((cat) => {
      // Direct name match
      if (cat.name.toLowerCase().includes(normalized)) return true;
      if (cat.slug.toLowerCase().includes(normalized)) return true;
      if (cat.industryGroup.toLowerCase().includes(normalized)) return true;

      // Synonym match with token and word boundary support
      if (cat.synonyms) {
        const queryTokens = normalized.split(/\s+/).filter(Boolean);
        const matchesSynonym = cat.synonyms.some((synonym) => {
          const s = synonym.toLowerCase();
          // Exact match
          if (s === normalized) return true;
          // Full phrase contains
          if (s.includes(normalized) || normalized.includes(s)) {
            // If the synonym is short (<= 4 chars, like 'rx', 'it'), require exact word token match
            if (s.length <= 4) {
              return queryTokens.includes(s);
            }
            return true;
          }
          // Check if all tokens of query are in synonym
          if (queryTokens.length > 1 && queryTokens.every((token) => s.includes(token))) {
            return true;
          }
          return false;
        });
        if (matchesSynonym) return true;
      }

      // Official Google Types match
      if (cat.officialGoogleTypes && cat.officialGoogleTypes.some((t) => t.toLowerCase().includes(normalized))) {
        return true;
      }

      // Localized labels match (e.g. "chemist" or "medical store" in India)
      if (cat.localizedLabels) {
        if (countryCode && cat.localizedLabels[countryCode]?.toLowerCase().includes(normalized)) {
          return true;
        }
        for (const loc of Object.values(cat.localizedLabels)) {
          if (loc.toLowerCase().includes(normalized)) return true;
        }
      }

      return false;
    });
  }

  /**
   * Get search suggestions / autocomplete for a partial user query
   */
  public static getSuggestions(partialQuery: string, limit: number = 6): SearchSuggestion[] {
    if (!partialQuery || partialQuery.trim().length < 2) return [];
    const normalized = partialQuery.toLowerCase().trim();
    const suggestions: SearchSuggestion[] = [];

    const matchedCats = this.findMatchingCategories(normalized);
    for (const cat of matchedCats) {
      suggestions.push({
        id: `sug-cat-${cat.id}`,
        type: 'category',
        label: cat.name,
        subLabel: cat.industryGroup,
        categoryId: cat.id,
      });
      if (suggestions.length >= limit) break;
    }

    return suggestions;
  }

  /**
   * Execute comprehensive multi-filter search with synonym expansion
   */
  public static executeSearch(
    dataset: Business[],
    filter: FilterState,
    countryCode?: string
  ): { results: Business[]; diagnostics: SearchDiagnostics } {
    const startTime = performance.now();
    const query = filter.searchQuery.trim().toLowerCase();

    // 1. Identify matching category IDs via synonyms
    const matchingCategories = query ? this.findMatchingCategories(query, countryCode) : [];
    const matchedCategoryIds = new Set(matchingCategories.map((c) => c.id));
    const matchedSynonyms = matchingCategories.flatMap((c) => c.synonyms || []).slice(0, 10);

    let results = [...dataset];

    if (filter.filterLogic === 'AND') {
      // Country
      if (filter.country && filter.country !== 'all') {
        results = results.filter((b) => b.location.countryCode.toLowerCase() === filter.country.toLowerCase());
      }
      // City
      if (filter.city && filter.city !== 'all') {
        results = results.filter((b) => b.location.city.toLowerCase().includes(filter.city.toLowerCase()));
      }
      // Explicit Category Filter
      if (filter.categoryId && filter.categoryId !== 'all') {
        results = results.filter((b) => b.categoryId === filter.categoryId);
      }
      // Query search (Name, Category, Address, OR Category Synonym Match)
      if (query !== '') {
        results = results.filter((b) => {
          // Direct text match on business name, category, or address
          const matchesText =
            b.name.toLowerCase().includes(query) ||
            b.category.toLowerCase().includes(query) ||
            b.industryGroup.toLowerCase().includes(query) ||
            b.formattedAddress.toLowerCase().includes(query);

          if (matchesText) return true;

          // Synonym / Semantic category match:
          // e.g., if user searches "pharma", and this business has categoryId 'cat-pharma-retail' or 'cat-pharma-mfg'
          if (matchedCategoryIds.has(b.categoryId)) return true;

          return false;
        });
      }

      // Website Status
      if (filter.websiteStatus && filter.websiteStatus !== 'all') {
        if (filter.websiteStatus === 'no_website') {
          results = results.filter((b) => b.websiteStatus === 'not_listed' || b.websiteStatus === 'not_found');
        } else if (filter.websiteStatus === 'has_website') {
          results = results.filter((b) => b.websiteStatus === 'verified_present');
        } else {
          results = results.filter((b) => b.websiteStatus === filter.websiteStatus);
        }
      }

      // Phone Status
      if (filter.phoneStatus && filter.phoneStatus !== 'all') {
        if (filter.phoneStatus === 'available') {
          results = results.filter((b) => b.phoneStatus === 'available' && b.phone);
        } else if (filter.phoneStatus === 'missing') {
          results = results.filter((b) => b.phoneStatus === 'not_listed');
        }
      }

      // Rating & Reviews
      if (filter.minRating > 0) {
        results = results.filter((b) => (b.rating || 0) >= filter.minRating);
      }
      if (filter.minReviews > 0) {
        results = results.filter((b) => (b.reviewCount || 0) >= filter.minReviews);
      }
      if (filter.minScore > 0) {
        results = results.filter((b) => b.score.totalScore >= filter.minScore);
      }
      if (filter.priorityTier && filter.priorityTier !== 'all') {
        results = results.filter((b) => b.score.priority === filter.priorityTier);
      }
    } else {
      // OR logic
      results = results.filter((b) => {
        const matchesCountry = filter.country && filter.country !== 'all' ? b.location.countryCode.toLowerCase() === filter.country.toLowerCase() : false;
        const matchesCity = filter.city && filter.city !== 'all' ? b.location.city.toLowerCase().includes(filter.city.toLowerCase()) : false;
        const matchesCategory = filter.categoryId && filter.categoryId !== 'all' ? b.categoryId === filter.categoryId : false;
        const matchesQuery = query !== '' ? (
          b.name.toLowerCase().includes(query) ||
          b.category.toLowerCase().includes(query) ||
          matchedCategoryIds.has(b.categoryId)
        ) : false;
        const matchesNoWebsite = filter.websiteStatus === 'no_website' ? (b.websiteStatus === 'not_listed' || b.websiteStatus === 'not_found') : false;
        const matchesPhone = filter.phoneStatus === 'available' ? (b.phoneStatus === 'available' && !!b.phone) : false;
        const matchesPriority = filter.priorityTier && filter.priorityTier !== 'all' ? b.score.priority === filter.priorityTier : false;

        return matchesCountry || matchesCity || matchesCategory || matchesQuery || matchesNoWebsite || matchesPhone || matchesPriority;
      });
    }

    // Sort results
    results.sort((a, b) => {
      let comparison = 0;
      switch (filter.sortBy) {
        case 'score':
          comparison = b.score.totalScore - a.score.totalScore;
          break;
        case 'rating':
          comparison = (b.rating || 0) - (a.rating || 0);
          break;
        case 'reviews':
          comparison = (b.reviewCount || 0) - (a.reviewCount || 0);
          break;
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        default:
          comparison = b.score.totalScore - a.score.totalScore;
      }
      return filter.sortOrder === 'desc' ? comparison : -comparison;
    });

    const executionTimeMs = Math.round(performance.now() - startTime);

    const diagnostics: SearchDiagnostics = {
      originalQuery: filter.searchQuery,
      matchedCategoryIds: Array.from(matchedCategoryIds),
      matchedSynonyms,
      totalRecordsScanned: dataset.length,
      totalMatchesFound: results.length,
      providerUsed: 'Unified Search Engine (Local + Synonym Resolver)',
      executionTimeMs,
      suggestedBroaderTerms: matchingCategories.slice(0, 4).map((c) => c.name),
    };

    return { results, diagnostics };
  }
}
