'use client';
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, ChevronDown, Award, Rocket, Briefcase } from 'lucide-react';
import { useLang } from '../contexts/LangContext';
import SectionLabel from './SectionLabel';
import CERTIFICATIONS from '../data/certifications.json';
import PROJECTS from '../data/projects.json';
import EXPERIENCE from '../data/experience.json';

/* ── helpers ────────────────────────────────────────────────── */

const normalize = (s) => s.trim().toLowerCase();

function buildEvidenceMap(lang) {
  const map = {}; // key = normalizedSkill → { displayName, items[] }

  const addEvidence = (skillName, item) => {
    const key = normalize(skillName);
    if (!map[key]) map[key] = { displayName: skillName, items: [] };
    // keep the longest/prettiest display name
    if (skillName.length > map[key].displayName.length) {
      map[key].displayName = skillName;
    }
    map[key].items.push(item);
  };

  // ── Certifications
  CERTIFICATIONS.forEach((provider) => {
    provider.items.forEach((cert) => {
      const skills = lang === 'es' ? cert.skills_es : cert.skills_en;
      const name = lang === 'es' ? cert.name_es : cert.name_en;
      (skills || []).forEach((skill) => {
        addEvidence(skill, {
          type: 'certification',
          name,
          source: provider.provider,
          color: provider.color,
        });
      });
    });
  });

  // ── Projects
  PROJECTS.forEach((proj) => {
    (proj.stack || []).forEach((tech) => {
      addEvidence(tech, {
        type: 'project',
        name: proj.name,
        source: lang === 'es' ? proj.tagline_es : proj.tagline_en,
        color: proj.color,
      });
    });
  });

  // ── Experience
  EXPERIENCE.forEach((exp) => {
    (exp.stack || []).forEach((tech) => {
      addEvidence(tech, {
        type: 'experience',
        name: exp.company,
        source: lang === 'es' ? exp.role_es : exp.role_en,
        color: exp.color,
      });
    });
  });

  return Object.values(map).sort((a, b) => b.items.length - a.items.length);
}

const TYPE_META = {
  certification: { icon: '🎓', label_es: 'Certificación', label_en: 'Certification', color: '#6366f1' },
  project:       { icon: '🚀', label_es: 'Proyecto',      label_en: 'Project',       color: '#06b6d4' },
  experience:    { icon: '💼', label_es: 'Experiencia',    label_en: 'Experience',    color: '#f97316' },
};

const FILTER_OPTIONS = [
  { key: 'all',           label_es: 'Todo',            label_en: 'All' },
  { key: 'certification', label_es: 'Certificaciones', label_en: 'Certifications' },
  { key: 'project',       label_es: 'Proyectos',       label_en: 'Projects' },
  { key: 'experience',    label_es: 'Experiencia',     label_en: 'Experience' },
];

/* ── strength bar ───────────────────────────────────────────── */

function StrengthBar({ count }) {
  const pct = Math.min(count / 5, 1) * 100;
  const hue = count >= 5 ? '139' : count >= 3 ? '199' : '263'; // green / cyan / indigo
  return (
    <div className="relative h-1.5 w-full rounded-full bg-white/[0.06] overflow-hidden">
      <motion.div
        className="absolute inset-y-0 left-0 rounded-full"
        style={{ background: `hsl(${hue}, 70%, 55%)` }}
        initial={{ width: 0 }}
        whileInView={{ width: `${pct}%` }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      />
    </div>
  );
}

/* ── evidence card ──────────────────────────────────────────── */

function EvidenceCard({ skill, index, lang, activeFilter }) {
  const [open, setOpen] = useState(false);

  const filtered =
    activeFilter === 'all'
      ? skill.items
      : skill.items.filter((i) => i.type === activeFilter);

  const count = filtered.length;
  if (count === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: index * 0.06 }}
      className="group"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left bg-white/[0.02] border border-white/5 rounded-xl
                   hover:border-brand-accent/30 hover:bg-white/[0.04]
                   transition-all duration-300 overflow-hidden focus:outline-none
                   focus-visible:ring-2 focus-visible:ring-brand-accent/50"
      >
        {/* ── head ─────── */}
        <div className="p-5">
          <div className="flex items-start justify-between gap-3 mb-3">
            <h3 className="font-syne font-bold text-white text-[15px] leading-tight">
              {skill.displayName}
            </h3>
            <span
              className="shrink-0 font-mono text-[11px] px-2 py-0.5 rounded-full
                         bg-brand-accent/15 text-brand-accent tabular-nums"
            >
              {count}
            </span>
          </div>

          {/* mini type badges */}
          <div className="flex gap-1.5 mb-3 flex-wrap">
            {[...new Set(filtered.map((i) => i.type))].map((t) => (
              <span
                key={t}
                className="inline-flex items-center gap-1 font-mono text-[10px] tracking-wider
                           text-white/40 uppercase"
              >
                {TYPE_META[t].icon}
              </span>
            ))}
          </div>

          <StrengthBar count={count} />

          <div className="flex items-center justify-between mt-3">
            <span className="font-mono text-[10px] tracking-widest text-white/30 uppercase">
              {lang === 'es' ? 'Evidencia' : 'Evidence'}
            </span>
            <motion.span
              animate={{ rotate: open ? 180 : 0 }}
              transition={{ duration: 0.25 }}
              className="text-white/30"
            >
              <ChevronDown size={14} />
            </motion.span>
          </div>
        </div>

        {/* ── expandable list ─────── */}
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              key="content"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="px-5 pb-5 space-y-2 border-t border-white/5 pt-4">
                {filtered.map((item, i) => {
                  const meta = TYPE_META[item.type];
                  return (
                    <motion.div
                      key={`${item.type}-${item.name}-${i}`}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.06 }}
                      className="flex items-start gap-3 group/item"
                    >
                      <span className="text-sm mt-0.5 shrink-0">{meta.icon}</span>
                      <div className="min-w-0">
                        <p className="text-white/80 text-[13px] font-medium leading-tight truncate">
                          {item.name}
                        </p>
                        <p className="text-white/30 font-mono text-[10px] tracking-wide truncate">
                          {item.source} ·{' '}
                          {lang === 'es' ? meta.label_es : meta.label_en}
                        </p>
                      </div>
                      <div
                        className="ml-auto mt-1 w-1.5 h-1.5 rounded-full shrink-0"
                        style={{ background: meta.color }}
                      />
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </button>
    </motion.div>
  );
}

/* ── main section ───────────────────────────────────────────── */

export default function ProofOfWork() {
  const { lang } = useLang();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const allSkills = useMemo(() => buildEvidenceMap(lang), [lang]);

  const visible = useMemo(() => {
    const q = normalize(search);
    return allSkills.filter((s) => {
      // text search
      if (q && !normalize(s.displayName).includes(q)) return false;
      // type filter
      if (filter !== 'all' && !s.items.some((i) => i.type === filter)) return false;
      return true;
    });
  }, [allSkills, search, filter]);

  const totalEvidence = allSkills.reduce((sum, s) => sum + s.items.length, 0);

  return (
    <section className="bg-black py-32 px-5">
      <div className="max-w-[1200px] mx-auto">
        {/* ── header ─────── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <SectionLabel label={lang === 'es' ? 'Evidencia' : 'Evidence'} />

          <h2 className="font-syne font-extrabold text-white text-4xl md:text-5xl mt-4">
            Proof of Work
          </h2>

          <p className="text-white/50 mt-3 max-w-xl text-lg">
            {lang === 'es'
              ? 'Cada skill respaldada por evidencia real'
              : 'Every skill backed by real evidence'}
          </p>

          {/* stats strip */}
          <div className="flex gap-6 mt-6 flex-wrap">
            {[
              {
                n: allSkills.length,
                l: lang === 'es' ? 'Skills' : 'Skills',
              },
              {
                n: totalEvidence,
                l: lang === 'es' ? 'Evidencias' : 'Evidence items',
              },
            ].map((s) => (
              <div key={s.l} className="flex items-baseline gap-2">
                <span className="font-syne font-extrabold text-brand-accent text-2xl">
                  {s.n}
                </span>
                <span className="font-mono text-[11px] text-white/30 tracking-widest uppercase">
                  {s.l}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── controls ─────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-4 mb-10"
        >
          {/* search */}
          <div className="relative flex-1 max-w-md">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={lang === 'es' ? 'Buscar skill...' : 'Search skill...'}
              className="w-full bg-white/[0.03] border border-white/10 rounded-lg
                         pl-10 pr-4 py-2.5 text-sm text-white placeholder-white/25
                         focus:outline-none focus:border-brand-accent/50
                         transition-colors duration-200 font-mono"
            />
          </div>

          {/* filters */}
          <div className="flex gap-2 flex-wrap">
            {FILTER_OPTIONS.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`px-4 py-2 rounded-lg font-mono text-[11px] tracking-wider uppercase
                           border transition-all duration-200
                           ${
                             filter === f.key
                               ? 'bg-brand-accent/20 border-brand-accent/40 text-brand-accent'
                               : 'bg-white/[0.02] border-white/10 text-white/40 hover:text-white/60 hover:border-white/20'
                           }`}
              >
                {lang === 'es' ? f.label_es : f.label_en}
              </button>
            ))}
          </div>
        </motion.div>

        {/* ── grid ─────── */}
        <div
          className="grid gap-4"
          style={{
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          }}
        >
          {visible.map((skill, i) => (
            <EvidenceCard
              key={normalize(skill.displayName)}
              skill={skill}
              index={i}
              lang={lang}
              activeFilter={filter}
            />
          ))}
        </div>

        {/* ── empty state ─────── */}
        {visible.length === 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-white/30 font-mono text-sm mt-16 py-12"
          >
            {lang === 'es'
              ? 'No se encontraron skills con esos filtros.'
              : 'No skills found matching those filters.'}
          </motion.p>
        )}
      </div>
    </section>
  );
}
