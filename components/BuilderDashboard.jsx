'use client';
import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useLang } from '../contexts/LangContext';
import SectionLabel from './SectionLabel';
import DATA from '../data/learning-paths.json';

/* ── category config ────────────────────────────────────────── */

const CATEGORIES = [
  {
    key: 'learning',
    label_es: 'Aprendiendo',
    label_en: 'Learning',
    color: '#06b6d4',
    dotClass: 'bg-cyan-400',
  },
  {
    key: 'building',
    label_es: 'Construyendo',
    label_en: 'Building',
    color: '#f97316',
    dotClass: 'bg-orange-400',
  },
  {
    key: 'exploring',
    label_es: 'Explorando',
    label_en: 'Exploring',
    color: '#8b5cf6',
    dotClass: 'bg-violet-400',
  },
  {
    key: 'nextGoals',
    label_es: 'Próximos Objetivos',
    label_en: 'Next Goals',
    color: '#10b981',
    dotClass: 'bg-emerald-400',
  },
];

const STATUS_DOTS = {
  active:      '#06b6d4',
  completed:   '#22c55e',
  planned:     '#eab308',
  researching: '#8b5cf6',
  evaluating:  '#f97316',
};

const PRIORITY_COLORS = {
  high:   { bg: 'bg-red-500/15',    text: 'text-red-400',    border: 'border-red-500/30' },
  medium: { bg: 'bg-amber-500/15',  text: 'text-amber-400',  border: 'border-amber-500/30' },
  low:    { bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/30' },
};

/* ── progress bar ───────────────────────────────────────────── */

function ProgressBar({ progress, color }) {
  return (
    <div className="relative h-1.5 w-full rounded-full bg-white/[0.06] overflow-hidden mt-1.5">
      <motion.div
        className="absolute inset-y-0 left-0 rounded-full"
        style={{ background: color }}
        initial={{ width: 0 }}
        whileInView={{ width: `${progress}%` }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
      />
      <span
        className="absolute right-0 -top-4 font-mono text-[10px] tabular-nums"
        style={{ color }}
      >
        {progress}%
      </span>
    </div>
  );
}

/* ── terminal card ──────────────────────────────────────────── */

function TerminalCard({ category, items, lang, index }) {
  const label = lang === 'es' ? category.label_es : category.label_en;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="relative bg-white/[0.02] border border-white/5 rounded-xl overflow-hidden
                 hover:border-white/10 transition-all duration-300 group"
    >
      {/* scan-line overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-10 opacity-[0.03]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.04) 2px, rgba(255,255,255,0.04) 4px)',
        }}
      />

      {/* ── title bar ─────── */}
      <div className="flex items-center gap-2.5 px-4 py-3 border-b border-white/5 bg-white/[0.01]">
        {/* colored dot */}
        <span
          className="w-3 h-3 rounded-full shrink-0"
          style={{ background: category.color, boxShadow: `0 0 8px ${category.color}55` }}
        />
        <span
          className="font-mono text-[11px] tracking-[0.2em] uppercase font-bold"
          style={{ color: category.color }}
        >
          {label}
        </span>
        {/* decorative dots */}
        <div className="ml-auto flex gap-1.5">
          <span className="w-2 h-2 rounded-full bg-white/10" />
          <span className="w-2 h-2 rounded-full bg-white/10" />
          <span className="w-2 h-2 rounded-full bg-white/10" />
        </div>
      </div>

      {/* ── items ─────── */}
      <div className="p-4 space-y-3 relative z-20">
        {items.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.1 + i * 0.08 }}
            className="group/item"
          >
            <div className="flex items-start gap-3">
              {/* status dot */}
              <span
                className="mt-1.5 w-2 h-2 rounded-full shrink-0"
                style={{
                  background: STATUS_DOTS[item.status] || '#6b7280',
                  boxShadow: `0 0 6px ${STATUS_DOTS[item.status] || '#6b7280'}44`,
                }}
              />

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm shrink-0">{item.icon}</span>
                  <p className="text-white/80 text-[13px] font-medium leading-tight truncate">
                    {item.name}
                  </p>
                </div>

                {/* provider sub-label (learning items) */}
                {item.provider && (
                  <p className="font-mono text-[10px] text-white/25 tracking-wider mt-0.5 ml-6">
                    {item.provider}
                  </p>
                )}

                {/* progress bar (learning items) */}
                {typeof item.progress === 'number' && item.progress > 0 && (
                  <div className="mt-2 ml-6">
                    <ProgressBar progress={item.progress} color={category.color} />
                  </div>
                )}

                {/* next goals: priority + target */}
                {item.priority && (
                  <div className="flex items-center gap-2 mt-1.5 ml-6 flex-wrap">
                    <span
                      className={`font-mono text-[9px] tracking-widest uppercase px-2 py-0.5
                                  rounded border ${PRIORITY_COLORS[item.priority]?.bg || ''}
                                  ${PRIORITY_COLORS[item.priority]?.text || 'text-white/40'}
                                  ${PRIORITY_COLORS[item.priority]?.border || 'border-white/10'}`}
                    >
                      {item.priority}
                    </span>
                    {item.target && (
                      <span className="font-mono text-[10px] text-white/25 tracking-wider">
                        → {item.target}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

/* ── main section ───────────────────────────────────────────── */

export default function BuilderDashboard() {
  const { lang } = useLang();
  const focus = DATA.currentFocus[lang] || DATA.currentFocus.es;

  return (
    <section className="bg-brand-dark/95 py-32 px-5 relative overflow-hidden">
      {/* ambient glow */}
      <div
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full blur-[160px] opacity-[0.07]"
        style={{ background: 'radial-gradient(circle, #6366f1, transparent 70%)' }}
      />

      <div className="max-w-[1200px] mx-auto relative z-10">
        {/* ── header ─────── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <SectionLabel label={lang === 'es' ? 'Dashboard' : 'Dashboard'} />

          <h2 className="font-syne font-extrabold text-white text-4xl md:text-5xl mt-4">
            {lang === 'es' ? 'Foco Actual' : 'Current Focus'}
          </h2>

          <p className="text-white/50 mt-3 max-w-xl text-lg">
            {lang === 'es'
              ? 'Lo que estoy construyendo ahora mismo'
              : "What I'm building right now"}
          </p>

          {DATA.lastUpdated && (
            <p className="font-mono text-[11px] text-white/20 tracking-widest mt-4">
              {lang === 'es' ? 'Última actualización' : 'Last updated'}:{' '}
              {DATA.lastUpdated}
            </p>
          )}
        </motion.div>

        {/* ── 2×2 grid ─────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {CATEGORIES.map((cat, i) => (
            <TerminalCard
              key={cat.key}
              category={cat}
              items={focus[cat.key] || []}
              lang={lang}
              index={i}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
