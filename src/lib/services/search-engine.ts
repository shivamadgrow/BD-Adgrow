import { BusinessCategory } from '@/types';
import { businessCategories } from '../data/categories';

export interface SearchSuggestion {
  id: string;
  type: 'category' | 'synonym' | 'business';
  label: string;
  subLabel?: string;
  categoryId?: string;
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
}
