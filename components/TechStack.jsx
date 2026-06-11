'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from '../contexts/LangContext';
import SectionLabel from './SectionLabel';
import SKILLS from '../data/skills.json';

export default function TechStack() {
  const { lang } = useLang();
  const TECH_STACK = SKILLS[lang].tech_stack;
  
  const [filter, setFilter] = useState(lang === 'es' ? 'Todas' : 'All');
  
  const allLabel = lang === 'es' ? 'Todas' : 'All';
  const categories = [allLabel, ...new Set(TECH_STACK.map((t) => t.cat))];
  const filtered = filter === allLabel ? TECH_STACK : TECH_STACK.filter((t) => t.cat === filter);

  return (
    <section id="stack" className="bg-black py-32 px-5">
      <div className="max-w-[1200px] mx-auto">
        <SectionLabel label={lang === 'es' ? "02 / TECNOLOGÍAS" : "02 / TECH STACK"} />
        <h2 className="text-[clamp(28px,3.5vw,48px)] font-extrabold text-white font-syne mt-4 mb-4">
          {lang === 'es' ? "Tecnologías que domino" : "Technologies I master"}
        </h2>

        {/* Filter pills */}
        <div className="flex gap-2 flex-wrap mb-12 mt-8">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`px-4 py-1.5 rounded-full text-[11px] font-mono tracking-widest transition-all duration-300
                ${filter === c 
                  ? 'bg-brand-accent/20 border-brand-accent text-brand-accent' 
                  : 'bg-transparent border-white/10 text-white/45 hover:border-white/30 hover:text-white/70'
                } border`}
            >
              {c.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Grid */}
        <motion.div 
          layout
          className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-5"
        >
          <AnimatePresence>
            {filtered.map((tech, i) => (
              <motion.div
                key={tech.name}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="bg-white/[0.02] border border-white/5 rounded-xl p-5 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300"
                style={{
                  '--hover-color': tech.color + '15',
                  '--hover-border': tech.color + '40',
                }}
              >
                {/* Custom hover styles via a pseudo-element or inline style for hover state */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{ backgroundColor: 'var(--hover-color)' }} />
                <div className="absolute inset-0 border rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{ borderColor: 'var(--hover-border)' }} />
                
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-sm font-bold text-white font-syne">{tech.name}</span>
                    <span 
                      className="text-[10px] font-mono px-2 py-0.5 rounded"
                      style={{ color: tech.color, backgroundColor: tech.color + '22' }}
                    >
                      {tech.cat}
                    </span>
                  </div>
                  
                  <div className="h-[3px] bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${tech.level}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.2 + (i % 10) * 0.05 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: tech.color, boxShadow: `0 0 8px ${tech.color}66` }}
                    />
                  </div>
                  <div className="text-[10px] text-white/30 font-mono mt-1.5 text-right">
                    {tech.level}%
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
