// test-search-pipeline.mjs
// Comprehensive Functional Test Suite for Ad Grow BD Search Pipeline
import { businessCategories } from './src/lib/data/categories.js';
import { initialBusinesses } from './src/lib/data/seed-businesses.js';
import { BusinessSearchEngine } from './src/lib/services/search-engine.js';

console.log('================================================================');
console.log('🧪 AD GROW BD — SEARCH PIPELINE VERIFICATION SUITE');
console.log('================================================================\n');

const testCases = [
  { query: 'Pharma', expectedMinCount: 1, targetCategory: 'cat-pharma-retail' },
  { query: 'Pharmacy', expectedMinCount: 1, targetCategory: 'cat-pharma-retail' },
  { query: 'Pharmaceutical company', expectedMinCount: 1, targetCategory: 'cat-pharma-company' },
  { query: 'Pharmaceutical manufacturer', expectedMinCount: 1, targetCategory: 'cat-pharma-mfg' },
  { query: 'Pharmaceutical distributor', expectedMinCount: 1, targetCategory: 'cat-pharma-distributor' },
  { query: 'Medical supply store', expectedMinCount: 1, targetCategory: 'cat-medical-supplies' },
  { query: 'Dentist', expectedMinCount: 1, targetCategory: 'cat-dental' },
  { query: 'Restaurant', expectedMinCount: 1, targetCategory: 'cat-restaurants-cafes' },
  { query: 'Plumber', expectedMinCount: 1, targetCategory: 'cat-hvac-plumbing-electric' },
  { query: 'Digital marketing agency', expectedMinCount: 1, targetCategory: 'cat-agencies-marketing' },
  { query: 'Real estate agency', expectedMinCount: 1, targetCategory: 'cat-realestate-brokers' },
  { query: 'Automobile repair shop', expectedMinCount: 1, targetCategory: 'cat-auto-dealers-garages' },
  { query: 'Grocery store', expectedMinCount: 1, targetCategory: 'cat-retail-supermarkets' },
  { query: 'School', expectedMinCount: 1, targetCategory: 'cat-education-coaching' },
  { query: 'Hotel', expectedMinCount: 1, targetCategory: 'cat-hotels-resorts' },
];

let totalPassed = 0;
let totalFailed = 0;

console.log(`Auditing ${businessCategories.length} categories in directory.`);
console.log(`Auditing ${initialBusinesses.length} seed businesses in local registry.\n`);

testCases.forEach((tc, idx) => {
  const matchingCategories = BusinessSearchEngine.findMatchingCategories(tc.query);
  const filterState = {
    country: 'all',
    city: 'all',
    categoryId: 'all',
    searchQuery: tc.query,
    websiteStatus: 'all',
    phoneStatus: 'all',
    minRating: 0,
    minReviews: 0,
    minScore: 0,
    priorityTier: 'all',
    filterLogic: 'AND',
    sortBy: 'score',
    sortOrder: 'desc',
  };

  const { results, diagnostics } = BusinessSearchEngine.executeSearch(initialBusinesses, filterState);

  const matchedExpectedCategory = matchingCategories.some(c => c.id === tc.targetCategory);
  const countMatches = results.length >= tc.expectedMinCount;
  const isDeduplicated = new Set(results.map(r => r.id)).size === results.length;

  if (matchedExpectedCategory && countMatches && isDeduplicated) {
    console.log(`✅ [TEST ${idx + 1}/15] PASSED: "${tc.query}" -> Found ${results.length} results (Matched categories: ${matchingCategories.map(c => c.name).slice(0, 2).join(', ')})`);
    totalPassed++;
  } else {
    console.error(`❌ [TEST ${idx + 1}/15] FAILED: "${tc.query}"`);
    console.error(`   - Matched Target Category: ${matchedExpectedCategory}`);
    console.error(`   - Count (${results.length}) >= Expected (${tc.expectedMinCount}): ${countMatches}`);
    console.error(`   - Deduplicated: ${isDeduplicated}`);
    totalFailed++;
  }
});

console.log('\n================================================================');
console.log(`📊 TEST RESULTS: ${totalPassed}/${testCases.length} Passed, ${totalFailed} Failed`);
console.log('================================================================\n');

if (totalFailed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
