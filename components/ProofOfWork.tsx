'use client';
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from '@/contexts/LangContext';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';
import SectionLabel from './SectionLabel';
import CERTIFICATIONS from '@/data/certifications.json';
import PROJECTS from '@/data/projects.json';
import EXPERIENCE from '@/data/experience.json';
import { Language } from '@/types';

interface EvidenceItem {
  id: string;
  name: string;
  type: 'certification' | 'project' | 'experience';
  provider?: string;
  color?: string;
}

interface SkillEvidence {
  name: string;
  items: EvidenceItem[];
}

function buildEvidenceMap(lang: Language): SkillEvidence[] {
  const map: Record<string, SkillEvidence> = {};

  const addEvidence = (skillName: string, evidence: EvidenceItem) => {
    if (!skillName) return;
    const key = skillName.toLowerCase().trim();
    if (!map[key]) map[key] = { name: skillName, items: [] };
    if (!map[key].items.find((i) => i.id === evidence.id)) {
      map[key].items.push(evidence);
    }
  };

  // Certifications
  (CERTIFICATIONS as any[]).forEach((provider) => {
    provider.items.forEach((cert: any) => {
      const skills = (lang === 'es' ? cert.skills_es : cert.skills_en) || cert.skills || [];
      const name = (lang === 'es' ? cert.name_es : cert.name_en) || cert.name || '';
      skills.forEach((s: string) => {
        addEvidence(s, {
          id: `cert-${name}`,
          name,
          type: 'certification',
          provider: provider.provider,
          color: provider.color,
        });
      });
    });
  });

  // Projects
  (PROJECTS as any[]).forEach((proj) => {
    proj.stack.forEach((s: string) => {
      addEvidence(s, {
        id: `proj-${proj.id}`,
        name: proj.name,
        type: 'project',
        color: proj.color,
      });
    });
  });

  // Experience
  (EXPERIENCE as any[]).forEach((exp) => {
    exp.stack.forEach((s: string) => {
      addEvidence(s, {
        id: `exp-${exp.id}`,
        name: exp.company,
        type: 'experience',
        color: exp.color,
      });
    });
  });

  return Object.values(map).sort((a, b) => b.items.length - a.items.length);
}

const TYPE_ICONS: Record<string, string> = {
  certification: '🎓',
  project: '🚀',
  experience: '💼',
};

const TYPE_LABELS: Record<Language, Record<string, string>> = {
  es: { certification: 'Certificación', project: 'Proyecto', experience: 'Experiencia', all: 'Todo' },
  en: { certification: 'Certification', project: 'Project', experience: 'Experience', all: 'All' },
};

const INITIAL_LIMIT = 8;

export default function ProofOfWork() {
  const { lang } = useLang();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<string>('all');
  const [expandedSkill, setExpandedSkill] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  const evidence = useMemo(() => buildEvidenceMap(lang), [lang]);

  const filtered = useMemo(() => {
    let result = evidence;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((s) => s.name.toLowerCase().includes(q));
    }
    if (filter !== 'all') {
      result = result
        .map((s) => ({
          ...s,
          items: s.items.filter((i) => i.type === filter),
        }))
        .filter((s) => s.items.length > 0);
    }
    return result;
  }, [evidence, search, filter]);

  // Apply pagination / limitation unless searching or toggled
  const displayedItems = useMemo(() => {
    if (showAll || search.trim() !== '') return filtered;
    return filtered.slice(0, INITIAL_LIMIT);
  }, [filtered, showAll, search]);

  const maxEvidence = 5;

  return (
    <section id="proof-of-work" className="bg-black py-24 px-5 relative font-mono">
      <div className="max-w-[1200px] mx-auto">
        <SectionLabel label="PROOF OF WORK" />
        <h2 className="text-[clamp(28px,3.5vw,48px)] font-extrabold text-white font-syne mt-4 mb-2">
          Proof of Work
        </h2>
        <p className="text-white/35 text-sm mb-8">
          {lang === 'es' ? 'Cada skill respaldada por evidencia real' : 'Every skill backed by real evidence'}
          {' · '}
          {evidence.length} skills
        </p>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <div className="flex flex-wrap gap-2">
            {['all', 'certification', 'project', 'experience'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-full text-[10px] tracking-widest border transition-all ${
                  filter === f
                    ? 'bg-brand-secondary/20 border-brand-secondary text-brand-secondary font-bold'
                    : 'bg-transparent border-white/10 text-white/40 hover:text-white/70'
                }`}
              >
                {f !== 'all' && <span className="mr-1">{TYPE_ICONS[f]}</span>}
                {TYPE_LABELS[lang][f].toUpperCase()}
              </button>
            ))}
          </div>

          <div className="flex-1 min-w-[180px] max-w-[280px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 w-4 h-4" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={lang === 'es' ? 'Buscar skill...' : 'Search skill...'}
              className="w-full bg-white/[0.04] border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-brand-secondary/50 transition-colors"
            />
          </div>
        </div>

        {/* Evidence Grid */}
        <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-4">
          {displayedItems.map((skill, i) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: (i % 8) * 0.03 }}
            >
              <div
                className={`bg-white/[0.02] border rounded-xl overflow-hidden cursor-pointer transition-all duration-300 ${
                  expandedSkill === skill.name ? 'border-brand-secondary/40' : 'border-white/5 hover:border-white/15'
                }`}
                onClick={() => setExpandedSkill(expandedSkill === skill.name ? null : skill.name)}
              >
                <div className="p-4">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-white text-sm font-syne font-bold">{skill.name}</span>
                    <span className="text-[10px] text-white/30">
                      {skill.items.length} {lang === 'es' ? 'evidencias' : 'evidence'}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="h-[3px] bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-brand-secondary to-indigo-400"
                      style={{
                        width: `${Math.min((skill.items.length / maxEvidence) * 100, 100)}%`,
                        boxShadow: '0 0 8px rgba(6,182,212,0.4)',
                      }}
                    />
                  </div>

                  {/* Type badges */}
                  <div className="flex gap-1.5 mt-3">
                    {['certification', 'project', 'experience'].map((t) => {
                      const count = skill.items.filter((item) => item.type === t).length;
                      if (!count) return null;
                      return (
                        <span key={t} className="text-[9px] px-1.5 py-0.5 rounded bg-white/[0.04] text-white/40">
                          {TYPE_ICONS[t]} {count}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Expanded list */}
                <AnimatePresence>
                  {expandedSkill === skill.name && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="border-t border-white/5 p-4 space-y-2.5 bg-black/40">
                        {skill.items.map((item) => (
                          <div key={item.id} className="flex items-center gap-2.5 text-xs">
                            <span>{TYPE_ICONS[item.type]}</span>
                            <div className="flex-1 overflow-hidden truncate">
                              <span className="text-white/80 font-syne font-semibold">{item.name}</span>
                              {item.provider && <span className="text-white/30 text-[11px] ml-1.5">({item.provider})</span>}
                            </div>
                            <span
                              className="text-[9px] px-2 py-0.5 rounded"
                              style={{ backgroundColor: `${item.color || '#6366f1'}20`, color: item.color || '#6366f1' }}
                            >
                              {TYPE_LABELS[lang][item.type]}
                            </span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Show More / Show Less Toggle Button */}
        {filtered.length > INITIAL_LIMIT && !search.trim() && (
          <div className="mt-8 text-center">
            <button
              onClick={() => setShowAll(!showAll)}
              className="inline-flex items-center gap-2 bg-white/5 border border-white/10 hover:border-brand-secondary/40 text-white/80 hover:text-white px-6 py-2.5 rounded-full text-xs font-mono tracking-wider transition-all hover:bg-white/10"
            >
              <span>
                {showAll
                  ? lang === 'es'
                    ? 'MOSTRAR MENOS'
                    : 'SHOW LESS'
                  : lang === 'es'
                  ? `VER TODAS LAS SKILLS (+${filtered.length - INITIAL_LIMIT})`
                  : `VIEW ALL SKILLS (+${filtered.length - INITIAL_LIMIT})`}
              </span>
              {showAll ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
