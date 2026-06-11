'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from '../contexts/LangContext';
import { BrainCircuit, Cpu, Building, GraduationCap, Workflow } from 'lucide-react';
import SectionLabel from './SectionLabel';
import CERTIFICATIONS from '../data/certifications.json';

export default function Certifications() {
  const { lang } = useLang();
  const [expanded, setExpanded] = useState(null);

  return (
    <section id="certifications" className="bg-black py-32 px-5">
      <div className="max-w-[1200px] mx-auto">
        <SectionLabel label={lang === 'es' ? "04 / CERTIFICACIONES" : "04 / CERTIFICATIONS"} />
        <h2 className="text-[clamp(28px,3.5vw,48px)] font-extrabold text-white font-syne mt-4 mb-4">
          {lang === 'es' ? "Grafo de conocimiento" : "Knowledge graph"}
        </h2>
        <p className="text-white/35 text-sm font-mono mb-16">
          {lang === 'es' 
            ? `${CERTIFICATIONS.reduce((a, c) => a + c.items.length, 0)} certificaciones en ${CERTIFICATIONS.length} proveedores`
            : `${CERTIFICATIONS.reduce((a, c) => a + c.items.length, 0)} certifications across ${CERTIFICATIONS.length} providers`
          }
        </p>

        <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-5">
          {CERTIFICATIONS.map((cert, i) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <div
                className={`bg-white/[0.02] border rounded-2xl overflow-hidden cursor-pointer transition-all duration-300
                  ${expanded === cert.id ? 'border-transparent shadow-lg' : 'border-white/[0.07] hover:border-white/20'}`}
                style={expanded === cert.id ? { borderColor: `${cert.color}55`, boxShadow: `0 10px 30px -10px ${cert.color}33` } : {}}
                onClick={() => setExpanded(expanded === cert.id ? null : cert.id)}
              >
                {/* Header */}
                <div 
                  className={`flex items-center gap-4 p-5 transition-colors duration-300
                    ${expanded === cert.id ? 'border-b' : 'border-b border-transparent'}`}
                  style={expanded === cert.id ? { backgroundColor: `${cert.color}14`, borderColor: `${cert.color}22` } : {}}
                >
                  {/* Badge */}
                  <div 
                    className="w-12 h-12 rounded-xl border flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${cert.color}22`, borderColor: `${cert.color}44` }}
                  >
                    {cert.provider === "Cisco" ? (
                      <svg viewBox="0 0 100 60" width="32" height="32">
                        <rect x="10" y="25" width="4" height="10" fill="#00bceb"/>
                        <rect x="20" y="20" width="4" height="20" fill="#00bceb"/>
                        <rect x="30" y="15" width="4" height="30" fill="#00bceb"/>
                        <rect x="40" y="10" width="4" height="40" fill="#00bceb"/>
                        <rect x="50" y="5" width="4" height="50" fill="#00bceb"/>
                        <rect x="60" y="10" width="4" height="40" fill="#00bceb"/>
                        <rect x="70" y="15" width="4" height="30" fill="#00bceb"/>
                        <rect x="80" y="20" width="4" height="20" fill="#00bceb"/>
                        <rect x="90" y="25" width="4" height="10" fill="#00bceb"/>
                      </svg>
                    ) : cert.provider === "Google" ? (
                      <svg viewBox="0 0 48 48" width="28" height="28">
                        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                        <path fill="#FBBC05" d="M10.54 28.59c-.48-1.45-.76-2.99-.76-4.59s.28-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.98-6.19z"/>
                        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                      </svg>
                    ) : cert.provider === "Anthropic" ? (
                      <BrainCircuit color={cert.color} size={24} />
                    ) : cert.provider === "University of Helsinki" ? (
                      <Cpu color={cert.color} size={24} />
                    ) : cert.provider === "CEOE" ? (
                      <Building color={cert.color} size={24} />
                    ) : cert.provider === "Udemy" ? (
                      <GraduationCap color={cert.color} size={24} />
                    ) : cert.provider === "n8n" ? (
                      <Workflow color={cert.color} size={24} />
                    ) : (
                      <span className="text-base font-black font-mono" style={{ color: cert.color }}>{cert.icon}</span>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="font-syne font-extrabold text-base text-white">{cert.provider}</div>
                    <div className="font-mono text-[11px] text-white/35 mt-0.5">
                      {cert.items.length} {lang === 'es' ? `certificación${cert.items.length > 1 ? "es" : ""}` : `certification${cert.items.length > 1 ? "s" : ""}`}
                    </div>
                  </div>
                  
                  <div 
                    className={`text-lg transition-transform duration-300 ${expanded === cert.id ? 'rotate-45' : 'rotate-0'}`}
                    style={{ color: cert.color }}
                  >
                    +
                  </div>
                </div>

                {/* Expanded items */}
                <AnimatePresence>
                  {expanded === cert.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="p-4 md:p-5">
                        {cert.items.map((item, j) => (
                          <div 
                            key={item.name} 
                            className={`py-3.5 flex gap-5 items-center justify-between
                              ${j < cert.items.length - 1 ? 'border-b border-white/5' : ''}`}
                          >
                            <div className="flex-1">
                              <div className="flex items-baseline gap-3 mb-1.5">
                                <span className="text-white text-sm font-syne font-semibold">{item[`name_${lang}`] || item.name}</span>
                                <span className="font-mono text-[11px]" style={{ color: cert.color }}>{item.year}</span>
                              </div>
                              <div className="flex flex-wrap gap-1.5 items-center">
                                {(item[`skills_${lang}`] || item.skills).map((s) => (
                                  <span 
                                    key={s} 
                                    className="px-2 py-0.5 rounded text-[10px] font-mono"
                                    style={{ backgroundColor: `${cert.color}15`, color: cert.color }}
                                  >
                                    {s}
                                  </span>
                                ))}
                                {item.credly_badge_id && (
                                  <a 
                                    href={`https://www.credly.com/badges/${item.credly_badge_id}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-white/40 hover:text-white text-[10px] font-mono ml-2 inline-flex items-center gap-1 transition-colors"
                                  >
                                    <span>[{lang === 'es' ? 'Verificar ↗' : 'Verify ↗'}]</span>
                                  </a>
                                )}
                                {item.pdf && (
                                  <a 
                                    href={item.pdf}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-white/40 hover:text-white text-[10px] font-mono ml-2 inline-flex items-center gap-1 transition-colors"
                                  >
                                    <span>[{lang === 'es' ? 'Ver Certificado ↗' : 'Certificate ↗'}]</span>
                                  </a>
                                )}
                              </div>
                            </div>
                            
                            {item.badge && (
                              <div className="relative shrink-0">
                                {item.credly_badge_id || item.pdf ? (
                                  <a href={item.credly_badge_id ? `https://www.credly.com/badges/${item.credly_badge_id}` : item.pdf} target="_blank" rel="noreferrer" className="block group">
                                    <img 
                                      src={item.badge} 
                                      alt={item.name} 
                                      className="h-12 w-12 object-contain rounded-lg transition-transform duration-200 group-hover:scale-110 group-hover:brightness-110"
                                    />
                                  </a>
                                ) : (
                                  <img src={item.badge} alt={item.name} className="h-12 w-12 object-contain rounded-lg" />
                                )}
                              </div>
                            )}
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
