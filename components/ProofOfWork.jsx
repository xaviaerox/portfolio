'use client';
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from '../contexts/LangContext';
import { Search } from 'lucide-react';
import SectionLabel from './SectionLabel';
import CERTIFICATIONS from '../data/certifications.json';
import PROJECTS from '../data/projects.json';
import EXPERIENCE from '../data/experience.json';

/* ── Build evidence map from multiple sources ── */
function buildEvidenceMap(lang) {
  const map = {};

  const addEvidence = (skillName, evidence) => {
    const key = skillName.toLowerCase().trim();
    if (!map[key]) map[key] = { name: skillName, items: [] };
    // Avoid duplicates
    if (!map[key].items.find(i => i.id === evidence.id)) {
      map[key].items.push(evidence);
    }
  };

  // From certifications
  CERTIFICATIONS.forEach(provider => {
    provider.items.forEach(cert => {
      const skills = cert[`skills_${lang}`] || [];
      const name = cert[`name_${lang}`] || cert.name_es || '';
      skills.forEach(s => {
        addEvidence(s, { id: `cert-${name}`, name, type: 'certification', provider: provider.provider, color: provider.color });
      });
    });
  });

  // From projects
  PROJECTS.forEach(proj => {
    proj.stack.forEach(s => {
      addEvidence(s, { id: `proj-${proj.id}`, name: proj.name, type: 'project', color: proj.color });
    });
  });

  // From experience
  EXPERIENCE.forEach(exp => {
    exp.stack.forEach(s => {
      addEvidence(s, { id: `exp-${exp.id}`, name: exp.company, type: 'experience', color: exp.color });
    });
  });

  return Object.values(map).sort((a, b) => b.items.length - a.items.length);
}

const TYPE_ICONS = { certification: '🎓', project: '🚀', experience: '💼' };
const TYPE_LABELS = {
  es: { certification: 'Certificación', project: 'Proyecto', experience: 'Experiencia', all: 'Todo' },
  en: { certification: 'Certification', project: 'Project', experience: 'Experience', all: 'All' },
};

export default function ProofOfWork() {
  const { lang } = useLang();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [expanded, setExpanded] = useState(null);

  const evidence = useMemo(() => buildEvidenceMap(lang), [lang]);

  const filtered = useMemo(() => {
    let result = evidence;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(s => s.name.toLowerCase().includes(q));
    }
    if (filter !== 'all') {
      result = result.map(s => ({
        ...s,
        items: s.items.filter(i => i.type === filter),
      })).filter(s => s.items.length > 0);
    }
    return result;
  }, [evidence, search, filter]);

  const maxEvidence = 5;

  return (
    <section id="proof-of-work" className="bg-black py-32 px-5">
      <div className="max-w-[1200px] mx-auto">
        <SectionLabel label="PROOF OF WORK" />
        <h2 className="text-[clamp(28px,3.5vw,48px)] font-extrabold text-white font-syne mt-4 mb-2">
          Proof of Work
        </h2>
        <p className="text-white/35 text-sm font-mono mb-8">
          {lang === 'es' ? 'Cada skill respaldada por evidencia real' : 'Every skill backed by real evidence'}
          {' · '}{evidence.length} skills
        </p>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <div className="flex gap-2">
            {['all', 'certification', 'project', 'experience'].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-full text-[10px] font-mono tracking-widest border transition-all ${filter === f ? 'bg-brand-accent/20 border-brand-accent text-brand-accent' : 'bg-transparent border-white/10 text-white/40 hover:text-white/70'}`}
              >
                {f !== 'all' && <span className="mr-1">{TYPE_ICONS[f]}</span>}
                {TYPE_LABELS[lang][f].toUpperCase()}
              </button>
            ))}
          </div>
          <div className="flex-1 min-w-[180px] max-w-[280px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 w-4 h-4" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder={lang === 'es' ? 'Buscar skill...' : 'Search skill...'}
              className="w-full bg-white/[0.04] border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white font-mono placeholder:text-white/25 focus:outline-none focus:border-brand-accent/50 transition-colors"
            />
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4">
          {filtered.map((skill, i) => (
            <motion.div key={skill.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-30px' }} transition={{ duration: 0.5, delay: (i % 12) * 0.04 }}>
              <div
                className={`bg-white/[0.02] border rounded-xl overflow-hidden cursor-pointer transition-all duration-300 ${expanded === skill.name ? 'border-brand-accent/40' : 'border-white/5 hover:border-white/15'}`}
                onClick={() => setExpanded(expanded === skill.name ? null : skill.name)}
              >
                <div className="p-4">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-white text-sm font-syne font-bold">{skill.name}</span>
                    <span className="text-[10px] font-mono text-white/30">{skill.items.length} {lang === 'es' ? 'evidencias' : 'evidence'}</span>
                  </div>

                  {/* Evidence strength bar */}
                  <div className="h-[3px] bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${Math.min((skill.items.length / maxEvidence) * 100, 100)}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      className="h-full rounded-full bg-gradient-to-r from-brand-accent to-brand-secondary"
                      style={{ boxShadow: '0 0 8px rgba(99,102,241,0.5)' }}
                    />
                  </div>

                  {/* Type indicators */}
                  <div className="flex gap-1 mt-2">
                    {['certification', 'project', 'experience'].map(t => {
                      const count = skill.items.filter(i => i.type === t).length;
                      if (!count) return null;
                      return (
                        <span key={t} className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/[0.04] text-white/40">
                          {TYPE_ICONS[t]} {count}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Expanded evidence list */}
                <AnimatePresence>
                  {expanded === skill.name && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}>
                      <div className="border-t border-white/5 p-4 space-y-2">
                        {skill.items.map((item, j) => (
                          <div key={item.id} className="flex items-center gap-3 text-xs">
                            <span>{TYPE_ICONS[item.type]}</span>
                            <div className="flex-1">
                              <span className="text-white/70 font-syne">{item.name}</span>
                              {item.provider && <span className="text-white/30 font-mono ml-2">({item.provider})</span>}
                            </div>
                            <span className="text-[9px] font-mono px-2 py-0.5 rounded" style={{ backgroundColor: item.color + '15', color: item.color }}>
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
      </div>
    </section>
  );
}
