import React, { useState } from 'react';
import { Business } from '@/types';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { businessCategories } from '@/lib/data/categories';
import { supportedCountries } from '@/lib/data/locations';
import { calculateLeadScore } from '@/lib/services/scoring-service';
import { runWebsiteAudit } from '@/lib/services/audit-service';
import { Plus } from 'lucide-react';

interface NewBusinessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddBusiness: (b: Business, addToCrmDirectly: boolean) => void;
}

export const NewBusinessModal: React.FC<NewBusinessModalProps> = ({
  isOpen,
  onClose,
  onAddBusiness,
}) => {
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('cat-dental');
  const [countryCode, setCountryCode] = useState('IN');
  const [city, setCity] = useState('Delhi NCR');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [rating, setRating] = useState('4.8');
  const [reviewCount, setReviewCount] = useState('45');
  const [addToCrm, setAddToCrm] = useState(true);

  const currentCountry = supportedCountries.find((c) => c.code === countryCode);
  const cities = currentCountry ? currentCountry.cities : [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const categoryObj = businessCategories.find((c) => c.id === categoryId);
    const selectedCity = cities.find((c) => c.name === city) || cities[0];

    const hasWeb = website.trim().length > 0;
    const hasPh = phone.trim().length > 0;

    const baseBiz: Partial<Business> = {
      id: `custom-biz-${Date.now()}`,
      sourceProvider: 'local_verified_registry',
      sourceId: `custom-${Date.now()}`,
      name: name.trim(),
      category: categoryObj?.name || 'Local Business',
      categoryId,
      industryGroup: categoryObj?.industryGroup || 'General Services',
      location: {
        countryCode,
        countryName: currentCountry?.name || 'India',
        region: selectedCity?.region || 'Metro',
        city: selectedCity?.name || city,
        lat: selectedCity?.lat || 28.6139,
        lng: selectedCity?.lng || 77.209,
      },
      formattedAddress: address.trim() || `${city}, ${currentCountry?.name}`,
      phone: hasPh ? phone.trim() : undefined,
      phoneStatus: hasPh ? 'available' : 'not_listed',
      website: hasWeb ? website.trim() : undefined,
      websiteStatus: hasWeb ? 'verified_present' : 'not_listed',
      rating: parseFloat(rating) || 4.5,
      reviewCount: parseInt(reviewCount, 10) || 10,
      profileCompleteness: 75,
      photosCount: 8,
      hasOpeningHours: true,
      claimedGbp: true,
      lastVerifiedDate: new Date().toISOString().split('T')[0],
    };

    const { audit, newOpportunities } = runWebsiteAudit(baseBiz as Business);
    const score = calculateLeadScore({ ...baseBiz, audit });

    const completeBusiness: Business = {
      ...(baseBiz as Business),
      audit,
      opportunities: newOpportunities,
      score,
      inCrm: addToCrm,
    };

    onAddBusiness(completeBusiness, addToCrm);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Business Prospect"
      subtitle="Manually index a business, evaluate digital gaps, and qualify for CRM"
      maxWidth="2xl"
      footer={
        <div className="flex items-center justify-between w-full">
          <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={addToCrm}
              onChange={(e) => setAddToCrm(e.target.checked)}
              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
            />
            <span className="font-semibold">Add directly to active CRM Pipeline</span>
          </label>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus className="w-3.5 h-3.5" />}
              onClick={handleSubmit}
            >
              Index &amp; Score Prospect
            </Button>
          </div>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* Name */}
        <div>
          <label className="block font-semibold text-slate-700 mb-1">
            Business / Practice Name *
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Skyline Cosmetic Dentistry & Implant Center"
            className="w-full h-9 px-3 rounded-lg bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Category & Country */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Industry Category</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full h-9 px-3 rounded-lg bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {businessCategories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Country</label>
            <select
              value={countryCode}
              onChange={(e) => {
                setCountryCode(e.target.value);
                const match = supportedCountries.find((c) => c.code === e.target.value);
                if (match && match.cities[0]) {
                  setCity(match.cities[0].name);
                }
              }}
              className="w-full h-9 px-3 rounded-lg bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {supportedCountries.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* City & Address */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">City / Region</label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full h-9 px-3 rounded-lg bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {cities.map((ct) => (
                <option key={ct.name} value={ct.name}>
                  {ct.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Street Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g. Ring Road, Block B, Suite 102"
              className="w-full h-9 px-3 rounded-lg bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Phone & Website */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Public Phone Number (Optional)
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. +91 98110 12345"
              className="w-full h-9 px-3 rounded-lg bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Website URL (Leave empty if no website listed)
            </label>
            <input
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://example.com"
              className="w-full h-9 px-3 rounded-lg bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Rating & Review Count */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Google Rating (1-5)</label>
            <input
              type="number"
              step="0.1"
              min="1"
              max="5"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className="w-full h-9 px-3 rounded-lg bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Review Count</label>
            <input
              type="number"
              min="0"
              value={reviewCount}
              onChange={(e) => setReviewCount(e.target.value)}
              className="w-full h-9 px-3 rounded-lg bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </form>
    </Modal>
  );
};
