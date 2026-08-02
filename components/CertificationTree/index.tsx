'use client';
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from '@/contexts/LangContext';
import { Search, ChevronDown, Award, BrainCircuit, Cpu, Building, GraduationCap, Workflow } from 'lucide-react';
import SectionLabel from '../SectionLabel';
import CERTIFICATIONS from '@/data/certifications.json';
import { CertificationProvider, CertificationBadge } from '@/types';
import BadgeModal from './BadgeModal';

/* ── SVG Helper: Hexagon path ── */
function hexPoints(cx: number, cy: number, r: number): string {
  return Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 3) * i - Math.PI / 2;
    return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
  }).join(' ');
}

/* ── Provider Icon Helper ── */
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
  const [view, setView] = useState<'tree' | 'list'>('tree');
  const [search, setSearch] = useState('');
  const [selectedBadge, setSelectedBadge] = useState<any>(null);
  const [activeProvider, setActiveProvider] = useState<string | null>(null);
  const [expandedProvider, setExpandedProvider] = useState<string | null>(null);

  const certData = CERTIFICATIONS as unknown as CertificationProvider[];
  const totalCerts = certData.reduce((a, c) => a + c.items.length, 0);

  const filtered = useMemo(() => {
    if (!search.trim()) return certData;
    const q = search.toLowerCase();
    return certData
      .map((p) => ({
        ...p,
        items: p.items.filter(
          (c: any) =>
            (c[`name_${lang}`] || c.name || '').toLowerCase().includes(q) ||
            p.provider.toLowerCase().includes(q) ||
            (c[`skills_${lang}`] || c.skills || []).some((s: string) => s.toLowerCase().includes(q))
        ),
      }))
      .filter((p) => p.items.length > 0);
  }, [search, lang, certData]);

  /* ── Radial Tree Layout Calculation ── */
  const treeLayout = useMemo(() => {
    const cx = 400, cy = 300;
    const providers = filtered.map((p, i) => {
      const angle = (2 * Math.PI * i) / filtered.length - Math.PI / 2;
      const pr = 160;
      const px = cx + pr * Math.cos(angle);
      const py = cy + pr * Math.sin(angle);
      const certs = p.items.map((c: any, j: number) => {
        const ca = angle + (j - (p.items.length - 1) / 2) * 0.35;
        const cr = 100;
        return {
          ...c,
          x: px + cr * Math.cos(ca),
          y: py + cr * Math.sin(ca),
          provider: p.provider,
          providerColor: p.color,
        };
      });
      return { ...p, x: px, y: py, certs };
    });
    return { cx, cy, providers };
  }, [filtered]);

  const toggleAccordion = (providerId: string) => {
    setExpandedProvider((prev) => (prev === providerId ? null : providerId));
  };

  return (
    <section id="certifications" className="bg-black py-32 px-5 relative">
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

        {/* Controls: Mode Switch & Search */}
        <div className="flex flex-wrap items-center gap-4 mb-10">
          {/* Dual View Toggle Switch */}
          <div className="flex bg-white/[0.04] border border-white/10 rounded-xl p-1 font-mono text-xs">
            <button
              onClick={() => setView('tree')}
              className={`px-5 py-2 rounded-lg font-bold tracking-wider transition-all ${
                view === 'tree'
                  ? 'bg-brand-secondary text-brand-dark shadow-md shadow-brand-secondary/20'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              {lang === 'es' ? '🌳 ÁRBOL' : '🌳 TREE'}
            </button>
            <button
              onClick={() => setView('list')}
              className={`px-5 py-2 rounded-lg font-bold tracking-wider transition-all ${
                view === 'list'
                  ? 'bg-brand-secondary text-brand-dark shadow-md shadow-brand-secondary/20'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              {lang === 'es' ? '📋 LISTA' : '📋 LIST'}
            </button>
          </div>

          {/* Search Box */}
          <div className="flex-1 min-w-[240px] max-w-md relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 w-4 h-4" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={lang === 'es' ? 'Buscar certificación o habilidad...' : 'Search cert or skill...'}
              className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white font-mono placeholder:text-white/25 focus:outline-none focus:border-brand-secondary/60 transition-colors"
            />
          </div>
        </div>

        {/* ── MODO 1: TREE VIEW (SVG Graph & Orbit Nodes) ── */}
        <AnimatePresence mode="wait">
          {view === 'tree' && (
            <motion.div
              key="tree"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
            >
              {/* Desktop Interactive SVG Diagram */}
              <div className="hidden md:block relative bg-white/[0.01] border border-white/10 rounded-2xl p-6 shadow-2xl overflow-hidden">
                <svg viewBox="0 0 800 600" className="w-full h-auto max-h-[600px] select-none">
                  <defs>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="4" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  {/* Lines: Center Hub -> Provider Nodes */}
                  {treeLayout.providers.map((p, i) => (
                    <motion.line
                      key={`line-center-${p.id}`}
                      x1={treeLayout.cx}
                      y1={treeLayout.cy}
                      x2={p.x}
                      y2={p.y}
                      stroke={p.color}
                      strokeWidth="1.5"
                      strokeOpacity={activeProvider === p.id || !activeProvider ? 0.35 : 0.08}
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 0.8, delay: 0.2 + i * 0.08 }}
                    />
                  ))}

                  {/* Lines: Provider Nodes -> Certification Nodes */}
                  {treeLayout.providers.map((p) =>
                    p.certs.map((c: any, j: number) => (
                      <motion.line
                        key={`line-${p.id}-${j}`}
                        x1={p.x}
                        y1={p.y}
                        x2={c.x}
                        y2={c.y}
                        stroke={p.color}
                        strokeWidth="1"
                        strokeOpacity={activeProvider === p.id || !activeProvider ? 0.25 : 0.05}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.6 + j * 0.05 }}
                      />
                    ))
                  )}

                  {/* Central Knowledge Node */}
                  <motion.g
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 0.1 }}
                  >
                    <polygon
                      points={hexPoints(treeLayout.cx, treeLayout.cy, 36)}
                      fill="#6366f120"
                      stroke="#6366f1"
                      strokeWidth="2"
                      filter="url(#glow)"
                    />
                    <text
                      x={treeLayout.cx}
                      y={treeLayout.cy + 4}
                      textAnchor="middle"
                      className="fill-white text-[11px] font-bold tracking-widest font-syne"
                    >
                      {lang === 'es' ? 'CONOCIMIENTO' : 'KNOWLEDGE'}
                    </text>
                  </motion.g>

                  {/* Provider Nodes */}
                  {treeLayout.providers.map((p, i) => (
                    <motion.g
                      key={`provider-node-${p.id}`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', delay: 0.3 + i * 0.08 }}
                      onMouseEnter={() => setActiveProvider(p.id)}
                      onMouseLeave={() => setActiveProvider(null)}
                      className="cursor-pointer"
                    >
                      <circle
                        cx={p.x}
                        cy={p.y}
                        r="24"
                        fill="#090a1a"
                        stroke={p.color}
                        strokeWidth={activeProvider === p.id ? '2.5' : '1.5'}
                        filter={activeProvider === p.id ? 'url(#glow)' : undefined}
                      />
                      <foreignObject x={p.x - 12} y={p.y - 12} width="24" height="24" className="pointer-events-none">
                        <div className="w-full h-full flex items-center justify-center">
                          <ProviderIcon provider={p.provider} color={p.color} size={16} />
                        </div>
                      </foreignObject>
                      <text
                        x={p.x}
                        y={p.y + 36}
                        textAnchor="middle"
                        className="fill-white/80 text-[10px] font-mono font-bold"
                      >
                        {p.provider} ({p.items.length})
                      </text>
                    </motion.g>
                  ))}

                  {/* Certification Badge Orbit Nodes */}
                  {treeLayout.providers.map((p) =>
                    p.certs.map((c: any, j: number) => {
                      const certTitle = (lang === 'es' ? c.name_es : c.name_en) || c.name || '';
                      return (
                        <motion.g
                          key={`cert-node-${p.id}-${j}`}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', delay: 0.6 + j * 0.05 }}
                          onClick={() =>
                            setSelectedBadge({
                              ...c,
                              providerName: p.provider,
                              providerColor: p.color,
                            })
                          }
                          className="cursor-pointer group"
                        >
                          <circle
                            cx={c.x}
                            cy={c.y}
                            r="10"
                            fill={p.color}
                            fillOpacity="0.2"
                            stroke={p.color}
                            strokeWidth="1.5"
                            className="transition-transform group-hover:scale-125"
                          />
                          <title>{certTitle}</title>
                        </motion.g>
                      );
                    })
                  )}
                </svg>

                <div className="mt-4 text-center text-xs font-mono text-white/40">
                  {lang === 'es'
                    ? '💡 Pasa el cursor sobre un proveedor o haz clic en cualquier nodo para explorar la certificación'
                    : '💡 Hover over a provider or click any node to inspect the certification'}
                </div>
              </div>

              {/* Mobile View fallback for Tree Mode */}
              <div className="block md:hidden grid grid-cols-1 gap-4">
                {filtered.map((p) => (
                  <div
                    key={p.id}
                    className="bg-white/[0.02] border border-white/10 rounded-xl p-4 font-mono"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <ProviderIcon provider={p.provider} color={p.color} size={18} />
                      <h4 className="text-sm font-bold text-white font-syne">{p.provider}</h4>
                    </div>
                    <div className="space-y-2">
                      {p.items.map((c: any, idx: number) => (
                        <div
                          key={idx}
                          onClick={() =>
                            setSelectedBadge({
                              ...c,
                              providerName: p.provider,
                              providerColor: p.color,
                            })
                          }
                          className="p-2.5 rounded-lg bg-white/5 border border-white/5 hover:border-brand-secondary/40 text-xs text-white/80 cursor-pointer flex items-center justify-between"
                        >
                          <span>{(lang === 'es' ? c.name_es : c.name_en) || c.name}</span>
                          <Award size={14} className="text-brand-secondary" />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── MODO 2: LIST VIEW (Collapsible Accordion Grouped by Provider) ── */}
          {view === 'list' && (
            <motion.div
              key="list"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
              className="space-y-4 font-mono"
            >
              {filtered.map((provider) => {
                const isExpanded = expandedProvider === provider.id || Boolean(search.trim());

                return (
                  <div
                    key={provider.id}
                    className="bg-white/[0.02] border border-white/10 rounded-2xl overflow-hidden transition-all hover:border-white/20"
                  >
                    {/* Accordion Header */}
                    <button
                      onClick={() => toggleAccordion(provider.id)}
                      className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none bg-white/[0.01] hover:bg-white/[0.03] transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 border"
                          style={{ borderColor: `${provider.color}40` }}
                        >
                          <ProviderIcon provider={provider.provider} color={provider.color} size={20} />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-white font-syne">{provider.provider}</h3>
                          <span className="text-xs text-white/40">
                            {provider.items.length}{' '}
                            {lang === 'es' ? 'titulaciones / certificaciones' : 'certifications'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-xs text-white/30 hidden sm:inline">
                          {isExpanded ? (lang === 'es' ? 'Plegar' : 'Collapse') : (lang === 'es' ? 'Desplegar' : 'Expand')}
                        </span>
                        <motion.div
                          animate={{ rotate: isExpanded ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                          className="p-2 rounded-lg bg-white/5 text-white/60"
                        >
                          <ChevronDown size={18} />
                        </motion.div>
                      </div>
                    </button>

                    {/* Accordion Body */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="border-t border-white/5 px-6 py-5 bg-black/40"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {provider.items.map((badge: any, index: number) => {
                              const badgeTitle = (lang === 'es' ? badge.name_es : badge.name_en) || badge.name;
                              const skillsList = (lang === 'es' ? badge.skills_es : badge.skills_en) || badge.skills || [];

                              return (
                                <div
                                  key={badge.id || index}
                                  onClick={() =>
                                    setSelectedBadge({
                                      ...badge,
                                      providerName: provider.provider,
                                      providerColor: provider.color,
                                    })
                                  }
                                  className="bg-white/[0.03] border border-white/10 hover:border-brand-secondary/50 rounded-xl p-4 cursor-pointer transition-all hover:bg-white/[0.06] group relative overflow-hidden flex flex-col justify-between"
                                >
                                  <div
                                    className="absolute top-0 left-0 w-1 h-full rounded-l"
                                    style={{ backgroundColor: provider.color }}
                                  />
                                  <div className="pl-2">
                                    <span className="text-[10px] text-white/40 uppercase tracking-widest block mb-1">
                                      {provider.provider} • {badge.year}
                                    </span>
                                    <h4 className="text-sm font-bold text-white group-hover:text-brand-secondary transition-colors font-syne">
                                      {badgeTitle}
                                    </h4>
                                  </div>

                                  {skillsList.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5 mt-4 pl-2">
                                      {skillsList.map((skill: string, sIdx: number) => (
                                        <span
                                          key={sIdx}
                                          className="text-[10px] bg-white/5 border border-white/5 text-white/60 px-2 py-0.5 rounded"
                                        >
                                          {skill}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Detail Modal */}
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
