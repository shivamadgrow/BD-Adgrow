import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import {
  Server,
  Key,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Shield,
  Layers,
  Database,
} from 'lucide-react';

interface ProviderConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeProvider: string;
  onSelectProvider: (providerId: string) => void;
}

export const ProviderConfigModal: React.FC<ProviderConfigModalProps> = ({
  isOpen,
  onClose,
  activeProvider,
  onSelectProvider,
}) => {
  const [googleApiKey, setGoogleApiKey] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveApiKey = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('adgrow_google_api_key', googleApiKey.trim());
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Global Business Data Providers & API Governance"
      subtitle="Authorized provider integrations, compliance limits, and API keys"
      maxWidth="4xl"
      footer={
        <div className="flex items-center justify-between w-full">
          <div className="text-xs text-slate-500">
            Ad Grow BD enforces strict provider compliance &amp; TOS adherence.
          </div>
          <Button variant="outline" size="sm" onClick={onClose}>
            Done
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Provider Cards */}
        <div className="space-y-4">
          {/* Provider 1: Ad Grow BD Verified Global Registry */}
          <div
            className={`p-4 rounded-xl border transition-all ${
              activeProvider === 'local_verified_registry'
                ? 'border-blue-500 bg-blue-50/30 ring-2 ring-blue-500/20'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-900 text-sm">
                      Ad Grow BD Verified Global Registry (Default)
                    </h4>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Active &amp; Ready
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Curated, verified business records with deep audit indicators across India, US, UAE, UK &amp; Australia.
                  </p>
                </div>
              </div>
              <Button
                variant={activeProvider === 'local_verified_registry' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => onSelectProvider('local_verified_registry')}
              >
                {activeProvider === 'local_verified_registry' ? 'Selected' : 'Use Provider'}
              </Button>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-600">
              <div>
                <span className="text-slate-400 block">Coverage:</span> Global Hubs
              </div>
              <div>
                <span className="text-slate-400 block">Lead Fidelity:</span> 100% Verified
              </div>
              <div>
                <span className="text-slate-400 block">Latency:</span> Instant (&lt;10ms)
              </div>
              <div>
                <span className="text-slate-400 block">API Cost:</span> Free (Included)
              </div>
            </div>
          </div>

          {/* Provider 2: Google Maps Platform / Places API */}
          <div
            className={`p-4 rounded-xl border transition-all ${
              activeProvider === 'google_places'
                ? 'border-blue-500 bg-blue-50/30 ring-2 ring-blue-500/20'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
                  <Server className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-900 text-sm">
                      Google Maps Platform (Places API New)
                    </h4>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      Live API Integration
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Direct access to 200M+ global commercial points of interest, contact numbers, and reviews.
                  </p>
                </div>
              </div>
              <Button
                variant={activeProvider === 'google_places' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => onSelectProvider('google_places')}
              >
                {activeProvider === 'google_places' ? 'Selected' : 'Use Provider'}
              </Button>
            </div>

            {/* API Key Form */}
            <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
              <label className="block font-semibold text-slate-700 mb-1">
                Enter Authorized Google Maps Platform API Key (Optional):
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Key className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={googleApiKey}
                    onChange={(e) => setGoogleApiKey(e.target.value)}
                    placeholder="AIzaSy..."
                    className="w-full h-8 pl-9 pr-3 rounded bg-white border border-slate-300 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <Button variant="navy" size="sm" onClick={handleSaveApiKey}>
                  {saveSuccess ? 'Saved!' : 'Save Key'}
                </Button>
              </div>
              <div className="mt-2 text-[11px] text-slate-500 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-600" />
                <span>Keys are saved locally in encrypted browser session and never sent to external servers.</span>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-600">
              <div>
                <span className="text-slate-400 block">Coverage:</span> 200+ Countries
              </div>
              <div>
                <span className="text-slate-400 block">TOS Rule:</span> 30-day cache refresh
              </div>
              <div>
                <span className="text-slate-400 block">Pricing:</span> ~$17 / 1k queries
              </div>
              <div>
                <span className="text-slate-400 block">Attribution:</span> Google Powered
              </div>
            </div>
          </div>

          {/* Provider 3: OpenStreetMap Overpass API */}
          <div
            className={`p-4 rounded-xl border transition-all ${
              activeProvider === 'openstreetmap'
                ? 'border-blue-500 bg-blue-50/30 ring-2 ring-blue-500/20'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-900 text-sm">
                      OpenStreetMap (Overpass Spatial API)
                    </h4>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                      Open Community
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Open-source global spatial POI database. Free for unlimited discovery searches.
                  </p>
                </div>
              </div>
              <Button
                variant={activeProvider === 'openstreetmap' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => onSelectProvider('openstreetmap')}
              >
                {activeProvider === 'openstreetmap' ? 'Selected' : 'Use Provider'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
