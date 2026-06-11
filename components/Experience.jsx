'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from '../contexts/LangContext';
import SectionLabel from './SectionLabel';
import EXPERIENCE from '../data/experience.json';

export default function Experience() {
  const { lang } = useLang();
  const [expanded, setExpanded] = useState(null);

  return (
    <section id="experience" className="bg-brand-dark/95 py-32 px-5">
      <div className="max-w-[1200px] mx-auto">
        <SectionLabel label={lang === 'es' ? "03 / EXPERIENCIA" : "03 / EXPERIENCE"} />
        <h2 className="text-[clamp(28px,3.5vw,48px)] font-extrabold text-white font-syne mt-4 mb-16">
          {lang === 'es' ? "Evolución profesional" : "Career evolution"}
        </h2>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-brand-accent/40 to-transparent" />

          {EXPERIENCE.map((exp, i) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="pl-[72px] mb-8 relative"
            >
              {/* Node */}
              <div 
                className="absolute left-3 top-6 w-[26px] h-[26px] rounded-full border-[3px] border-brand-dark flex items-center justify-center cursor-pointer z-10 hover:scale-125 transition-transform duration-200"
                style={{ backgroundColor: exp.color, boxShadow: `0 0 20px ${exp.color}66` }}
                onClick={() => setExpanded(expanded === exp.id ? null : exp.id)}
              >
                <div className="w-2 h-2 rounded-full bg-white" />
              </div>

              {/* Card */}
              <div 
                className={`bg-white/[0.02] border rounded-2xl overflow-hidden cursor-pointer transition-colors duration-300
                  ${expanded === exp.id ? 'border-transparent' : 'border-white/5 hover:border-white/10'}`}
                style={expanded === exp.id ? { borderColor: `${exp.color}44` } : {}}
                onClick={() => setExpanded(expanded === exp.id ? null : exp.id)}
              >
                <div className="p-6 md:p-7">
                  <div className="flex justify-between items-start flex-wrap gap-3">
                    <div>
                      <div className="font-mono text-[11px] tracking-widest mb-1.5" style={{ color: exp.color }}>
                        {exp.period}
                      </div>
                      <div className="font-syne font-extrabold text-xl text-white mb-0.5">
                        {exp[`role_${lang}`] || exp.role}
                      </div>
                      <div className="text-white/50 text-sm font-mono">
                        {exp.company} · {exp.location}
                      </div>
                    </div>
                    <div className={`text-white/30 text-lg transition-transform duration-300 ${expanded === exp.id ? 'rotate-180' : 'rotate-0'}`}>
                      ▼
                    </div>
                  </div>
                </div>

                <AnimatePresence>
                  {expanded === exp.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-6 md:px-7 pb-7 border-t border-white/5">
                        <p className="text-white/55 text-sm leading-relaxed my-5 font-sans">
                          {exp[`description_${lang}`] || exp.description}
                        </p>

                        {/* Stack */}
                        <div className="flex flex-wrap gap-1.5 mb-5">
                          {exp.stack.map((s) => (
                            <span 
                              key={s} 
                              className="border px-2.5 py-0.5 rounded text-[11px] font-mono"
                              style={{ backgroundColor: `${exp.color}18`, borderColor: `${exp.color}33`, color: exp.color }}
                            >
                              {s}
                            </span>
                          ))}
                        </div>

                        {/* Achievements */}
                        <div className="space-y-2.5">
                          {(exp[`achievements_${lang}`] || exp.achievements).map((a, idx) => (
                            <div key={idx} className="flex gap-3 items-start">
                              <span className="text-[12px] mt-0.5 shrink-0" style={{ color: exp.color }}>◆</span>
                              <span className="text-white/60 text-[13px] leading-relaxed font-sans">{a}</span>
                            </div>
                          ))}
                        </div>
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
