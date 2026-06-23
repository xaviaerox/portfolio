'use client';
import { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from '../contexts/LangContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import SectionLabel from './SectionLabel';
import TIMELINE_DATA from '../data/timeline.json';

const TYPE_CONFIG = {
  milestone: { color: '#8b5cf6', label_es: 'Hitos', label_en: 'Milestones' },
  technology: { color: '#06b6d4', label_es: 'Tecnologías', label_en: 'Technologies' },
  certification: { color: '#6366f1', label_es: 'Certificaciones', label_en: 'Certifications' },
  project: { color: '#f97316', label_es: 'Proyectos', label_en: 'Projects' },
};

export default function TechTimeline() {
  const { lang } = useLang();
  const [filter, setFilter] = useState('all');
  const scrollRef = useRef(null);

  const timeline = TIMELINE_DATA[lang] || [];

  const filtered = useMemo(() => {
    if (filter === 'all') return timeline;
    return timeline.filter(e => e.type === filter);
  }, [timeline, filter]);

  const years = useMemo(() => [...new Set(filtered.map(e => e.year))].sort(), [filtered]);
  const yearSpan = years.length > 1 ? `${years[0]} — ${years[years.length - 1]}` : years[0] || '';
  const totalYears = years.length > 1 ? parseInt(years[years.length - 1]) - parseInt(years[0]) : 0;

  const scroll = (dir) => {
    scrollRef.current?.scrollBy({ left: dir * 350, behavior: 'smooth' });
  };

  return (
    <section id="tech-timeline" className="bg-black py-32 px-5">
      <div className="max-w-[1200px] mx-auto">
        <SectionLabel label={lang === 'es' ? "EVOLUCIÓN TÉCNICA" : "TECHNICAL EVOLUTION"} />
        <h2 className="text-[clamp(28px,3.5vw,48px)] font-extrabold text-white font-syne mt-4 mb-2">
          {lang === 'es' ? 'Evolución técnica' : 'Technical evolution'}
        </h2>
        <p className="text-white/35 text-sm font-mono mb-8">
          {yearSpan} {totalYears > 0 && `· ${totalYears} ${lang === 'es' ? 'años de evolución' : 'years of evolution'}`}
        </p>

        {/* Filters */}
        <div className="flex gap-2 flex-wrap mb-8">
          <button onClick={() => setFilter('all')}
            className={`px-4 py-1.5 rounded-full text-[10px] font-mono tracking-widest border transition-all ${filter === 'all' ? 'bg-white/10 border-white/25 text-white' : 'border-white/10 text-white/40 hover:text-white/70'}`}
          >
            {lang === 'es' ? 'TODO' : 'ALL'}
          </button>
          {Object.entries(TYPE_CONFIG).map(([type, config]) => (
            <button key={type} onClick={() => setFilter(type)}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-mono tracking-widest border transition-all ${filter === type ? `border-white/25 text-white` : 'border-white/10 text-white/40 hover:text-white/70'}`}
              style={filter === type ? { backgroundColor: `${config.color}20`, borderColor: `${config.color}44` } : {}}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: config.color }} />
              {config[`label_${lang}`].toUpperCase()}
            </button>
          ))}
        </div>

        {/* Desktop: Horizontal scroll */}
        <div className="hidden md:block relative">
          {/* Scroll arrows */}
          <button onClick={() => scroll(-1)} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 z-10 w-10 h-10 rounded-full bg-black/80 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all">
            <ChevronLeft size={18} />
          </button>
          <button onClick={() => scroll(1)} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 z-10 w-10 h-10 rounded-full bg-black/80 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all">
            <ChevronRight size={18} />
          </button>

          {/* Scroll container */}
          <div ref={scrollRef} className="overflow-x-auto scrollbar-hide pb-4" style={{ scrollbarWidth: 'none' }}>
            <div className="flex gap-0 min-w-max px-8">
              {years.map((year, yi) => {
                const events = filtered.filter(e => e.year === year);
                return (
                  <div key={year} className="flex flex-col items-center" style={{ minWidth: '200px' }}>
                    {/* Year marker */}
                    <motion.div
                      initial={{ opacity: 0, y: -10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                      transition={{ delay: yi * 0.05 }}
                      className="text-lg font-syne font-extrabold text-white mb-4"
                    >
                      {year}
                    </motion.div>

                    {/* Horizontal line segment */}
                    <div className="w-full h-[2px] relative mb-6">
                      <div className="absolute inset-0 bg-gradient-to-r from-brand-accent/20 via-brand-secondary/30 to-brand-accent/20" />
                      <div className="absolute left-1/2 -translate-x-1/2 -top-1 w-3 h-3 rounded-full bg-brand-accent/40 border-2 border-brand-accent" style={{ boxShadow: '0 0 8px rgba(99,102,241,0.5)' }} />
                    </div>

                    {/* Events */}
                    <div className="space-y-3 w-full px-2">
                      {events.map((event, ei) => {
                        const config = TYPE_CONFIG[event.type] || { color: '#888' };
                        return (
                          <motion.div
                            key={event.id}
                            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: yi * 0.05 + ei * 0.08 }}
                            className="bg-white/[0.02] border border-white/5 rounded-xl p-4 hover:border-white/15 transition-all group cursor-default"
                          >
                            <div className="flex items-start gap-3">
                              <span className="text-xl">{event.icon}</span>
                              <div className="flex-1 min-w-0">
                                <div className="text-white text-sm font-syne font-bold leading-tight">{event.title}</div>
                                <div className="text-white/40 text-[11px] font-sans mt-1 leading-relaxed line-clamp-2">{event.description}</div>
                                <span className="inline-block mt-2 text-[9px] font-mono px-1.5 py-0.5 rounded" style={{ backgroundColor: `${config.color}15`, color: config.color }}>
                                  {config[`label_${lang}`]}
                                </span>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Mobile: Vertical timeline */}
        <div className="md:hidden relative">
          <div className="absolute left-6 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-brand-accent/30 to-transparent" />

          {filtered.map((event, i) => {
            const config = TYPE_CONFIG[event.type] || { color: '#888' };
            return (
              <motion.div key={event.id} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-30px' }} transition={{ duration: 0.5, delay: i * 0.05 }}
                className="pl-16 mb-6 relative"
              >
                <div className="absolute left-3.5 top-4 w-5 h-5 rounded-full border-2 border-brand-dark flex items-center justify-center"
                  style={{ backgroundColor: config.color, boxShadow: `0 0 10px ${config.color}66` }}
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                </div>
                <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{event.icon}</span>
                    <span className="font-mono text-[11px]" style={{ color: config.color }}>{event.year}</span>
                  </div>
                  <div className="text-white text-sm font-syne font-bold">{event.title}</div>
                  <div className="text-white/40 text-[11px] font-sans mt-1 leading-relaxed">{event.description}</div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
