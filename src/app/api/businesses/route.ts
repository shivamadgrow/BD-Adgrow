import { NextRequest, NextResponse } from 'next/server';
import { FilterState } from '@/types';
import { getAllBusinesses } from '@/lib/server/business-repository';
import { applyResultFilters } from '@/lib/services/filter-sort';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      query = '',
      country = 'all',
      city = 'all',
      categoryId = 'all',
      websiteStatus = 'all',
      phoneStatus = 'all',
      minRating = 0,
      minReviews = 0,
      minScore = 0,
      priorityTier = 'all',
      filterLogic = 'AND',
      sortBy = 'score',
      sortOrder = 'desc',
    } = body;

    const filter: FilterState = {
      country,
      city,
      categoryId,
      searchQuery: query,
      websiteStatus,
      phoneStatus,
      minRating,
      minReviews,
      minScore,
      priorityTier,
      filterLogic,
      sortBy,
      sortOrder,
    };

    const allBusinesses = await getAllBusinesses();
    const results = applyResultFilters(allBusinesses, filter);

    return NextResponse.json({
      success: true,
      businesses: results,
      totalCount: results.length,
      provider: 'mongodb',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to load saved businesses.' },
      { status: 500 }
    );
  }
}
