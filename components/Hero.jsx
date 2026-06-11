'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLang } from '../contexts/LangContext';
import PROFILE from '../data/profile.json';
import ParticleField from './ParticleField';

export default function Hero() {
  const { lang } = useLang();
  const [mounted, setMounted] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [displayedTagline, setDisplayedTagline] = useState('');

  const taglineText = PROFILE[lang].tagline;

  useEffect(() => {
    setMounted(true);
    let i = 0;
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setDisplayedTagline(taglineText.slice(0, i + 1));
        i++;
        if (i >= taglineText.length) clearInterval(interval);
      }, 45);
      return () => clearInterval(interval);
    }, 1200);
    return () => clearTimeout(timer);
  }, [taglineText]);

  const handleMouseMove = (e) => {
    if (typeof window !== 'undefined') {
      setMousePos({ x: e.clientX - window.innerWidth / 2, y: e.clientY - window.innerHeight / 2 });
    }
  };

  return (
    <section 
      id="hero" 
      onMouseMove={handleMouseMove}
      className="relative min-h-screen flex items-center overflow-hidden bg-brand-dark"
    >
      <ParticleField count={70} color="rgba(6, 182, 212," />

      {/* Ambient glow responsive to mouse */}
      <motion.div 
        animate={{ x: mousePos.x * 0.05, y: mousePos.y * 0.05 }}
        transition={{ type: 'spring', damping: 50, stiffness: 400 }}
        className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full pointer-events-none opacity-50"
        style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)' }}
      />
      <motion.div 
        animate={{ x: mousePos.x * 0.03, y: mousePos.y * 0.03 }}
        transition={{ type: 'spring', damping: 50, stiffness: 400 }}
        className="absolute bottom-[10%] right-[15%] w-[300px] h-[300px] rounded-full pointer-events-none opacity-50"
        style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)' }}
      />

      {/* Grid overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{ 
          backgroundImage: 'linear-gradient(rgba(99,102,241,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.1) 1px, transparent 1px)', 
          backgroundSize: '80px 80px' 
        }} 
      />

      <div className="relative z-10 max-w-[1200px] mx-auto px-5 w-full pt-20">
        
        {/* Status Pill */}
        <motion.div 
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="inline-flex items-center gap-2 mb-8 bg-brand-accent/10 border border-brand-accent/25 rounded-full px-4 py-1.5"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
          <span className="font-mono text-[11px] text-white/70 tracking-widest uppercase">
            {lang === 'es' ? 'DISPONIBLE PARA OPORTUNIDADES' : 'AVAILABLE FOR OPPORTUNITIES'}
          </span>
        </motion.div>

        {/* Name and Photo */}
        <motion.div 
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="flex justify-between items-center gap-10 mb-2 flex-wrap"
        >
          <h1 className="text-[clamp(52px,8vw,96px)] font-extrabold leading-[1.05] tracking-tighter text-white font-syne">
            {PROFILE[lang].name.split(" ").map((w, i) => (
              <span key={i} className="block">
                {i === 1 ? (
                  <span className="text-transparent" style={{ WebkitTextStroke: '1px rgba(99,102,241,0.8)' }}>
                    {w}
                  </span>
                ) : w}
              </span>
            ))}
          </h1>
          <div className="w-[clamp(150px,20vw,250px)] h-[clamp(150px,20vw,250px)] rounded-full overflow-hidden border-2 border-brand-accent/50 shadow-[0_0_40px_rgba(99,102,241,0.3)] shrink-0">
            <img src="/xavi-alonso.jpg" alt={PROFILE[lang].name} className="w-full h-full object-cover" />
          </div>
        </motion.div>

        {/* Role */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="text-[clamp(14px,2vw,18px)] text-brand-secondary font-mono tracking-[0.2em] mb-6 uppercase"
        >
          {PROFILE[lang].role}
        </motion.div>

        {/* Tagline */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-[clamp(18px,2.5vw,26px)] text-white/70 max-w-[580px] font-syne font-normal leading-relaxed mb-12 min-h-[1.5em]"
        >
          {displayedTagline}
          <span className="opacity-60 animate-[blink_1s_infinite]">|</span>
        </motion.p>

        {/* CTAs */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.9 }}
          className="flex gap-4 flex-wrap"
        >
          <button
            onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
            className="bg-brand-accent text-white px-8 py-3.5 rounded-lg text-sm font-mono tracking-widest transition-all shadow-[0_0_40px_rgba(99,102,241,0.3)] hover:-translate-y-1 hover:shadow-[0_8px_50px_rgba(99,102,241,0.5)]"
          >
            {lang === 'es' ? 'VER PROYECTOS →' : 'VIEW PROJECTS →'}
          </button>
          <button
            onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
            className="bg-transparent text-white/80 border border-white/20 px-8 py-3.5 rounded-lg text-sm font-mono tracking-widest transition-all hover:border-white/50 hover:text-white"
          >
            {lang === 'es' ? 'CONTACTAR' : 'GET IN TOUCH'}
          </button>
        </motion.div>

        {/* Stats Row */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="flex gap-12 mt-20 pt-12 border-t border-white/10"
        >
          {(lang === 'es' 
            ? [["12+", "Años Exp."], ["3+", "Casos Éxito"], ["6+", "Certificados"], ["100%", "Disponibilidad"]]
            : [["12+", "Years Exp."], ["3+", "Success Cases"], ["6+", "Certifications"], ["100%", "Availability"]]
          ).map(([n, l]) => (
            <div key={l}>
              <div className="text-3xl md:text-4xl font-extrabold text-white font-syne leading-none mb-2">{n}</div>
              <div className="text-[11px] text-white/40 font-mono tracking-widest uppercase">{l}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
        <span className="font-mono text-[10px] text-white tracking-[0.2em]">SCROLL</span>
        <div className="w-[1px] h-10 bg-gradient-to-b from-white/50 to-transparent animate-[scrollPulse_2s_infinite]" />
      </div>
    </section>
  );
}
