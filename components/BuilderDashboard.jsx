'use client';
import { motion } from 'framer-motion';
import { useLang } from '../contexts/LangContext';
import SectionLabel from './SectionLabel';
import LEARNING from '../data/learning-paths.json';

const STATUS_COLORS = {
  active: '#06b6d4',
  completed: '#10b981',
  planned: '#eab308',
  researching: '#8b5cf6',
  evaluating: '#f97316',
};

const CATEGORY_CONFIG = {
  learning: { color: '#06b6d4', label_es: 'Aprendiendo', label_en: 'Learning', icon: '📡' },
  building: { color: '#f97316', label_es: 'Construyendo', label_en: 'Building', icon: '🔨' },
  exploring: { color: '#8b5cf6', label_es: 'Explorando', label_en: 'Exploring', icon: '🧭' },
  nextGoals: { color: '#10b981', label_es: 'Próximos Objetivos', label_en: 'Next Goals', icon: '🎯' },
};

const PRIORITY_COLORS = { high: '#ef4444', medium: '#eab308', low: '#06b6d4' };

function TerminalCard({ category, items, lang, delay }) {
  const config = CATEGORY_CONFIG[category];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay }}
      className="bg-white/[0.02] border border-white/5 rounded-xl overflow-hidden hover:border-white/10 transition-colors group"
    >
      {/* Terminal title bar */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/5" style={{ backgroundColor: `${config.color}08` }}>
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: config.color, boxShadow: `0 0 6px ${config.color}66` }} />
          <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
          <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
        </div>
        <span className="text-[10px] font-mono tracking-widest uppercase ml-2" style={{ color: config.color }}>
          {config.icon} {config[`label_${lang}`]}
        </span>
      </div>

      {/* Items */}
      <div className="p-4 space-y-3">
        {items.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: delay + 0.1 + i * 0.05 }}
            className="flex items-start gap-3"
          >
            {/* Status dot */}
            <span className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: STATUS_COLORS[item.status] || '#666', boxShadow: item.status === 'active' ? `0 0 6px ${STATUS_COLORS.active}88` : 'none' }} />

            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="text-white text-sm font-syne font-semibold">{item.name}</span>
                {item.provider && <span className="text-[10px] font-mono text-white/30">{item.provider}</span>}
              </div>

              {/* Progress bar for learning */}
              {item.progress !== undefined && item.progress > 0 && (
                <div className="mt-1.5">
                  <div className="h-[2px] bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${item.progress}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: delay + 0.3 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: config.color, boxShadow: `0 0 6px ${config.color}66` }}
                    />
                  </div>
                  <div className="text-[9px] font-mono text-white/25 mt-0.5 text-right">{item.progress}%</div>
                </div>
              )}

              {/* Priority + target for goals */}
              {item.priority && (
                <div className="flex gap-2 mt-1">
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded"
                    style={{ backgroundColor: `${PRIORITY_COLORS[item.priority]}15`, color: PRIORITY_COLORS[item.priority] }}>
                    {item.priority.toUpperCase()}
                  </span>
                  {item.target && <span className="text-[9px] font-mono text-white/25">{item.target}</span>}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export default function BuilderDashboard() {
  const { lang } = useLang();
  const focus = LEARNING.currentFocus[lang];

  return (
    <section id="builder-dashboard" className="bg-brand-dark/95 py-32 px-5 relative">
      {/* Subtle scanline overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.015]"
        style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)' }}
      />

      <div className="max-w-[1200px] mx-auto relative z-10">
        <SectionLabel label={lang === 'es' ? "FOCO ACTUAL" : "CURRENT FOCUS"} />
        <h2 className="text-[clamp(28px,3.5vw,48px)] font-extrabold text-white font-syne mt-4 mb-2">
          {lang === 'es' ? 'Foco actual' : 'Current focus'}
        </h2>
        <div className="flex items-center gap-4 mb-10">
          <p className="text-white/35 text-sm font-mono">
            {lang === 'es' ? 'Lo que estoy construyendo ahora mismo' : 'What I\'m building right now'}
          </p>
          <span className="text-[10px] font-mono text-white/20 px-2 py-0.5 rounded border border-white/5">
            {lang === 'es' ? 'Actualizado' : 'Updated'}: {LEARNING.lastUpdated}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <TerminalCard category="learning" items={focus.learning} lang={lang} delay={0} />
          <TerminalCard category="building" items={focus.building} lang={lang} delay={0.1} />
          <TerminalCard category="exploring" items={focus.exploring} lang={lang} delay={0.2} />
          <TerminalCard category="nextGoals" items={focus.nextGoals} lang={lang} delay={0.3} />
        </div>
      </div>
    </section>
  );
}
