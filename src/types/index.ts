export type WebsiteStatus = 
  | 'verified_present'
  | 'not_listed'
  | 'not_found'
  | 'unavailable'
  | 'unknown'
  | 'verification_failed';

export type PhoneStatus = 
  | 'available'
  | 'not_listed'
  | 'unverified';

export type PriorityTier = 'A' | 'B' | 'C';

export type PipelineStage = 
  | 'discovered'
  | 'research_pending'
  | 'verified'
  | 'qualified'
  | 'ready_for_outreach'
  | 'contacted'
  | 'interested'
  | 'meeting_scheduled'
  | 'proposal_sent'
  | 'negotiation'
  | 'won'
  | 'lost'
  | 'not_a_fit'
  | 'do_not_contact';

export type ServiceType = 
  | 'website_development'
  | 'website_redesign'
  | 'local_seo'
  | 'gbp_optimization'
  | 'paid_advertising'
  | 'social_media'
  | 'reputation_management'
  | 'landing_page'
  | 'speed_optimization'
  | 'cro';

export interface LocationGeo {
  countryCode: string;
  countryName: string;
  region: string;
  city: string;
  postalCode?: string;
  neighborhood?: string;
  lat: number;
  lng: number;
}

export interface BusinessCategory {
  id: string;
  name: string;
  slug: string;
  parentCategory?: string;
  industryGroup: string;
  iconName: string;
  synonyms?: string[];
  officialGoogleTypes?: string[];
  localizedLabels?: { [countryCode: string]: string };
}

export interface WebsiteAudit {
  auditDate: string;
  url?: string;
  httpStatus?: number;
  sslValid?: boolean;
  mobileScore?: number; // 0-100
  desktopScore?: number;
  seoScore?: number;
  hasBookingCta: boolean;
  hasContactForm: boolean;
  hasClickToCall: boolean;
  hasMetaDescription: boolean;
  hasSchemaMarkup: boolean;
  detectedSocials: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
    twitter?: string;
  };
  detectedIssues: string[];
  confidenceLevel: 'high' | 'medium' | 'low';
}

export interface OpportunityFinding {
  id: string;
  serviceType: ServiceType;
  title: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  evidence: string;
  recommendedPitch: string;
  estimatedValueUsd: number;
  estimatedValueInr: number;
}

export interface LeadScoreBreakdown {
  totalScore: number; // 0-100
  priority: PriorityTier;
  confidence: 'high' | 'medium' | 'low';
  factors: {
    digitalGapSeverity: number; // max 40
    commercialPotential: number; // max 25
    contactReachability: number; // max 20
    marketRelevance: number; // max 15
  };
  recommendation: string;
}

export interface Business {
  id: string;
  sourceProvider: 'google_places' | 'openstreetmap' | 'local_verified_registry';
  sourceId: string;
  name: string;
  category: string;
  categoryId: string;
  industryGroup: string;
  location: LocationGeo;
  formattedAddress: string;
  phone?: string;
  phoneStatus: PhoneStatus;
  website?: string;
  websiteStatus: WebsiteStatus;
  rating?: number;
  reviewCount: number;
  profileCompleteness: number; // 0-100%
  photosCount: number;
  hasOpeningHours: boolean;
  claimedGbp: boolean;
  audit?: WebsiteAudit;
  opportunities: OpportunityFinding[];
  score: LeadScoreBreakdown;
  lastVerifiedDate: string;
  inCrm?: boolean;
  crmStage?: PipelineStage;
}

export interface AIResearchReport {
  id: string;
  businessId: string;
  generatedAt: string;
  overview: {
    businessName: string;
    industry: string;
    marketContext: string;
    primaryContactChannel: string;
  };
  verifiedFacts: string[];
  digitalPresenceGaps: {
    gap: string;
    evidence: string;
    confidence: 'high' | 'medium' | 'low';
  }[];
  potentialOpportunities: {
    service: string;
    impact: string;
    urgency: string;
  }[];
  salesStrategy: {
    primaryServiceToPitch: string;
    valueProposition: string;
    pitchReasoning: string;
    suggestedDiscoveryQuestions: string[];
    suggestedNextAction: string;
  };
  outreachDrafts: {
    emailSubject: string;
    emailBody: string;
    phoneColdScript: string;
    linkedinInMail: string;
    whatsappMessage: string;
  };
}

export interface CRMProspect {
  id: string;
  businessId: string;
  business: Business;
  stage: PipelineStage;
  priority: PriorityTier;
  estimatedDealValue: number;
  currency: 'USD' | 'INR';
  servicePitched: ServiceType;
  assignedTo: string;
  notes: string[];
  activities: CRMActivity[];
  tasks: CRMTask[];
  createdAt: string;
  updatedAt: string;
}

export interface CRMActivity {
  id: string;
  type: 'note' | 'call' | 'email' | 'meeting' | 'stage_change';
  description: string;
  date: string;
  author: string;
}

export interface CRMTask {
  id: string;
  title: string;
  dueDate: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
}

export interface FilterState {
  country: string;
  city: string;
  categoryId: string;
  searchQuery: string;
  websiteStatus: string; // 'all' | 'no_website' | 'has_website' | 'unknown'
  phoneStatus: string; // 'all' | 'available' | 'missing'
  minRating: number;
  minReviews: number;
  minScore: number;
  priorityTier: string; // 'all' | 'A' | 'B' | 'C'
  filterLogic: 'AND' | 'OR';
  sortBy: 'score' | 'rating' | 'reviews' | 'completeness' | 'name';
  sortOrder: 'asc' | 'desc';
}

export interface SavedFilter {
  id: string;
  name: string;
  description: string;
  filter: FilterState;
}
