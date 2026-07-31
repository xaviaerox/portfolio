'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Terminal, Cpu, Award, Briefcase, Code } from 'lucide-react';
import { useLang } from '@/contexts/LangContext';

import PROJECTS from '@/data/projects.json';
import CERTIFICATIONS from '@/data/certifications.json';
import SKILLS from '@/data/skills.json';
import EXPERIENCE from '@/data/experience.json';
import { CertificationProvider } from '@/types';

interface SearchResult {
  id: string;
  title: string;
  subtitle: string;
  category: 'project' | 'certification' | 'skill' | 'experience';
  sectionId: string;
}

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const { lang } = useLang();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const results = useMemo<SearchResult[]>(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();

    const items: SearchResult[] = [];

    // Projects
    PROJECTS.forEach((p) => {
      const nameMatch = p.name.toLowerCase().includes(q);
      const descMatch = (lang === 'es' ? p.description_es : p.description_en).toLowerCase().includes(q);
      const stackMatch = p.stack.some((s) => s.toLowerCase().includes(q));
      if (nameMatch || descMatch || stackMatch) {
        items.push({
          id: p.id,
          title: p.name,
          subtitle: lang === 'es' ? p.tagline_es : p.tagline_en,
          category: 'project',
          sectionId: 'projects',
        });
      }
    });

    // Certifications
    (CERTIFICATIONS as unknown as CertificationProvider[]).forEach((provider) => {
      provider.items.forEach((c: any, index: number) => {
        const certName = (lang === 'es' ? c.name_es : c.name_en) || c.name || '';
        if (certName.toLowerCase().includes(q) || provider.provider.toLowerCase().includes(q)) {
          items.push({
            id: c.id || `cert-${provider.id}-${index}`,
            title: certName,
            subtitle: `${provider.provider} (${c.year})`,
            category: 'certification',
            sectionId: 'certifications',
          });
        }
      });
    });

    // Skills
    const currentSkills = SKILLS[lang as 'es' | 'en']?.tech_stack || SKILLS.es.tech_stack;
    currentSkills.forEach((s: { name: string; cat: string; level: number }) => {
      if (s.name.toLowerCase().includes(q) || s.cat.toLowerCase().includes(q)) {
        items.push({
          id: `skill-${s.name}`,
          title: s.name,
          subtitle: `${s.cat} • ${s.level}%`,
          category: 'skill',
          sectionId: 'stack',
        });
      }
    });

    // Experience
    EXPERIENCE.forEach((e) => {
      const companyMatch = e.company.toLowerCase().includes(q);
      const roleMatch = (lang === 'es' ? e.role_es : e.role_en).toLowerCase().includes(q);
      if (companyMatch || roleMatch) {
        items.push({
          id: e.id,
          title: e.company,
          subtitle: lang === 'es' ? e.role_es : e.role_en,
          category: 'experience',
          sectionId: 'experience',
        });
      }
    });

    return items.slice(0, 8);
  }, [query, lang]);

  const navigateTo = (sectionId: string) => {
    setIsOpen(false);
    setQuery('');
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  const getCategoryIcon = (cat: SearchResult['category']) => {
    switch (cat) {
      case 'project':
        return <Code size={16} className="text-brand-secondary" />;
      case 'certification':
        return <Award size={16} className="text-amber-400" />;
      case 'skill':
        return <Cpu size={16} className="text-indigo-400" />;
      case 'experience':
        return <Briefcase size={16} className="text-emerald-400" />;
    }
  };

  return (
    <>
      {/* Floating Trigger Button (Bottom-Right) */}
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Abrir búsqueda global Ctrl+K"
        className="fixed bottom-6 right-6 z-[90] bg-brand-dark/90 border border-brand-secondary/30 text-white/80 hover:text-white px-4 py-2 rounded-full backdrop-blur-md shadow-2xl flex items-center gap-3 text-xs font-mono tracking-wider hover:border-brand-secondary/70 transition-all hover:scale-105"
      >
        <Search size={14} className="text-brand-secondary" />
        <span className="hidden sm:inline">{lang === 'es' ? 'Buscar...' : 'Search...'}</span>
        <kbd className="bg-white/10 text-white/60 px-1.5 py-0.5 rounded text-[10px]">Ctrl+K</kbd>
      </button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[110] flex items-start justify-center pt-20 px-4 bg-brand-dark/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-xl bg-[#090a1a] border border-brand-secondary/30 rounded-2xl shadow-2xl overflow-hidden font-mono"
            >
              {/* Header Input */}
              <div className="flex items-center px-4 py-3 border-b border-white/10">
                <Search size={18} className="text-brand-secondary mr-3" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={lang === 'es' ? 'Buscar tecnologías, proyectos, certificaciones...' : 'Search stack, projects, certs...'}
                  autoFocus
                  className="w-full bg-transparent text-white placeholder-white/40 text-sm outline-none"
                />
                <button onClick={() => setIsOpen(false)} className="text-white/40 hover:text-white p-1">
                  <X size={18} />
                </button>
              </div>

              {/* Body Results */}
              <div className="max-h-80 overflow-y-auto p-2">
                {query.trim() === '' ? (
                  <div className="py-8 text-center text-xs text-white/40">
                    <Terminal size={24} className="mx-auto mb-2 opacity-40 text-brand-secondary" />
                    {lang === 'es' ? 'Escribe algo para buscar en todo el portafolio' : 'Type to search across the entire portfolio'}
                  </div>
                ) : results.length === 0 ? (
                  <div className="py-8 text-center text-xs text-white/40">
                    {lang === 'es' ? 'No se encontraron resultados para' : 'No results found for'} "{query}"
                  </div>
                ) : (
                  <div className="space-y-1">
                    {results.map((res) => (
                      <button
                        key={`${res.category}-${res.id}`}
                        onClick={() => navigateTo(res.sectionId)}
                        className="w-full text-left p-3 rounded-lg hover:bg-white/5 transition-colors flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-md bg-white/5 group-hover:bg-white/10 transition-colors">
                            {getCategoryIcon(res.category)}
                          </div>
                          <div>
                            <div className="text-sm text-white font-bold group-hover:text-brand-secondary transition-colors">
                              {res.title}
                            </div>
                            <div className="text-xs text-white/50">{res.subtitle}</div>
                          </div>
                        </div>
                        <span className="text-[10px] text-white/30 uppercase tracking-widest bg-white/5 px-2 py-1 rounded">
                          {res.category}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-4 py-2 bg-white/[0.02] border-t border-white/5 flex items-center justify-between text-[11px] text-white/40">
                <span>Navigate with click</span>
                <span>ESC to close</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
