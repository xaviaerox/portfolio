'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLang } from '../contexts/LangContext';
import SectionLabel from './SectionLabel';
import PROJECTS from '../data/projects.json';

function ProjectCard({ proj, i, lang }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
    >
      <div
        className={`rounded-[20px] p-8 cursor-pointer transition-all duration-300 relative overflow-hidden group
          ${hovered ? 'bg-white/[0.04] -translate-y-1 shadow-2xl' : 'bg-white/[0.02] border-white/[0.07]'}`}
        style={hovered ? { borderColor: `${proj.color}44`, boxShadow: `0 10px 40px -10px ${proj.color}40` } : { border: '1px solid rgba(255,255,255,0.07)' }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Glow bg */}
        <div 
          className={`absolute -top-[60px] -right-[60px] w-[180px] h-[180px] rounded-full pointer-events-none transition-opacity duration-400
            ${hovered ? 'opacity-100' : 'opacity-0'}`}
          style={{ background: `radial-gradient(circle, ${proj.color}18 0%, transparent 70%)` }}
        />

        <div className="relative z-10">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="font-mono text-[10px] tracking-widest mb-1.5 uppercase" style={{ color: proj.color }}>
                {lang === 'es' ? 'PROYECTO' : 'PROJECT'}
              </div>
              <h3 className="font-syne text-2xl font-extrabold text-white mb-1">{proj.name}</h3>
              <p className="font-mono text-xs" style={{ color: proj.color }}>{proj[`tagline_${lang}`] || proj.tagline}</p>
            </div>
            <div 
              className={`w-11 h-11 rounded-xl flex items-center justify-center text-lg transition-transform duration-300
                ${hovered ? '-rotate-12 scale-110' : 'rotate-0'}`}
              style={{ backgroundColor: `${proj.color}20`, borderColor: `${proj.color}33`, color: proj.color, borderWidth: 1 }}
            >
              →
            </div>
          </div>

          <p className="text-white/50 text-sm leading-relaxed mb-6 font-sans">
            {proj[`description_${lang}`] || proj.description}
          </p>

          {/* Highlights */}
          <div className="flex gap-3 flex-wrap mb-5">
            {(proj[`highlights_${lang}`] || proj.highlights).map((h) => (
              <span 
                key={h} 
                className="bg-white/[0.04] border border-white/[0.08] text-white/65 px-3 py-1 rounded-md text-[11px] font-mono"
              >
                {h}
              </span>
            ))}
          </div>

          {/* Stack */}
          <div className="flex flex-wrap gap-1.5 mb-6">
            {proj.stack.map((s) => (
              <span 
                key={s} 
                className="px-2.5 py-0.5 rounded text-[11px] font-mono"
                style={{ backgroundColor: `${proj.color}15`, color: proj.color }}
              >
                {s}
              </span>
            ))}
          </div>

          {/* Links */}
          <div className="flex gap-3">
            {proj.url && (
              <a 
                href={proj.url} 
                target="_blank" 
                rel="noreferrer"
                className="px-4 py-2 rounded-lg text-xs font-mono no-underline transition-colors duration-200"
                style={{
                  backgroundColor: hovered ? proj.color : `${proj.color}20`,
                  borderColor: hovered ? proj.color : `${proj.color}44`,
                  color: hovered ? '#fff' : proj.color,
                  borderWidth: 1
                }}
              >
                {lang === 'es' ? 'Ver Proyecto' : 'View Project'} ↗
              </a>
            )}
            {proj.github && (
              <a 
                href={proj.github} 
                target="_blank" 
                rel="noreferrer"
                className="bg-white/[0.03] border border-white/10 text-white/60 px-4 py-2 rounded-lg text-xs font-mono no-underline transition-colors hover:border-white hover:text-white"
              >
                GitHub ↗
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Projects() {
  const { lang } = useLang();

  return (
    <section id="projects" className="bg-brand-dark py-32 px-5">
      <div className="max-w-[1200px] mx-auto">
        <SectionLabel label={lang === 'es' ? "05 / PROYECTOS" : "05 / PROJECTS"} />
        <h2 className="text-[clamp(28px,3.5vw,48px)] font-extrabold text-white font-syne mt-4 mb-16">
          {lang === 'es' ? "Trabajos seleccionados" : "Selected work"}
        </h2>

        <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] md:grid-cols-2 gap-5">
          {PROJECTS.map((proj, i) => (
            <ProjectCard key={proj.id} proj={proj} i={i} lang={lang} />
          ))}
        </div>
      </div>
    </section>
  );
}
