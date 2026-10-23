import { NextRequest, NextResponse } from 'next/server';
import { Business, FilterState } from '@/types';
import { initialBusinesses } from '@/lib/data/seed-businesses';
import { BusinessSearchEngine } from '@/lib/services/search-engine';
import { runWebsiteAudit } from '@/lib/services/audit-service';
import { calculateLeadScore } from '@/lib/services/scoring-service';

export async function POST(req: NextRequest) {
  const startTime = performance.now();
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
      provider = 'local_verified_registry',
      googleApiKey = '',
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

    // 1. Google Places API Provider
    if (provider === 'google_places') {
      const activeApiKey = googleApiKey || process.env.GOOGLE_PLACES_API_KEY;
      if (!activeApiKey) {
        return NextResponse.json(
          {
            success: false,
            error: 'MISSING_GOOGLE_API_KEY',
            message:
              'Google Maps Platform API Key is required for live external queries. Add your key in the Data Providers panel or set GOOGLE_PLACES_API_KEY in .env.local.',
            fallbackAvailable: true,
            provider: 'google_places',
          },
          { status: 400 }
        );
      }

      // Execute live Google Places API (New Text Search)
      try {
        const textQuery = `${query ? query + ' ' : ''}${categoryId !== 'all' ? categoryId.replace('cat-', '') + ' ' : ''}${city !== 'all' ? 'in ' + city : 'businesses'}`;
        const googleRes = await fetch('https://places.googleapis.com/v1/places:searchText', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': activeApiKey,
            'X-Goog-FieldMask':
              'places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount,places.websiteUri,places.nationalPhoneNumber,places.primaryType',
          },
          body: JSON.stringify({
            textQuery,
            languageCode: 'en',
            maxResultCount: 20,
          }),
        });

        if (!googleRes.ok) {
          const errText = await googleRes.text();
          return NextResponse.json(
            {
              success: false,
              error: 'GOOGLE_API_ERROR',
              message: `Google Places API returned ${googleRes.status}: ${errText.slice(0, 150)}`,
              provider: 'google_places',
            },
            { status: googleRes.status }
          );
        }

        const data = await googleRes.json();
        const rawPlaces = data.places || [];

        // Normalize Google Places into Ad Grow BD Business model
        const liveBusinesses: Business[] = rawPlaces.map((p: any) => {
          const hasWeb = !!p.websiteUri;
          const hasPhone = !!p.nationalPhoneNumber;

          const baseBiz: Partial<Business> = {
            id: `gplace-${p.id}`,
            sourceProvider: 'google_places',
            sourceId: p.id,
            name: p.displayName?.text || 'Business Name',
            category: p.primaryType ? p.primaryType.replace(/_/g, ' ') : 'Commercial Business',
            categoryId: categoryId !== 'all' ? categoryId : 'cat-pro-services',
            industryGroup: 'Verified Commercial Provider',
            location: {
              countryCode: country !== 'all' ? country : 'GL',
              countryName: 'Google Verified Location',
              region: city !== 'all' ? city : 'Region',
              city: city !== 'all' ? city : 'Metro Area',
              lat: p.location?.latitude || 0,
              lng: p.location?.longitude || 0,
            },
            formattedAddress: p.formattedAddress || 'Verified Address',
            phone: p.nationalPhoneNumber,
            phoneStatus: hasPhone ? 'available' : 'not_listed',
            website: p.websiteUri,
            websiteStatus: hasWeb ? 'verified_present' : 'not_listed',
            rating: p.rating || 4.5,
            reviewCount: p.userRatingCount || 0,
            profileCompleteness: hasWeb && hasPhone ? 95 : 65,
            photosCount: 10,
            hasOpeningHours: true,
            claimedGbp: true,
            lastVerifiedDate: new Date().toISOString().split('T')[0],
          };

          const { audit, newOpportunities } = runWebsiteAudit(baseBiz as Business);
          const score = calculateLeadScore({ ...baseBiz, audit });

          return {
            ...(baseBiz as Business),
            audit,
            opportunities: newOpportunities,
            score,
            inCrm: false,
          };
        });

        return NextResponse.json({
          success: true,
          businesses: liveBusinesses,
          totalCount: liveBusinesses.length,
          provider: 'google_places',
          latencyMs: Math.round(performance.now() - startTime),
        });
      } catch (err: any) {
        return NextResponse.json(
          {
            success: false,
            error: 'NETWORK_ERROR',
            message: `Failed to connect to Google Places API: ${err.message}`,
          },
          { status: 502 }
        );
      }
    }

    // 2. Default: Local Verified Global Registry with Synonym Engine
    const { results, diagnostics } = BusinessSearchEngine.executeSearch(
      initialBusinesses,
      filter,
      country !== 'all' ? country : undefined
    );

    return NextResponse.json({
      success: true,
      businesses: results,
      totalCount: results.length,
      provider: 'local_verified_registry',
      diagnostics,
      latencyMs: Math.round(performance.now() - startTime),
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: 'SERVER_ERROR',
        message: error.message || 'An unexpected error occurred during search execution.',
      },
      { status: 500 }
    );
  }
}
