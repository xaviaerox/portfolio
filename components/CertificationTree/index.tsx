'use client';
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from '@/contexts/LangContext';
import { Search, BrainCircuit, Cpu, Building, GraduationCap, Workflow } from 'lucide-react';
import SectionLabel from '../SectionLabel';
import CERTIFICATIONS from '@/data/certifications.json';
import { CertificationProvider, CertificationBadge } from '@/types';
import BadgeCard from './BadgeCard';
import BadgeModal from './BadgeModal';

function ProviderIcon({ provider, color, size = 18 }: { provider: string; color: string; size?: number }) {
  if (provider === 'Cisco')
    return (
      <svg viewBox="0 0 100 60" width={size} height={size}>
        <rect x="20" y="20" width="4" height="20" fill="#00bceb" />
        <rect x="35" y="10" width="4" height="40" fill="#00bceb" />
        <rect x="50" y="5" width="4" height="50" fill="#00bceb" />
        <rect x="65" y="10" width="4" height="40" fill="#00bceb" />
        <rect x="80" y="20" width="4" height="20" fill="#00bceb" />
      </svg>
    );
  if (provider === 'Google')
    return (
      <svg viewBox="0 0 48 48" width={size} height={size}>
        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
        <path fill="#FBBC05" d="M10.54 28.59c-.48-1.45-.76-2.99-.76-4.59s.28-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.98-6.19z" />
        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
      </svg>
    );
  if (provider === 'Microsoft')
    return (
      <svg viewBox="0 0 23 23" width={size} height={size}>
        <rect x="0" y="0" width="10.5" height="10.5" fill="#f25022" />
        <rect x="12.5" y="0" width="10.5" height="10.5" fill="#7fba00" />
        <rect x="0" y="12.5" width="10.5" height="10.5" fill="#00a4ef" />
        <rect x="12.5" y="12.5" width="10.5" height="10.5" fill="#ffb900" />
      </svg>
    );
  if (provider === 'Anthropic') return <BrainCircuit color={color} size={size} />;
  if (provider === 'University of Helsinki') return <Cpu color={color} size={size} />;
  if (provider === 'CEOE') return <Building color={color} size={size} />;
  if (provider === 'Udemy') return <GraduationCap color={color} size={size} />;
  if (provider === 'n8n') return <Workflow color={color} size={size} />;
  return <span className="font-mono font-black text-xs" style={{ color }}>{provider[0]}</span>;
}

export default function CertificationTree() {
  const { lang } = useLang();
  const [search, setSearch] = useState('');
  const [selectedBadge, setSelectedBadge] = useState<any>(null);

  const certData = CERTIFICATIONS as unknown as CertificationProvider[];
  const totalCerts = certData.reduce((a, c) => a + c.items.length, 0);

  const filteredProviders = useMemo(() => {
    if (!search.trim()) return certData;
    const q = search.toLowerCase();
    return certData
      .map((p) => ({
        ...p,
        items: p.items.filter(
          (c) =>
            c.name.toLowerCase().includes(q) ||
            p.provider.toLowerCase().includes(q) ||
            (c.skills || []).some((s) => s.toLowerCase().includes(q))
        ),
      }))
      .filter((p) => p.items.length > 0);
  }, [search, certData]);

  return (
    <section id="certifications" className="bg-black py-24 px-5 relative">
      <div className="max-w-[1200px] mx-auto">
        <SectionLabel label={lang === 'es' ? '04 / CERTIFICACIONES' : '04 / CERTIFICATIONS'} />
        <h2 className="text-[clamp(28px,3.5vw,48px)] font-extrabold text-white font-syne mt-4 mb-2">
          {lang === 'es' ? 'Árbol de conocimiento' : 'Knowledge tree'}
        </h2>
        <p className="text-white/35 text-sm font-mono mb-8">
          {totalCerts}{' '}
          {lang === 'es'
            ? `certificaciones · ${certData.length} proveedores`
            : `certifications · ${certData.length} providers`}
        </p>

        {/* Search Control */}
        <div className="max-w-md relative mb-10">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 w-4 h-4" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={lang === 'es' ? 'Buscar certificación o habilidad...' : 'Search cert or skill...'}
            className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white font-mono placeholder:text-white/25 focus:outline-none focus:border-brand-secondary/60 transition-colors"
          />
        </div>

        {/* Providers Grid */}
        <div className="space-y-10">
          {filteredProviders.map((provider) => (
            <div key={provider.id} className="space-y-4">
              <div className="flex items-center gap-3 border-b border-white/10 pb-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/5"
                  style={{ borderColor: provider.color }}
                >
                  <ProviderIcon provider={provider.provider} color={provider.color} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-syne">{provider.provider}</h3>
                  <span className="text-xs font-mono text-white/40">
                    {provider.items.length} {lang === 'es' ? 'certificaciones' : 'certs'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {provider.items.map((badge) => (
                  <BadgeCard
                    key={badge.id}
                    cert={badge}
                    providerName={provider.provider}
                    providerColor={provider.color}
                    lang={lang}
                    onClick={() =>
                      setSelectedBadge({
                        ...badge,
                        providerName: provider.provider,
                        providerColor: provider.color,
                      })
                    }
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedBadge && (
          <BadgeModal
            cert={selectedBadge}
            lang={lang}
            onClose={() => setSelectedBadge(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
