'use client';
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from '../contexts/LangContext';
import { Search, X, BrainCircuit, Cpu, Building, GraduationCap, Workflow } from 'lucide-react';
import SectionLabel from './SectionLabel';
import CERTIFICATIONS from '../data/certifications.json';

/* ── SVG helper: hexagon path ── */
function hexPoints(cx, cy, r) {
  return Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 3) * i - Math.PI / 2;
    return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
  }).join(' ');
}

/* ── Provider logo mini-component ── */
function ProviderIcon({ provider, color, size = 18 }) {
  if (provider === 'Cisco') return <svg viewBox="0 0 100 60" width={size} height={size}><rect x="20" y="20" width="4" height="20" fill="#00bceb"/><rect x="35" y="10" width="4" height="40" fill="#00bceb"/><rect x="50" y="5" width="4" height="50" fill="#00bceb"/><rect x="65" y="10" width="4" height="40" fill="#00bceb"/><rect x="80" y="20" width="4" height="20" fill="#00bceb"/></svg>;
  if (provider === 'Google') return <svg viewBox="0 0 48 48" width={size} height={size}><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.54 28.59c-.48-1.45-.76-2.99-.76-4.59s.28-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.98-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>;
  if (provider === 'Microsoft') return <svg viewBox="0 0 23 23" width={size} height={size}><rect x="0" y="0" width="10.5" height="10.5" fill="#f25022"/><rect x="12.5" y="0" width="10.5" height="10.5" fill="#7fba00"/><rect x="0" y="12.5" width="10.5" height="10.5" fill="#00a4ef"/><rect x="12.5" y="12.5" width="10.5" height="10.5" fill="#ffb900"/></svg>;
  if (provider === 'Anthropic') return <BrainCircuit color={color} size={size} />;
  if (provider === 'University of Helsinki') return <Cpu color={color} size={size} />;
  if (provider === 'CEOE') return <Building color={color} size={size} />;
  if (provider === 'Udemy') return <GraduationCap color={color} size={size} />;
  if (provider === 'n8n') return <Workflow color={color} size={size} />;
  if (provider === 'Inglés') return <span style={{ fontSize: size }} className="leading-none select-none">🇬🇧</span>;
  return <span className="font-mono font-black text-xs" style={{ color }}>{provider[0]}</span>;
}

/* ── Main Component ── */
export default function CertificationTree() {
  const { lang } = useLang();
  const [view, setView] = useState('tree');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [activeProvider, setActiveProvider] = useState(null);
  const [expanded, setExpanded] = useState(null);

  const totalCerts = CERTIFICATIONS.reduce((a, c) => a + c.items.length, 0);

  const filtered = useMemo(() => {
    if (!search) return CERTIFICATIONS;
    const q = search.toLowerCase();
    return CERTIFICATIONS.map(p => ({
      ...p,
      items: p.items.filter(c =>
        (c[`name_${lang}`] || c.name || '').toLowerCase().includes(q) ||
        (c[`skills_${lang}`] || []).some(s => s.toLowerCase().includes(q))
      ),
    })).filter(p => p.items.length > 0);
  }, [search, lang]);

  /* ── Tree Layout Calculation ── */
  const treeLayout = useMemo(() => {
    const cx = 400, cy = 300;
    const providers = filtered.map((p, i) => {
      const angle = (2 * Math.PI * i) / filtered.length - Math.PI / 2;
      const pr = 160;
      const px = cx + pr * Math.cos(angle);
      const py = cy + pr * Math.sin(angle);
      const certs = p.items.map((c, j) => {
        const ca = angle + ((j - (p.items.length - 1) / 2) * 0.35);
        const cr = 100;
        return { ...c, x: px + cr * Math.cos(ca), y: py + cr * Math.sin(ca), provider: p.provider, providerColor: p.color };
      });
      return { ...p, x: px, y: py, certs };
    });
    return { cx, cy, providers };
  }, [filtered]);

  return (
    <section id="certifications" className="bg-black py-32 px-5 relative">
      <div className="max-w-[1200px] mx-auto">
        <SectionLabel label={lang === 'es' ? "04 / CERTIFICACIONES" : "04 / CERTIFICATIONS"} />
        <h2 className="text-[clamp(28px,3.5vw,48px)] font-extrabold text-white font-syne mt-4 mb-2">
          {lang === 'es' ? 'Árbol de conocimiento' : 'Knowledge tree'}
        </h2>
        <p className="text-white/35 text-sm font-mono mb-8">
          {totalCerts} {lang === 'es' ? `certificaciones · ${CERTIFICATIONS.length} proveedores` : `certifications · ${CERTIFICATIONS.length} providers`}
        </p>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          {/* View Toggle */}
          <div className="flex bg-white/[0.04] border border-white/10 rounded-lg overflow-hidden">
            <button onClick={() => setView('tree')} className={`px-4 py-2 text-xs font-mono transition-all ${view === 'tree' ? 'bg-brand-accent/20 text-brand-accent' : 'text-white/40 hover:text-white/70'}`}>
              {lang === 'es' ? 'ÁRBOL' : 'TREE'}
            </button>
            <button onClick={() => setView('list')} className={`px-4 py-2 text-xs font-mono transition-all ${view === 'list' ? 'bg-brand-accent/20 text-brand-accent' : 'text-white/40 hover:text-white/70'}`}>
              {lang === 'es' ? 'LISTA' : 'LIST'}
            </button>
          </div>
          {/* Search */}
          <div className="flex-1 min-w-[200px] max-w-[320px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 w-4 h-4" />
            <input
              type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder={lang === 'es' ? 'Buscar certificación...' : 'Search certification...'}
              className="w-full bg-white/[0.04] border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white font-mono placeholder:text-white/25 focus:outline-none focus:border-brand-accent/50 transition-colors"
            />
          </div>
        </div>

        {/* ── TREE VIEW ── */}
        <AnimatePresence mode="wait">
          {view === 'tree' && (
            <motion.div key="tree" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
              {/* Desktop SVG Tree */}
              <div className="hidden md:block relative">
                <svg viewBox="0 0 800 600" className="w-full h-auto" style={{ maxHeight: '600px' }}>
                  <defs>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="4" result="blur" />
                      <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                  </defs>

                  {/* Connection lines: center → providers */}
                  {treeLayout.providers.map((p, i) => (
                    <motion.line
                      key={`line-center-${p.id}`} x1={treeLayout.cx} y1={treeLayout.cy} x2={p.x} y2={p.y}
                      stroke={p.color} strokeWidth="1.5" strokeOpacity={activeProvider === p.id || !activeProvider ? 0.3 : 0.05}
                      initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 0.8, delay: 0.3 + i * 0.08 }}
                    />
                  ))}

                  {/* Connection lines: providers → certs */}
                  {treeLayout.providers.map((p) =>
                    p.certs.map((c, j) => (
                      <motion.line
                        key={`line-${p.id}-${j}`} x1={p.x} y1={p.y} x2={c.x} y2={c.y}
                        stroke={p.color} strokeWidth="1" strokeOpacity={activeProvider === p.id || !activeProvider ? 0.2 : 0.03}
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.8 + j * 0.05 }}
                      />
                    ))
                  )}

                  {/* Center node */}
                  <motion.g initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.1 }}>
                    <polygon points={hexPoints(treeLayout.cx, treeLayout.cy, 32)} fill="#6366f115" stroke="#6366f1" strokeWidth="2" filter="url(#glow)" />
                    <text x={treeLayout.cx} y={treeLayout.cy + 4} textAnchor="middle" className="fill-white text-[10px] font-bold" style={{ fontFamily: 'var(--font-syne)' }}>
                      {lang === 'es' ? 'Conocimiento' : 'Knowledge'}
                    </text>
                  </motion.g>

                  {/* Provider nodes */}
                  {treeLayout.providers.map((p, i) => (
                    <motion.g
                      key={p.id}
                      initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: 'spring', delay: 0.3 + i * 0.08 }}
                      onMouseEnter={() => setActiveProvider(p.id)}
                      onMouseLeave={() => setActiveProvider(null)}
                      className="cursor-pointer"
                      style={{ filter: activeProvider === p.id ? 'url(#glow)' : 'none' }}
                    >
                      <polygon points={hexPoints(p.x, p.y, 26)} fill={`${p.color}20`} stroke={p.color} strokeWidth="1.5"
                        style={{ transition: 'all 0.3s', transform: activeProvider === p.id ? `scale(1.1)` : 'scale(1)', transformOrigin: `${p.x}px ${p.y}px` }}
                      />
                      <text x={p.x} y={p.y + 4} textAnchor="middle" className="fill-white text-[9px] font-bold pointer-events-none" style={{ fontFamily: 'var(--font-jetbrains-mono)' }}>
                        {p.provider.length > 8 ? p.provider.slice(0, 7) + '…' : p.provider}
                      </text>
                    </motion.g>
                  ))}

                  {/* Cert nodes */}
                  {treeLayout.providers.map((p) =>
                    p.certs.map((c, j) => (
                      <motion.g
                        key={`cert-${p.id}-${j}`}
                        initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.8 + j * 0.05 }}
                        onClick={() => setSelected({ cert: c, provider: p })}
                        className="cursor-pointer"
                      >
                        <circle cx={c.x} cy={c.y} r="12" fill={`${p.color}15`} stroke={p.color} strokeWidth="1"
                          style={{ transition: 'all 0.3s', transform: selected?.cert === c ? 'scale(1.3)' : activeProvider === p.id ? 'scale(1.15)' : 'scale(1)', transformOrigin: `${c.x}px ${c.y}px`, filter: selected?.cert === c ? 'url(#glow)' : 'none' }}
                        />
                        <text x={c.x} y={c.y + 3} textAnchor="middle" className="fill-white/70 text-[6px] pointer-events-none" style={{ fontFamily: 'var(--font-jetbrains-mono)' }}>
                          {c.year}
                        </text>
                      </motion.g>
                    ))
                  )}
                </svg>

                {/* Legend */}
                <div className="flex justify-center gap-6 mt-4 flex-wrap">
                  {CERTIFICATIONS.map(p => (
                    <button key={p.id} onClick={() => setActiveProvider(activeProvider === p.id ? null : p.id)}
                      className={`flex items-center gap-2 text-[11px] font-mono transition-all px-3 py-1.5 rounded-full border ${activeProvider === p.id ? 'border-white/30 bg-white/10' : 'border-transparent text-white/40 hover:text-white/70'}`}
                    >
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                      {p.provider}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile: Vertical tree */}
              <div className="md:hidden space-y-4">
                {filtered.map((p, i) => (
                  <motion.div key={p.id} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                    <div className="flex items-center gap-3 mb-3 pl-2">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${p.color}20`, border: `1px solid ${p.color}44` }}>
                        <ProviderIcon provider={p.provider} color={p.color} size={16} />
                      </div>
                      <span className="font-syne font-bold text-white text-sm">{p.provider}</span>
                      <span className="text-[10px] font-mono" style={{ color: p.color }}>{p.items.length}</span>
                    </div>
                    <div className="pl-6 border-l-2 ml-4 space-y-2" style={{ borderColor: `${p.color}33` }}>
                      {p.items.map((c, j) => (
                        <div key={j} onClick={() => setSelected({ cert: c, provider: p })}
                          className="bg-white/[0.02] border border-white/5 rounded-lg p-3 cursor-pointer hover:border-white/15 transition-colors"
                        >
                          <div className="text-white text-xs font-syne font-semibold">{c[`name_${lang}`]}</div>
                          <div className="text-[10px] font-mono mt-1" style={{ color: p.color }}>{c.year}</div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── LIST VIEW ── */}
          {view === 'list' && (
            <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}
              className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-5"
            >
              {filtered.map((cert, i) => (
                <motion.div key={cert.id} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.6, delay: i * 0.1 }}>
                  <div className={`bg-white/[0.02] border rounded-2xl overflow-hidden cursor-pointer transition-all duration-300
                    ${expanded === cert.id ? 'border-transparent shadow-lg' : 'border-white/[0.07] hover:border-white/20'}`}
                    style={expanded === cert.id ? { borderColor: `${cert.color}55`, boxShadow: `0 10px 30px -10px ${cert.color}33` } : {}}
                    onClick={() => setExpanded(expanded === cert.id ? null : cert.id)}
                  >
                    <div className={`flex items-center gap-4 p-5 transition-colors duration-300 ${expanded === cert.id ? 'border-b' : 'border-b border-transparent'}`}
                      style={expanded === cert.id ? { backgroundColor: `${cert.color}14`, borderColor: `${cert.color}22` } : {}}
                    >
                      <div className="w-12 h-12 rounded-xl border flex items-center justify-center shrink-0" style={{ backgroundColor: `${cert.color}22`, borderColor: `${cert.color}44` }}>
                        <ProviderIcon provider={cert.provider} color={cert.color} size={22} />
                      </div>
                      <div className="flex-1">
                        <div className="font-syne font-extrabold text-base text-white">{cert.provider}</div>
                        <div className="font-mono text-[11px] text-white/35 mt-0.5">
                          {cert.items.length} {lang === 'es' ? `certificación${cert.items.length > 1 ? "es" : ""}` : `certification${cert.items.length > 1 ? "s" : ""}`}
                        </div>
                      </div>
                      <div className={`text-lg transition-transform duration-300 ${expanded === cert.id ? 'rotate-45' : 'rotate-0'}`} style={{ color: cert.color }}>+</div>
                    </div>
                    <AnimatePresence>
                      {expanded === cert.id && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}>
                          <div className="p-4 md:p-5">
                            {cert.items.map((item, j) => (
                              <div key={j} className={`py-3.5 flex gap-5 items-center justify-between ${j < cert.items.length - 1 ? 'border-b border-white/5' : ''}`}>
                                <div className="flex-1">
                                  <div className="flex items-baseline gap-3 mb-1.5">
                                    <span className="text-white text-sm font-syne font-semibold">{item[`name_${lang}`]}</span>
                                    <span className="font-mono text-[11px]" style={{ color: cert.color }}>{item.year}</span>
                                  </div>
                                  <div className="flex flex-wrap gap-1.5 items-center">
                                    {(item[`skills_${lang}`] || []).map((s) => (
                                      <span key={s} className="px-2 py-0.5 rounded text-[10px] font-mono" style={{ backgroundColor: `${cert.color}15`, color: cert.color }}>{s}</span>
                                    ))}
                                    {item.credly_badge_id && (
                                      <a href={`https://www.credly.com/badges/${item.credly_badge_id}`} target="_blank" rel="noreferrer" className="text-white/40 hover:text-white text-[10px] font-mono ml-2 transition-colors" onClick={e => e.stopPropagation()}>
                                        [{lang === 'es' ? 'Verificar ↗' : 'Verify ↗'}]
                                      </a>
                                    )}
                                    {item.pdf && (
                                      <a href={item.pdf} target="_blank" rel="noreferrer" className="text-white/40 hover:text-white text-[10px] font-mono ml-2 transition-colors" onClick={e => e.stopPropagation()}>
                                        [{lang === 'es' ? 'Certificado ↗' : 'Certificate ↗'}]
                                      </a>
                                    )}
                                  </div>
                                </div>
                                {item.badge && (
                                  <img src={item.badge} alt="" className="h-12 w-12 object-contain rounded-lg shrink-0" />
                                )}
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Detail Panel ── */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
              className="bg-[#0a0a14] border border-white/10 rounded-2xl p-6 max-w-md w-full relative"
              style={{ boxShadow: `0 20px 60px -20px ${selected.provider.color}40` }}
              onClick={e => e.stopPropagation()}
            >
              <button onClick={() => setSelected(null)} className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors">
                <X size={20} />
              </button>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${selected.provider.color}22`, border: `1px solid ${selected.provider.color}44` }}>
                  <ProviderIcon provider={selected.provider.provider} color={selected.provider.color} size={18} />
                </div>
                <div>
                  <div className="font-mono text-[10px] tracking-widest uppercase" style={{ color: selected.provider.color }}>{selected.provider.provider}</div>
                  <div className="font-syne font-extrabold text-lg text-white">{selected.cert[`name_${lang}`]}</div>
                </div>
              </div>
              <div className="font-mono text-xs mb-4" style={{ color: selected.provider.color }}>{selected.cert.year}</div>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {(selected.cert[`skills_${lang}`] || []).map(s => (
                  <span key={s} className="px-2.5 py-1 rounded-md text-[11px] font-mono" style={{ backgroundColor: `${selected.provider.color}15`, color: selected.provider.color }}>{s}</span>
                ))}
              </div>
              {selected.cert.badge && (
                <div className="mb-4 flex justify-center">
                  <img src={selected.cert.badge} alt="" className="h-20 w-20 object-contain rounded-lg" />
                </div>
              )}
              <div className="flex gap-3">
                {selected.cert.credly_badge_id && (
                  <a href={`https://www.credly.com/badges/${selected.cert.credly_badge_id}`} target="_blank" rel="noreferrer"
                    className="flex-1 text-center px-4 py-2 rounded-lg text-xs font-mono transition-colors" style={{ backgroundColor: `${selected.provider.color}20`, color: selected.provider.color, border: `1px solid ${selected.provider.color}44` }}>
                    {lang === 'es' ? 'Verificar en Credly ↗' : 'Verify on Credly ↗'}
                  </a>
                )}
                {selected.cert.pdf && (
                  <a href={selected.cert.pdf} target="_blank" rel="noreferrer"
                    className="flex-1 text-center bg-white/[0.04] border border-white/10 text-white/60 px-4 py-2 rounded-lg text-xs font-mono hover:text-white transition-colors">
                    {lang === 'es' ? 'Ver Certificado ↗' : 'View Certificate ↗'}
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
