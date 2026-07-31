'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from '@/contexts/LangContext';
import { Menu, X } from 'lucide-react';

export default function Nav() {
  const { lang, setLang } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const handleScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setScrolled(window.scrollY > 60);
      }, 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const links =
    lang === 'es'
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

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setOpen(false);
  };

  return (
    <nav
      aria-label="Navegación principal"
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-400 px-5 md:px-10 ${
        scrolled
          ? 'bg-brand-dark/85 backdrop-blur-xl border-b border-brand-secondary/15'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-[1200px] mx-auto flex items-center justify-between h-[68px]">
        {/* Logo */}
        <span
          tabIndex={0}
          role="button"
          onKeyDown={(e) => e.key === 'Enter' && window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="font-syne text-lg font-extrabold text-white tracking-widest cursor-pointer select-none"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          XAVI<span className="text-brand-secondary"> ALONSO</span>
        </span>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-9" role="menubar">
          {links.map((l) => (
            <button
              key={l.id}
              role="menuitem"
              onClick={() => scrollTo(l.id)}
              className="text-white/55 hover:text-white font-mono text-[13px] tracking-widest transition-colors py-1 focus:outline-none focus:text-brand-secondary"
            >
              {l.label}
            </button>
          ))}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-6">
          {/* Lang Switcher */}
          <div className="flex gap-2 font-mono text-[13px]" aria-label="Cambiar idioma">
            <button
              onClick={() => setLang('es')}
              aria-label="Cambiar idioma a Español"
              className={`transition-colors ${
                lang === 'es' ? 'text-brand-secondary font-bold' : 'text-white/30 hover:text-white/70'
              }`}
            >
              ES
            </button>
            <span className="text-white/15">/</span>
            <button
              onClick={() => setLang('en')}
              aria-label="Switch language to English"
              className={`transition-colors ${
                lang === 'en' ? 'text-brand-secondary font-bold' : 'text-white/30 hover:text-white/70'
              }`}
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
          <button
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={open}
            className="md:hidden text-white p-1"
            onClick={() => setOpen(!open)}
          >
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
