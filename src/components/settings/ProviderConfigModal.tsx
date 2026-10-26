import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Server, Key, CheckCircle2, Shield } from 'lucide-react';

interface ProviderConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProviderConfigModal: React.FC<ProviderConfigModalProps> = ({ isOpen, onClose }) => {
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
      title="Google Maps Platform — API Governance"
      subtitle="Authorized live business discovery provider and API key"
      maxWidth="2xl"
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
        <div className="p-4 rounded-xl border border-blue-500 bg-blue-50/30 ring-2 ring-blue-500/20">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
                <Server className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-slate-900 text-sm">Google Maps Platform (Places API New)</h4>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    Live API Integration
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Direct access to 200M+ global commercial points of interest, contact numbers, and reviews.
                </p>
              </div>
            </div>
          </div>

          {/* API Key Form */}
          <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
            <label className="block font-semibold text-slate-700 mb-1">
              Authorized Google Maps Platform API Key:
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
              <span>Saved locally in this browser&apos;s storage only — never sent anywhere except our own search API.</span>
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

          <div className="mt-3 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Active &amp; Ready — this is the only live data provider.</span>
          </div>
        </div>
      </div>
    </Modal>
  );
};
