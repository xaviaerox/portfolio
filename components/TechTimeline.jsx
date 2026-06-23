'use client';
import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLang } from '../contexts/LangContext';
import SectionLabel from './SectionLabel';
import DATA from '../data/timeline.json';

const TYPE_COLORS = {
  milestone: '#8b5cf6',
  technology: '#06b6d4',
  certification: '#6366f1',
  project: '#f97316',
};

const TYPE_LABELS = {
  es: {
    all: 'Todo',
    milestone: 'Hitos',
    technology: 'Tecnologías',
    certification: 'Certificaciones',
    project: 'Proyectos',
  },
  en: {
    all: 'All',
    milestone: 'Milestones',
    technology: 'Technologies',
    certification: 'Certifications',
    project: 'Projects',
  },
};

export default function TechTimeline() {
  const { lang } = useLang();
  const [filter, setFilter] = useState('all');
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const items = DATA[lang] || DATA.es;

  const filtered = useMemo(
    () => (filter === 'all' ? items : items.filter((e) => e.type === filter)),
    [items, filter]
  );

  // Group events by year for horizontal layout
  const yearGroups = useMemo(() => {
    const map = new Map();
    filtered.forEach((ev) => {
      if (!map.has(ev.year)) map.set(ev.year, []);
      map.get(ev.year).push(ev);
    });
    return Array.from(map.entries()).sort((a, b) => Number(a[0]) - Number(b[0]));
  }, [filtered]);

  // Compute year span for subtitle
  const allYears = items.map((e) => Number(e.year));
  const minYear = Math.min(...allYears);
  const maxYear = Math.max(...allYears);
  const span = maxYear - minYear;

  // Mobile detection
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Scroll state detection
  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || isMobile) return;
    updateScrollState();
    el.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('resize', updateScrollState);
    return () => {
      el.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
    };
  }, [isMobile, updateScrollState, filtered]);

  const scroll = (dir) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * 360, behavior: 'smooth' });
  };

  const filterTypes = ['all', 'milestone', 'technology', 'certification', 'project'];

  return (
    <section id="timeline" className="bg-black py-32 px-5">
      <div className="max-w-[1200px] mx-auto">
        {/* Header */}
        <SectionLabel label={lang === 'es' ? 'EVOLUCIÓN TÉCNICA' : 'TECHNICAL EVOLUTION'} />
        <h2 className="text-[clamp(28px,3.5vw,48px)] font-extrabold text-white font-syne mt-4 mb-2">
          {lang === 'es' ? 'Evolución técnica' : 'Technical evolution'}
        </h2>
        <p className="font-mono text-[13px] text-white/40 mb-10">
          {minYear} — {maxYear} · {span}{' '}
          {lang === 'es' ? 'años de evolución' : 'years of evolution'}
        </p>

        {/* Filter pills */}
        <div className="flex flex-wrap gap-2 mb-12">
          {filterTypes.map((type) => {
            const active = filter === type;
            const color = type === 'all' ? '#6366f1' : TYPE_COLORS[type];
            return (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className="relative px-4 py-1.5 rounded-full font-mono text-[11px] tracking-widest uppercase border transition-all duration-300"
                style={{
                  backgroundColor: active ? `${color}22` : 'transparent',
                  borderColor: active ? `${color}66` : 'rgba(255,255,255,0.08)',
                  color: active ? color : 'rgba(255,255,255,0.45)',
                  boxShadow: active ? `0 0 16px ${color}33` : 'none',
                }}
              >
                {TYPE_LABELS[lang]?.[type] || TYPE_LABELS.es[type]}
              </button>
            );
          })}
        </div>

        {/* ─── DESKTOP: Horizontal scrollable ─── */}
        {!isMobile && (
          <div className="relative">
            {/* Scroll arrows */}
            <AnimatePresence>
              {canScrollLeft && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => scroll(-1)}
                  className="absolute -left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/[0.06] border border-white/10 backdrop-blur-sm flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors duration-200"
                  aria-label="Scroll left"
                >
                  <ChevronLeft size={18} />
                </motion.button>
              )}
            </AnimatePresence>
            <AnimatePresence>
              {canScrollRight && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => scroll(1)}
                  className="absolute -right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/[0.06] border border-white/10 backdrop-blur-sm flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors duration-200"
                  aria-label="Scroll right"
                >
                  <ChevronRight size={18} />
                </motion.button>
              )}
            </AnimatePresence>

            {/* Fade edges */}
            {canScrollLeft && (
              <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
            )}
            {canScrollRight && (
              <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />
            )}

            {/* Scrollable area */}
            <div
              ref={scrollRef}
              className="overflow-x-auto scrollbar-hide pb-4"
              style={{ scrollBehavior: 'smooth', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              <div className="relative inline-flex gap-0 min-w-max pt-2">
                {/* Horizontal connecting line */}
                <div className="absolute top-[52px] left-0 right-0 h-[2px] bg-gradient-to-r from-brand-accent/20 via-brand-secondary/30 to-brand-accent/20" />

                {yearGroups.map(([year, events], gi) => (
                  <div key={year} className="flex flex-col items-start" style={{ minWidth: events.length > 1 ? `${events.length * 260}px` : '280px' }}>
                    {/* Year marker */}
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: gi * 0.05 }}
                      className="relative mb-0 ml-6"
                    >
                      <span
                        className="font-syne font-extrabold text-lg"
                        style={{
                          color: TYPE_COLORS[events[0]?.type] || '#6366f1',
                          textShadow: `0 0 20px ${TYPE_COLORS[events[0]?.type] || '#6366f1'}55`,
                        }}
                      >
                        {year}
                      </span>
                    </motion.div>

                    {/* Vertical connector */}
                    <div
                      className="ml-10 w-[2px] h-5"
                      style={{
                        background: `linear-gradient(to bottom, ${TYPE_COLORS[events[0]?.type] || '#6366f1'}88, ${TYPE_COLORS[events[0]?.type] || '#6366f1'}22)`,
                      }}
                    />

                    {/* Node dot on the horizontal line */}
                    <div className="ml-[34px] relative">
                      <div
                        className="w-3 h-3 rounded-full border-2 border-black"
                        style={{
                          backgroundColor: TYPE_COLORS[events[0]?.type] || '#6366f1',
                          boxShadow: `0 0 12px ${TYPE_COLORS[events[0]?.type] || '#6366f1'}66`,
                        }}
                      />
                    </div>

                    {/* Vertical line down to cards */}
                    <div
                      className="ml-10 w-[2px] h-6"
                      style={{
                        background: `linear-gradient(to bottom, ${TYPE_COLORS[events[0]?.type] || '#6366f1'}22, transparent)`,
                      }}
                    />

                    {/* Event cards for this year */}
                    <div className="flex gap-4 px-3">
                      {events.map((ev, ei) => (
                        <motion.div
                          key={ev.id}
                          initial={{ opacity: 0, y: 24 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, margin: '-30px' }}
                          transition={{ duration: 0.5, delay: ei * 0.08 }}
                          className="w-[240px] group"
                        >
                          <div
                            className="bg-white/[0.02] border border-white/5 rounded-xl p-5 h-full hover:border-white/10 transition-all duration-300 hover:-translate-y-1"
                            style={{
                              boxShadow: 'none',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.boxShadow = `0 8px 32px ${TYPE_COLORS[ev.type]}18`;
                              e.currentTarget.style.borderColor = `${TYPE_COLORS[ev.type]}44`;
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.boxShadow = 'none';
                              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                            }}
                          >
                            {/* Icon + type badge */}
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-2xl">{ev.icon}</span>
                              <span
                                className="font-mono text-[9px] tracking-widest uppercase px-2 py-0.5 rounded-full border"
                                style={{
                                  color: TYPE_COLORS[ev.type],
                                  borderColor: `${TYPE_COLORS[ev.type]}33`,
                                  backgroundColor: `${TYPE_COLORS[ev.type]}11`,
                                }}
                              >
                                {TYPE_LABELS[lang]?.[ev.type] || ev.type}
                              </span>
                            </div>
                            {/* Title */}
                            <h4 className="font-syne font-extrabold text-white text-sm mb-2 leading-tight">
                              {ev.title}
                            </h4>
                            {/* Description */}
                            <p className="text-white/40 text-[12px] leading-relaxed font-sans">
                              {ev.description}
                            </p>
                            {/* Year badge */}
                            <div className="mt-3 pt-3 border-t border-white/5">
                              <span
                                className="font-mono text-[10px] tracking-widest"
                                style={{ color: TYPE_COLORS[ev.type] }}
                              >
                                {ev.year}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─── MOBILE: Vertical timeline ─── */}
        {isMobile && (
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-5 top-0 bottom-0 w-[2px] bg-gradient-to-b from-brand-accent/30 via-brand-secondary/20 to-transparent" />

            <div className="space-y-6">
              {filtered.map((ev, i) => (
                <motion.div
                  key={ev.id}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                  className="relative pl-14"
                >
                  {/* Node */}
                  <div
                    className="absolute left-[13px] top-5 w-[14px] h-[14px] rounded-full border-2 border-black z-10"
                    style={{
                      backgroundColor: TYPE_COLORS[ev.type],
                      boxShadow: `0 0 14px ${TYPE_COLORS[ev.type]}55`,
                    }}
                  />

                  {/* Card */}
                  <div className="bg-white/[0.02] border border-white/5 rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xl">{ev.icon}</span>
                      <span
                        className="font-mono text-[9px] tracking-widest uppercase px-2 py-0.5 rounded-full border"
                        style={{
                          color: TYPE_COLORS[ev.type],
                          borderColor: `${TYPE_COLORS[ev.type]}33`,
                          backgroundColor: `${TYPE_COLORS[ev.type]}11`,
                        }}
                      >
                        {TYPE_LABELS[lang]?.[ev.type] || ev.type}
                      </span>
                      <span className="ml-auto font-mono text-[10px] tracking-widest" style={{ color: TYPE_COLORS[ev.type] }}>
                        {ev.year}
                      </span>
                    </div>
                    <h4 className="font-syne font-extrabold text-white text-sm mb-1.5">
                      {ev.title}
                    </h4>
                    <p className="text-white/40 text-[12px] leading-relaxed font-sans">
                      {ev.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Hide scrollbar globally for this component */}
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
