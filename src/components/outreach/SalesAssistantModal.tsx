import React, { useState } from 'react';
import { Business, ServiceType } from '@/types';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import {
  Mail,
  Phone,
  Linkedin,
  MessageSquare,
  FileSpreadsheet,
  Copy,
  Check,
  Sparkles,
  Layers,
} from 'lucide-react';

interface SalesAssistantModalProps {
  business: Business | null;
  isOpen: boolean;
  onClose: () => void;
  currency: 'USD' | 'INR';
}

export const SalesAssistantModal: React.FC<SalesAssistantModalProps> = ({
  business,
  isOpen,
  onClose,
  currency,
}) => {
  const [selectedService, setSelectedService] = useState<ServiceType>('website_development');
  const [activeTab, setActiveTab] = useState<'email_sequence' | 'cold_call' | 'whatsapp' | 'proposal_outline'>('email_sequence');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!business) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const isNoWebsite = business.websiteStatus === 'not_listed' || !business.website;
  const isINR = currency === 'INR';
  const priceSymbol = isINR ? '₹' : '$';

  // Dynamic outreach templates based on selected service
  const templates = {
    website_development: {
      title: 'Website Development & Local Lead Funnel',
      email: {
        step1: `Subject: Missing website for ${business.name} in ${business.location.city}\n\nHi Team,\n\nI noticed your listing on Google Maps is gathering great reviews in ${business.location.city}, but there is no official website attached.\n\nOver 70% of potential customers search for pricing and online booking before visiting. Without a website, these customers are clicking on your competitors.\n\nWe build custom, ultra-fast websites with 1-click booking that help ${business.category.toLowerCase()} businesses generate 20-30 qualified inquiries per month.\n\nWould you be open to seeing a 2-minute mockup we created for ${business.name}?\n\nBest,\nAd Grow BD Team`,
        step2: `Subject: Re: Missing website for ${business.name} (Follow-up)\n\nHi Team,\n\nFollowing up quickly regarding the website audit for ${business.name}. We created a demo mobile design showing how online appointment booking would look for your practice in ${business.location.city}.\n\nDo you have 5 minutes this Thursday afternoon to take a look?\n\nBest,\nAd Grow BD Team`,
      },
      coldCall: `[OPENER]: "Hello, am I speaking with the practice owner or clinic manager at ${business.name}?"\n[REASON]: "Hi, this is [Name] with Ad Grow BD. I am calling because we were auditing local ${business.category.toLowerCase()} businesses in ${business.location.city} today, and I noticed your Google profile has strong ratings, but no official website linked."\n[PROBLEM]: "That means right now, hundreds of people searching for ${business.category} in your area have no way to book an appointment with you online, so they end up choosing other local providers."\n[HOOK]: "We design modern, mobile-optimized sites specifically for ${business.category.toLowerCase()} practices that deliver direct patient inquiries to your phone."\n[CLOSE]: "Could I send over a quick 2-minute video walkthrough of the concept to your WhatsApp or email?"`,
      whatsapp: `Hello ${business.name} Team 👋\n\nI was looking at your Google profile in ${business.location.city} and saw your great reviews! 🌟\n\nHowever, I noticed there's no website or online booking page linked. In ${business.location.city}, over 65% of clients prefer booking directly online.\n\nWe designed a quick preview of how a modern booking website could look for ${business.name}. May I share the link here for you to check out?`,
      proposal: `1. PROJECT OBJECTIVE:
Deploy an official, high-converting digital storefront for ${business.name} in ${business.location.city} to capture and convert local search demand.

2. CORE DELIVERABLES:
- 5-page custom responsive website (Home, Services, About, Patient Testimonials, Contact & Booking).
- Direct WhatsApp & Instant Appointment Booking Widget.
- Full Google Core Web Vitals Optimization (Target PageSpeed > 90/100).
- Local SEO Schema.org Markup for Google Maps 3-Pack Integration.
- Google Analytics 4 & Meta Pixel tracking setup.

3. INVESTMENT & TIMELINE:
- Total Fee: ${isINR ? '₹45,000 – ₹65,000' : '$1,500 – $2,200'}
- Delivery Timeline: 10 Business Days
- Ongoing Support: 30 days post-launch warranty included.`,
    },
    local_seo: {
      title: 'Local 3-Pack SEO & Google Business Profile Optimization',
      email: {
        step1: `Subject: Google Maps ranking for ${business.name} in ${business.location.city}\n\nHi Team,\n\nDid you know that over 80% of local customers choose one of the top 3 results in Google's Map Pack?\n\nWhile ${business.name} has a great reputation, you are currently appearing outside the top 3 for high-intent searches like "${business.category} near me in ${business.location.city}".\n\nWe specialize in ranking local businesses in the top 3 on Google Maps within 60 days.\n\nCan I send you our 1-page ranking gap analysis for your location?\n\nBest,\nAd Grow BD Team`,
        step2: `Subject: Re: Google Maps ranking for ${business.name}\n\nHi,\n\nJust checking if you had a chance to review my note. We analyzed your top 3 local competitors in ${business.location.city} and found 4 quick fixes that can immediately bump your ranking.\n\nLet me know if you would like me to email the breakdown!\n\nBest,\nAd Grow BD Team`,
      },
      coldCall: `[OPENER]: "Hi, is this the owner at ${business.name}?"\n[REASON]: "Hi, my name is [Name] from Ad Grow BD. I'm calling because your competitors in ${business.location.city} are currently capturing the top 3 spots on Google Maps for ${business.category}."\n[HOOK]: "With your existing reviews, you have the potential to take that #1 spot with just a few technical optimizations to your Google profile and citations."\n[CLOSE]: "Do you have 5 minutes tomorrow morning for me to show you how many calls your competitors are getting from that spot?"`,
      whatsapp: `Hi ${business.name} Team! 📍\n\nWe ran a local Google Maps search for "${business.category}" in ${business.location.city}. Your competitors are taking the top 3 spots, even though your service ratings are higher!\n\nWe put together a simple 3-step action plan to help you reach the top 3 and get 20+ more phone inquiries a week. Would you like me to share it?`,
      proposal: `1. PROJECT OBJECTIVE:
Dominate local Google Maps 3-Pack searches for "${business.category}" in ${business.location.city} and drive high-intent inbound calls.

2. CORE DELIVERABLES:
- Comprehensive Google Business Profile audit and category optimization.
- 50+ localized geo-citations and directory synchronizations.
- Review generation strategy & automated response templates.
- Local schema tags and geo-targeted service area pages.

3. INVESTMENT & TIMELINE:
- Monthly Retainer: ${isINR ? '₹25,000 / month' : '$750 / month'}
- Contract Term: 3-month performance sprint.`,
    },
    paid_advertising: {
      title: 'High-Intent Google Ads & Meta Lead Generation',
      email: {
        step1: `Subject: Generating 25+ qualified client inquiries for ${business.name}\n\nHi Team,\n\nWe noticed high commercial search intent for ${business.category.toLowerCase()} in ${business.location.city}, with hundreds of people searching for immediate services every week.\n\nWe manage high-ROI Google Search and Meta ad campaigns that put your business in front of customers at the exact moment they are ready to purchase.\n\nWould you be open to seeing our projected cost-per-lead and ROI model for ${business.name}?\n\nBest,\nAd Grow BD Team`,
        step2: `Subject: Re: Lead generation for ${business.name}\n\nHi Team,\n\nJust wanted to see if your calendar allows for 5-10 new high-paying clients this month. We can share a case study of a similar business in your industry that achieved a 4.8x ROAS within 30 days.\n\nLet me know if you'd like to review it!\n\nBest,\nAd Grow BD Team`,
      },
      coldCall: `[OPENER]: "Hello, could I speak with the marketing director or business owner at ${business.name}?"\n[HOOK]: "Hi, I am calling from Ad Grow BD. We work with leading ${business.category.toLowerCase()} companies in ${business.location.city} to generate exclusive, booked consultations using targeted Google search campaigns."\n[QUALIFY]: "Are you currently accepting new clients or patients this month?"\n[CLOSE]: "We have an estimated forecast for your area showing exactly what your cost-per-lead would be. Can I email that over to you today?"`,
      whatsapp: `Hello ${business.name} Team 👋\n\nWe noticed high demand for ${business.category} in ${business.location.city} right now on Google.\n\nWe help businesses like yours acquire 30+ exclusive client inquiries per month on a pay-for-performance model. Would you be interested in a 5-minute overview?`,
      proposal: `1. PROJECT OBJECTIVE:
Launch targeted Google Search & Meta Ad funnels to generate predictable, exclusive booked consultations for ${business.name}.

2. CORE DELIVERABLES:
- Campaign architecture, high-intent keyword match groups, and negative keyword lists.
- Dedicated high-converting landing page with 1-click booking.
- Conversion tracking via Google Ads & GA4.
- Weekly A/B copy and creative optimization.

3. INVESTMENT:
- Management Fee: ${isINR ? '₹35,000 / month' : '$1,000 / month'} + ad spend.`,
    },
  };

  const currentTemplate = templates[selectedService as keyof typeof templates] || templates.website_development;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Agency Sales Outreach & Pitch Assistant"
      subtitle={`Personalized for ${business.name} • ${business.category}`}
      maxWidth="4xl"
      footer={
        <div className="flex items-center justify-between w-full">
          <div className="text-xs text-slate-500">
            Tailored based on verified digital gaps in <span className="font-semibold text-slate-700">{business.location.city}</span>
          </div>
          <Button variant="outline" size="sm" onClick={onClose}>
            Close Assistant
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Service Selector Buttons */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
            Select Service to Pitch:
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedService('website_development')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedService === 'website_development'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Website Development (Hot Lead)
            </button>
            <button
              onClick={() => setSelectedService('local_seo')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedService === 'local_seo'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Local Maps 3-Pack SEO
            </button>
            <button
              onClick={() => setSelectedService('paid_advertising')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedService === 'paid_advertising'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Paid Ads Lead Funnel
            </button>
          </div>
        </div>

        {/* Channel Tab Navigation */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('email_sequence')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'email_sequence' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Mail className="w-3.5 h-3.5 text-blue-600" />
              Email Sequence (Day 1 & Day 3)
            </button>
            <button
              onClick={() => setActiveTab('cold_call')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'cold_call' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              Cold Call Script
            </button>
            <button
              onClick={() => setActiveTab('whatsapp')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'whatsapp' ? 'bg-teal-50 text-teal-700 border border-teal-200' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 text-teal-600" />
              WhatsApp Pitch
            </button>
            <button
              onClick={() => setActiveTab('proposal_outline')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'proposal_outline' ? 'bg-purple-50 text-purple-700 border border-purple-200' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-purple-600" />
              Proposal Outline
            </button>
          </div>
        </div>

        {/* Content Box */}
        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 font-mono text-xs whitespace-pre-wrap leading-relaxed text-slate-800 relative">
          <div className="absolute top-3 right-3">
            <Button
              variant="outline"
              size="sm"
              leftIcon={copiedKey === activeTab ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              onClick={() => {
                let text = '';
                if (activeTab === 'email_sequence') {
                  text = `${currentTemplate.email.step1}\n\n---\n\n${currentTemplate.email.step2}`;
                } else if (activeTab === 'cold_call') {
                  text = currentTemplate.coldCall;
                } else if (activeTab === 'whatsapp') {
                  text = currentTemplate.whatsapp;
                } else if (activeTab === 'proposal_outline') {
                  text = currentTemplate.proposal;
                }
                handleCopy(text, activeTab);
              }}
            >
              {copiedKey === activeTab ? 'Copied!' : 'Copy to Clipboard'}
            </Button>
          </div>

          {activeTab === 'email_sequence' && (
            <div className="space-y-4">
              <div>
                <span className="font-sans font-bold text-blue-900 block mb-1">
                  [Touchpoint 1: Initial Discovery Email]
                </span>
                {currentTemplate.email.step1}
              </div>
              <div className="pt-4 border-t border-slate-200">
                <span className="font-sans font-bold text-blue-900 block mb-1">
                  [Touchpoint 2: 72-Hour Follow-Up Email]
                </span>
                {currentTemplate.email.step2}
              </div>
            </div>
          )}

          {activeTab === 'cold_call' && currentTemplate.coldCall}
          {activeTab === 'whatsapp' && currentTemplate.whatsapp}
          {activeTab === 'proposal_outline' && currentTemplate.proposal}
        </div>
      </div>
    </Modal>
  );
};
