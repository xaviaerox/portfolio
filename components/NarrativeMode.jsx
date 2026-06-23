'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from '../contexts/LangContext';
import { X } from 'lucide-react';
import NARRATIVE from '../data/narrative.json';

export default function NarrativeMode() {
  const { lang } = useLang();
  const [open, setOpen] = useState(false);
  const [activeChapter, setActiveChapter] = useState(0);
  const scrollRef = useRef(null);
  const chapterRefs = useRef([]);

  const data = NARRATIVE[lang];

  // Lock/unlock body scroll
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  // ESC to close
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Track active chapter on scroll
  useEffect(() => {
    if (!open || !scrollRef.current) return;
    const container = scrollRef.current;
    const onScroll = () => {
      const scrollTop = container.scrollTop;
      const containerH = container.clientHeight;
      let active = 0;
      chapterRefs.current.forEach((ref, i) => {
        if (ref) {
          const top = ref.offsetTop - container.offsetTop;
          if (scrollTop + containerH * 0.4 >= top) active = i;
        }
      });
      setActiveChapter(active);
    };
    container.addEventListener('scroll', onScroll, { passive: true });
    return () => container.removeEventListener('scroll', onScroll);
  }, [open]);

  const scrollToChapter = (i) => {
    chapterRefs.current[i]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <>
      {/* ── Floating Button ── */}
      <motion.button
        onClick={() => { setOpen(true); setActiveChapter(0); }}
        className="fixed bottom-6 right-6 z-[90] bg-brand-accent/20 backdrop-blur-lg border border-brand-accent/40 text-brand-accent px-5 py-3 rounded-full font-mono text-sm tracking-wider shadow-[0_0_30px_rgba(99,102,241,0.3)] hover:shadow-[0_0_50px_rgba(99,102,241,0.5)] hover:bg-brand-accent/30 transition-all"
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        ✦ {lang === 'es' ? 'Mi viaje' : 'My Journey'}
      </motion.button>

      {/* ── Fullscreen Overlay ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[200] bg-[#05050f]/98 backdrop-blur-xl"
          >
            {/* Close button */}
            <button onClick={() => setOpen(false)}
              className="fixed top-6 right-6 z-[210] w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all"
            >
              <X size={18} />
            </button>

            {/* Progress dots */}
            <div className="fixed left-6 top-1/2 -translate-y-1/2 z-[210] hidden md:flex flex-col gap-3">
              {data.chapters.map((ch, i) => (
                <button key={ch.id} onClick={() => scrollToChapter(i)}
                  className="group flex items-center gap-3"
                >
                  <div className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${i === activeChapter ? 'bg-brand-accent scale-125 shadow-[0_0_8px_rgba(99,102,241,0.6)]' : i < activeChapter ? 'bg-brand-accent/50' : 'bg-white/15'}`} />
                  <span className={`text-[10px] font-mono transition-all duration-300 ${i === activeChapter ? 'text-brand-accent opacity-100' : 'text-white/30 opacity-0 group-hover:opacity-100'}`}>
                    {ch.title}
                  </span>
                </button>
              ))}
            </div>

            {/* Scroll content */}
            <div ref={scrollRef} className="absolute inset-0 overflow-y-auto">
              {/* Header */}
              <div className="min-h-[60vh] flex flex-col items-center justify-center px-5 text-center">
                <motion.div
                  initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <div className="text-4xl mb-6">✦</div>
                  <h2 className="text-[clamp(36px,6vw,64px)] font-extrabold text-white font-syne leading-tight mb-4">
                    {data.title}
                  </h2>
                  <p className="text-white/40 text-lg font-mono max-w-md mx-auto">{data.subtitle}</p>
                  <div className="mt-10 w-[1px] h-16 mx-auto bg-gradient-to-b from-brand-accent/50 to-transparent" />
                </motion.div>
              </div>

              {/* Chapters */}
              {data.chapters.map((chapter, i) => (
                <div
                  key={chapter.id}
                  ref={el => { chapterRefs.current[i] = el; }}
                  className="min-h-[70vh] flex items-center justify-center px-5 py-20"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.95 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: false, margin: '-20%' }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className="max-w-2xl w-full"
                  >
                    {/* Chapter number + icon */}
                    <div className="flex items-center gap-4 mb-6">
                      <span className="text-4xl">{chapter.icon}</span>
                      <span className="font-mono text-[11px] text-brand-accent tracking-[0.3em]">
                        {String(i + 1).padStart(2, '0')} / {String(data.chapters.length).padStart(2, '0')}
                      </span>
                    </div>

                    <h3 className="text-[clamp(28px,4vw,40px)] font-extrabold text-white font-syne mb-6">
                      {chapter.title}
                    </h3>

                    <p className="text-white/55 text-base leading-[1.85] font-sans mb-8">
                      {chapter.content}
                    </p>

                    {/* Highlight quote */}
                    <motion.div
                      initial={{ opacity: 0, x: 30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: false }}
                      transition={{ duration: 0.6, delay: 0.3 }}
                      className="border-l-2 border-brand-accent/50 pl-5"
                    >
                      <p className="text-brand-accent/80 text-sm font-mono leading-relaxed italic">
                        "{chapter.highlight}"
                      </p>
                    </motion.div>

                    {/* Divider */}
                    {i < data.chapters.length - 1 && (
                      <div className="mt-16 flex justify-center">
                        <div className="w-[1px] h-12 bg-gradient-to-b from-white/10 to-transparent" />
                      </div>
                    )}

                    {/* CTA on last chapter */}
                    {i === data.chapters.length - 1 && (
                      <motion.div
                        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: false }}
                        transition={{ delay: 0.5 }}
                        className="mt-12 text-center"
                      >
                        <button
                          onClick={() => { setOpen(false); setTimeout(() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }), 300); }}
                          className="bg-brand-accent text-white px-8 py-3.5 rounded-lg text-sm font-mono tracking-widest shadow-[0_0_40px_rgba(99,102,241,0.3)] hover:-translate-y-1 hover:shadow-[0_8px_50px_rgba(99,102,241,0.5)] transition-all"
                        >
                          {lang === 'es' ? 'CONECTEMOS →' : "LET'S CONNECT →"}
                        </button>
                      </motion.div>
                    )}
                  </motion.div>
                </div>
              ))}

              {/* Bottom padding */}
              <div className="h-32" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
