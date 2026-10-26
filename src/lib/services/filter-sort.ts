import { Business, FilterState } from '@/types';

interface FilterOptions {
  // Google results already get country/city/category baked into the upstream query and
  // free-text matched by Google itself, so re-applying those checks locally can only drop
  // valid results. Mongo-stored businesses have no such upstream filtering, so they need it.
  includeLocationAndTextFilters?: boolean;
}

export function applyResultFilters(
  businesses: Business[],
  filter: FilterState,
  options: FilterOptions = {}
): Business[] {
  const { includeLocationAndTextFilters = true } = options;
  const checks: Array<(b: Business) => boolean> = [];

  if (filter.websiteStatus && filter.websiteStatus !== 'all') {
    checks.push((b) => {
      if (filter.websiteStatus === 'no_website') {
        return b.websiteStatus === 'not_listed' || b.websiteStatus === 'not_found';
      }
      if (filter.websiteStatus === 'has_website') {
        return b.websiteStatus === 'verified_present';
      }
      return b.websiteStatus === filter.websiteStatus;
    });
  }

  if (filter.phoneStatus && filter.phoneStatus !== 'all') {
    checks.push((b) => {
      if (filter.phoneStatus === 'available') {
        return b.phoneStatus === 'available' && !!b.phone;
      }
      if (filter.phoneStatus === 'missing') {
        return b.phoneStatus === 'not_listed' || b.phoneStatus === 'unverified';
      }
      return true;
    });
  }

  if (filter.minRating > 0) {
    checks.push((b) => (b.rating || 0) >= filter.minRating);
  }
  if (filter.minReviews > 0) {
    checks.push((b) => (b.reviewCount || 0) >= filter.minReviews);
  }
  if (filter.minScore > 0) {
    checks.push((b) => b.score.totalScore >= filter.minScore);
  }
  if (filter.priorityTier && filter.priorityTier !== 'all') {
    checks.push((b) => b.score.priority === filter.priorityTier);
  }
  if (includeLocationAndTextFilters) {
    if (filter.country && filter.country !== 'all') {
      checks.push((b) => b.location.countryCode.toLowerCase() === filter.country.toLowerCase());
    }
    if (filter.city && filter.city !== 'all') {
      checks.push((b) => b.location.city.toLowerCase() === filter.city.toLowerCase());
    }
    if (filter.categoryId && filter.categoryId !== 'all') {
      checks.push((b) => b.categoryId === filter.categoryId);
    }
    if (filter.searchQuery && filter.searchQuery.trim() !== '') {
      const q = filter.searchQuery.trim().toLowerCase();
      checks.push(
        (b) =>
          b.name.toLowerCase().includes(q) ||
          b.category.toLowerCase().includes(q) ||
          b.industryGroup.toLowerCase().includes(q) ||
          b.formattedAddress.toLowerCase().includes(q)
      );
    }
  }

  // With no active filters there's nothing to narrow by, so skip filtering entirely
  // rather than let OR-of-nothing collapse the result set to zero.
  const results =
    checks.length === 0
      ? businesses
      : businesses.filter((b) =>
          filter.filterLogic === 'OR' ? checks.some((check) => check(b)) : checks.every((check) => check(b))
        );

  return [...results].sort((a, b) => {
    let comparison = 0;
    switch (filter.sortBy) {
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
}
