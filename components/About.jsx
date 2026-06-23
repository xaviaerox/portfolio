'use client';
import { motion } from 'framer-motion';
import { useLang } from '../contexts/LangContext';
import { Zap, Bot, Wrench, Rocket, Layers, RefreshCw } from 'lucide-react';
import SectionLabel from './SectionLabel';
import PROFILE from '../data/profile.json';

export default function About() {
  const { lang } = useLang();

  const ICON_MAP = { Zap: <Zap size={20} className="text-brand-secondary" />, Bot: <Bot size={20} className="text-brand-secondary" />, Wrench: <Wrench size={20} className="text-brand-secondary" />, Rocket: <Rocket size={20} className="text-brand-secondary" />, Layers: <Layers size={20} className="text-brand-secondary" />, RefreshCw: <RefreshCw size={20} className="text-brand-secondary" /> };
  const traits = (PROFILE[lang].traits || []).map(t => ({ ...t, icon: ICON_MAP[t.icon] || <Zap size={20} className="text-brand-secondary" /> }));

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
  };

  return (
    <section id="about" className="bg-brand-dark/95 py-32 px-5">
      <div className="max-w-[1200px] mx-auto">
        <SectionLabel label={lang === 'es' ? "01 / SOBRE MÍ" : "01 / ABOUT"} />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start mt-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h2 className="text-[clamp(32px,4vw,52px)] font-extrabold text-white font-syne leading-[1.1] mb-7">
              {PROFILE[lang].aboutHeading[0]}<br /><span className="text-brand-secondary">{PROFILE[lang].aboutHeading[1]}</span> {PROFILE[lang].aboutHeading[2]}
            </h2>
            <p className="text-white/60 text-base leading-relaxed mb-5 font-sans">
              {PROFILE[lang].bio}
            </p>
            <p className="text-white/40 text-sm leading-loose font-mono border-l-2 border-brand-secondary/50 pl-5 mt-8">
              "{PROFILE[lang].philosophy}"
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-5"
          >
            {traits.map((t) => (
              <motion.div
                key={t.label}
                variants={itemVariants}
                className="bg-white/[0.02] border border-white/5 rounded-xl p-5 transition-all duration-300 hover:bg-brand-secondary/10 hover:border-brand-secondary/30 group"
              >
                <div className="mb-3 transition-transform duration-300 group-hover:scale-110 origin-left">{t.icon}</div>
                <div className="text-white font-bold text-sm font-syne mb-1">{t.label}</div>
                <div className="text-white/40 text-xs font-mono">{t.desc}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
