import { Business, LeadScoreBreakdown, PriorityTier } from '@/types';

export function calculateLeadScore(business: Partial<Business>): LeadScoreBreakdown {
  let digitalGapScore = 0;
  let commercialScore = 0;
  let reachabilityScore = 0;
  let marketScore = 0;

  // 1. Digital Gap Severity (Max 40 points)
  if (business.websiteStatus === 'not_listed' || business.websiteStatus === 'not_found') {
    digitalGapScore += 35; // Prime Website Development opportunity
  } else if (business.websiteStatus === 'verified_present') {
    // If website exists, inspect audit flags
    const audit = business.audit;
    if (audit) {
      if (audit.mobileScore !== undefined && audit.mobileScore < 50) {
        digitalGapScore += 20; // Critical redesign/speed issue
      } else if (audit.mobileScore !== undefined && audit.mobileScore < 75) {
        digitalGapScore += 12; // Moderate speed/performance gap
      }

      if (audit.sslValid === false) {
        digitalGapScore += 8; // Insecure SSL flag
      }

      if (!audit.hasBookingCta && !audit.hasContactForm) {
        digitalGapScore += 7; // CRO / Lead conversion funnel gap
      }

      if (!audit.hasMetaDescription || !audit.hasSchemaMarkup) {
        digitalGapScore += 5; // Local SEO meta gap
      }
    } else {
      // No audit yet, moderate assumption for check
      digitalGapScore += 10;
    }
  }

  // Profile completeness & GBP gaps
  if ((business.profileCompleteness || 0) < 60) {
    digitalGapScore += 6;
  }
  if (!business.claimedGbp) {
    digitalGapScore += 5;
  }
  if ((business.reviewCount || 0) < 15) {
    digitalGapScore += 6; // Reputation management needed
  }

  digitalGapScore = Math.min(40, digitalGapScore);

  // 2. Commercial Potential (Max 25 points)
  const highTicketIndustries = [
    'cat-dental',
    'cat-healthcare',
    'cat-legal',
    'cat-realestate',
    'cat-construction',
    'cat-hvac',
    'cat-auto',
    'cat-accounting',
    'cat-hotels',
  ];

  if (highTicketIndustries.includes(business.categoryId || '')) {
    commercialScore += 18;
  } else {
    commercialScore += 10;
  }

  // Active reviews indicate commercial activity and cash flow
  if ((business.reviewCount || 0) >= 30) {
    commercialScore += 7;
  } else if ((business.reviewCount || 0) >= 10) {
    commercialScore += 4;
  }

  commercialScore = Math.min(25, commercialScore);

  // 3. Contact Reachability (Max 20 points)
  if (business.phoneStatus === 'available' && business.phone) {
    reachabilityScore += 15;
  } else if (business.phoneStatus === 'unverified') {
    reachabilityScore += 7;
  }

  if (business.audit?.detectedSocials?.instagram || business.audit?.detectedSocials?.facebook || business.audit?.detectedSocials?.linkedin) {
    reachabilityScore += 5;
  }

  reachabilityScore = Math.min(20, reachabilityScore);

  // 4. Market Relevance & Location Density (Max 15 points)
  const tier1Cities = ['Delhi NCR', 'Mumbai', 'Bengaluru', 'New York', 'London', 'Dubai', 'Sydney'];
  if (tier1Cities.includes(business.location?.city || '')) {
    marketScore += 15;
  } else {
    marketScore += 10;
  }

  const totalScore = Math.round(digitalGapScore + commercialScore + reachabilityScore + marketScore);

  let priority: PriorityTier = 'C';
  let recommendation = 'Low immediate urgency; observe or cold email with general agency portfolio.';

  if (totalScore >= 75) {
    priority = 'A';
    recommendation = 'High priority target. Critical observable gap (missing website or failing mobile) combined with verified direct phone line. Initiate direct outreach within 24 hours.';
  } else if (totalScore >= 50) {
    priority = 'B';
    recommendation = 'Strong prospect. Good commercial baseline with specific growth gaps (SEO, speed, or review generation). Pitch targeted modernization service.';
  }

  return {
    totalScore,
    priority,
    confidence: business.audit ? 'high' : 'medium',
    factors: {
      digitalGapSeverity: digitalGapScore,
      commercialPotential: commercialScore,
      contactReachability: reachabilityScore,
      marketRelevance: marketScore,
    },
    recommendation,
  };
}
