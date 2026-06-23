'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from '../contexts/LangContext';
import { Menu, X } from 'lucide-react';

export default function Nav() {
  const { lang, setLang } = useLang();
  const [scrollY, setScrollY] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrolled = scrollY > 60;

  const links = lang === 'es'
    ? [
        { label: 'Sobre mí', id: 'about' },
        { label: 'Tecnologías', id: 'stack' },
        { label: 'Experiencia', id: 'experience' },
        { label: 'Certificaciones', id: 'certifications' },
        { label: 'Proyectos', id: 'projects' },
        { label: 'Evolución', id: 'tech-timeline' },
      ]
    : [
        { label: 'About', id: 'about' },
        { label: 'Stack', id: 'stack' },
        { label: 'Experience', id: 'experience' },
        { label: 'Certifications', id: 'certifications' },
        { label: 'Projects', id: 'projects' },
        { label: 'Evolution', id: 'tech-timeline' },
      ];

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setOpen(false);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-400 px-5 md:px-10
      ${scrolled ? 'bg-brand-dark/85 backdrop-blur-xl border-b border-brand-secondary/15' : 'bg-transparent'}
    `}>
      <div className="max-w-[1200px] mx-auto flex items-center justify-between h-[68px]">
        {/* Logo */}
        <span className="font-syne text-lg font-extrabold text-white tracking-widest cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
          XAVI<span className="text-brand-secondary"> ALONSO</span>
        </span>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-9">
          {links.map((l) => (
            <button
              key={l.id}
              onClick={() => scrollTo(l.id)}
              className="text-white/55 hover:text-white font-mono text-[13px] tracking-widest transition-colors py-1"
            >
              {l.label}
            </button>
          ))}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-6">
          {/* Lang Switcher */}
          <div className="flex gap-2 font-mono text-[13px]">
            <button
              onClick={() => setLang('es')}
              className={`transition-colors ${lang === 'es' ? 'text-brand-secondary font-bold' : 'text-white/30 hover:text-white/70'}`}
            >
              ES
            </button>
            <span className="text-white/15">/</span>
            <button
              onClick={() => setLang('en')}
              className={`transition-colors ${lang === 'en' ? 'text-brand-secondary font-bold' : 'text-white/30 hover:text-white/70'}`}
            >
              EN
            </button>
          </div>

          {/* Hire Me CTA Desktop */}
          <button
            onClick={() => scrollTo('contact')}
            className="hidden md:block bg-transparent border border-brand-secondary/50 text-brand-secondary px-5 py-2 rounded-md text-xs font-mono tracking-widest transition-all hover:bg-brand-secondary/15 hover:border-brand-secondary"
          >
            {lang === 'es' ? 'CONTRÁTAME' : 'HIRE ME'}
          </button>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden text-white p-1" onClick={() => setOpen(!open)}>
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="md:hidden fixed top-[68px] left-0 right-0 bottom-0 bg-brand-dark/95 backdrop-blur-xl flex flex-col items-center justify-center gap-8 z-[99]"
          >
            {links.map((l) => (
              <button
                key={l.id}
                onClick={() => scrollTo(l.id)}
                className="text-white text-lg font-mono tracking-widest"
              >
                {l.label}
              </button>
            ))}
            <button
              onClick={() => scrollTo('contact')}
              className="mt-4 bg-brand-secondary text-brand-dark px-8 py-3 rounded-md text-sm font-mono tracking-widest font-bold"
            >
              {lang === 'es' ? 'CONTRÁTAME' : 'HIRE ME'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
