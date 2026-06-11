'use client';
import { motion } from 'framer-motion';
import { useLang } from '../contexts/LangContext';
import SectionLabel from './SectionLabel';
import SKILLS from '../data/skills.json';

export default function Skills() {
  const { lang } = useLang();
  const hardSkills = SKILLS[lang].hard_skills;
  const softSkills = SKILLS[lang].soft_skills;

  return (
    <section id="skills" className="bg-black py-32 px-5">
      <div className="max-w-[1200px] mx-auto">
        <SectionLabel label={lang === 'es' ? "06 / HABILIDADES" : "06 / SKILLS"} />
        <h2 className="text-[clamp(28px,3.5vw,48px)] font-extrabold text-white font-syne mt-4 mb-16">
          {lang === 'es' ? "Capacidades" : "Capabilities"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Hard Skills */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7 }}
          >
            <h3 className="font-mono text-[11px] text-brand-accent tracking-[0.25em] uppercase mb-8">
              {lang === 'es' ? 'Competencias Clave' : 'Core Competencies'}
            </h3>
            
            <div className="space-y-6">
              {hardSkills.map((s, i) => (
                <div key={s.name}>
                  <div className="flex justify-between mb-2">
                    <span className="text-white text-sm font-syne font-semibold">{s.name}</span>
                    <span className="text-brand-accent text-xs font-mono">{s.level}%</span>
                  </div>
                  <div className="h-[3px] bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${s.level}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, delay: 0.2 + i * 0.1, ease: "easeOut" }}
                      className="h-full rounded-full bg-gradient-to-r from-brand-accent to-brand-secondary"
                      style={{ boxShadow: '0 0 12px rgba(99,102,241,0.5)' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Soft Skills & Specializations */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <h3 className="font-mono text-[11px] text-brand-secondary tracking-[0.25em] uppercase mb-8">
              {lang === 'es' ? 'Habilidades Blandas y Enfoque' : 'Soft Skills & Approach'}
            </h3>
            
            <div className="flex flex-wrap gap-2.5 mb-10">
              {softSkills.map((s, i) => (
                <motion.span
                  key={s}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                  className="bg-brand-secondary/10 border border-brand-secondary/20 text-white/70 px-4 py-2 rounded-lg text-[13px] font-sans transition-colors hover:bg-brand-secondary/20 hover:border-brand-secondary/50 hover:text-white"
                >
                  {s}
                </motion.span>
              ))}
            </div>

            <h3 className="font-mono text-[11px] text-purple-500 tracking-[0.25em] uppercase mb-5 mt-10">
              {lang === 'es' ? 'Especializaciones' : 'Specializations'}
            </h3>
            
            <div className="space-y-0">
              {SKILLS[lang].specializations.map((spec, i) => (
                <motion.div
                  key={spec}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 + i * 0.07, duration: 0.5 }}
                  className="flex items-center gap-3 py-2.5 border-b border-white/[0.04]"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0" />
                  <span className="text-white/65 text-sm font-sans">{spec}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
