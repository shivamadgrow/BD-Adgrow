# Ad Grow BD — Global Business Intelligence & Opportunity Finder
**AI-Powered SaaS Platform for Digital Marketing Agencies & Sales Teams**

---

## 1. Overview

**Ad Grow BD** is an enterprise-grade AI SaaS application designed to help digital marketing agencies discover businesses worldwide, identify observable digital presence deficiencies (missing websites, slow mobile speed, unoptimized Google Business Profiles, absence of booking flows, low review counts), qualify prospects with transparent lead scoring (0–100), and convert qualified leads into long-term agency retainers through an integrated CRM and AI outreach assistant.

---

## 2. Key Capabilities & Modules

### 2.1 Global Business Discovery Engine
- **Multi-Geographic Filtering**: Country (India, USA, UAE, UK, Australia, Canada, Singapore), Region, and Metro City.
- **27+ Industry Taxonomies**: Dental Clinics, Hospitals, HVAC, Electricians, Law Firms, Real Estate Brokers, Restaurants, Gyms, and more.
- **Digital Presence Filtering**:
  - *No Website Listed* (Prime Website Development target).
  - *Website Active* (Redesign, Speed & Conversion optimization target).
  - *Verified Phone Status* (Reachability indicator).
  - *Google Rating & Review Count Thresholds*.
  - *Opportunity Score & Priority Tiers* (Priority A: 75–100, B: 50–74, C: <50).
- **Flexible Filter Logic**: Full support for both `AND` and `OR` filter combinations.
- **Multiple Visualization Views**:
  - *Interactive Data Table* with batch selection, sortable columns, and instant CRM actions.
  - *Card Grid View* with opportunity tags and quick audit previews.
  - *Spatial Map View* with geographic pins and side intelligence drawer.

### 2.2 Website & Digital Presence Audit Engine
- **Lighthouse / Core Web Vitals Simulation**: Mobile & Desktop speed scoring (LCP, FID/INP, CLS).
- **SSL / Security Verification**: Evaluates HTTPS certificates and security headers.
- **Conversion Funnel Probing**: Detects direct appointment schedulers, WhatsApp booking widgets, click-to-call links, and lead capture forms.
- **Local SEO & Schema Inspection**: Checks for structured `LocalBusiness` Schema.org markup and meta descriptions.
- **Evidence-Based Gaps**: Produces concrete, verifiable issue logs with zero guesswork.

### 2.3 AI Business Intelligence Agent
- Generates structured intelligence dossiers for any business:
  - **Business Overview**: Name, category, market location, primary contact channel, last verified date.
  - **Verified Observations**: Direct evidence from public registries.
  - **Identified Opportunity Gaps**: High-confidence commercial needs.
  - **Recommended Sales Angle**: Tailored value proposition and pitch reasoning.
  - **Discovery Call Questions**: 4 probing questions for the first consultation.
  - **Multi-Channel Outreach Drafts**: Instant cold email sequence (Day 1 & Day 3), cold calling script with objection handling, LinkedIn InMail, and WhatsApp pitch.

### 2.4 Prospect Management CRM
- **Full Pipeline Stages**:
  $$\text{Qualified} \rightarrow \text{Ready for Outreach} \rightarrow \text{Contacted} \rightarrow \text{Interested} \rightarrow \text{Meeting Scheduled} \rightarrow \text{Proposal Sent} \rightarrow \text{Closed Won}$$
- **Opportunity Value Tracking**: Configurable in both USD ($) and INR (₹).
- **Task Management**: Follow-up reminders with checkbox completion.
- **Interaction Timeline**: Logging of calls, meetings, notes, and stage changes.
- **Duplicate Prevention**: Safeguards against importing duplicate business entities.

### 2.5 Agency Sales Outreach & Proposal Assistant
- Complete sales copy generator for 5 core service offerings:
  1. *Website Development & Local Lead Funnel*
  2. *Local 3-Pack Maps SEO & GBP Optimization*
  3. *High-Intent Google Ads & Meta Lead Generation*
  4. *Mobile Performance & Core Web Vitals Fix*
  5. *Automated Review Acceleration & Reputation Management*
- 1-click clipboard copy with real user feedback.

### 2.6 Executive Analytics Dashboard
- Total businesses discovered and indexed.
- Missing website ratio (%) across chosen markets.
- Priority A lead distribution.
- Active CRM pipeline value in USD & INR.
- Category opportunity breakdown.
- Geographic market concentration.
- Multi-stage agency conversion funnel.

---

## 3. Technology Stack

- **Framework**: Next.js 14+ (App Router, Server-side rendering, React 18)
- **Language**: TypeScript (Strict typing across all data models)
- **Styling**: Tailwind CSS with custom design tokens (Dark navy navigation, light clean workspace)
- **Icons**: Lucide React
- **Animations**: Purposeful micro-interactions with hardware-accelerated CSS transitions
- **Data Persistence**: In-memory & LocalStorage CRM store with PostgreSQL schema migration readiness

---

## 4. Setup & Running Locally

### Prerequisites
- Node.js 18.0.0 or higher
- npm 9.0.0 or higher

### Installation Steps
```bash
# Clone or navigate to the repository
cd BD

# Install dependencies
npm install

# Build for production
npm run build

# Start the production server
npm run start
```
The application will be live at `http://localhost:3000`.

---

## 5. Data Provider Governance & Compliance

Ad Grow BD adheres to strict data provider policies:
1. **Ad Grow BD Verified Registry**: Built-in curated dataset with high-fidelity records for instant zero-config evaluation.
2. **Google Maps Platform (Places API New)**:
   - Requires valid API Key (`GOOGLE_PLACES_API_KEY`).
   - Complies with Places API Terms of Service (30-day cache refresh lifecycle and Google attribution).
3. **OpenStreetMap / Overpass API**:
   - Open-source spatial POI queries compliant with ODbL license terms.

---

## 6. PostgreSQL Relational Schema Reference

The platform architecture is designed around the normalized PostgreSQL schema documented in [feasibility_and_architecture_plan.md](file:///C:/Users/This%20pc/.gemini/antigravity-ide/brain/8669c4da-36ab-456e-923d-85a8dc269e8b/feasibility_and_architecture_plan.md):
- `organizations`
- `users`
- `businesses`
- `website_audits`
- `opportunity_findings`
- `lead_scores`
- `ai_research_reports`
- `crm_prospects`
- `crm_activities`
- `crm_tasks`

---

## 7. License & Credits

Built for digital marketing agencies, sales professionals, and growth consultancies worldwide.
Developed by the **Ad Grow BD** Software Engineering & AI Team.
