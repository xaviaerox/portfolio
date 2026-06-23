'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLang } from '../contexts/LangContext';
import { Mail } from 'lucide-react';
import SectionLabel from './SectionLabel';
import PROFILE from '../data/profile.json';

export default function Contact() {
  const { lang } = useLang();
  const [copied, setCopied] = useState(false);

  const copyEmail = () => {
    navigator.clipboard.writeText(PROFILE[lang].email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="contact" className="bg-brand-dark py-32 px-5 relative overflow-hidden">
      {/* Background Glow */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none opacity-50"
        style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)' }}
      />

      <motion.div 
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.7 }}
        className="max-w-[800px] mx-auto text-center relative z-10"
      >
        <SectionLabel label={lang === 'es' ? "07 / CONTACTO" : "07 / CONTACT"} center />
        
        <h2 className="text-[clamp(36px,6vw,72px)] font-extrabold text-white font-syne leading-[1.05] mt-6 mb-5">
          {PROFILE[lang].contactHeading[0]}<br /><span className="text-brand-accent">{PROFILE[lang].contactHeading[1]}</span> {PROFILE[lang].contactHeading[2]}
        </h2>
        
        <p className="text-white/45 text-base leading-relaxed max-w-[480px] mx-auto mb-12 font-sans">
          {PROFILE[lang].contactSubtext}
        </p>

        {/* Email */}
        <div 
          onClick={copyEmail}
          className="inline-flex items-center gap-4 bg-white/[0.03] border border-white/10 rounded-xl px-6 py-4 mb-10 cursor-pointer transition-all duration-300 hover:border-brand-accent/50 hover:bg-brand-accent/10 group"
        >
          <Mail className="text-brand-accent w-5 h-5" />
          <span className="text-white font-mono text-sm">{PROFILE[lang].email}</span>
          <span className="text-white/30 text-xs font-mono group-hover:text-white/60 transition-colors">
            {copied ? (lang === 'es' ? "¡COPIADO!" : "COPIED!") : (lang === 'es' ? "CLIC PARA COPIAR" : "CLICK TO COPY")}
          </span>
        </div>

        {/* Social links */}
        <div className="flex gap-4 justify-center">
          {[
            { name: "GitHub", url: PROFILE[lang].github, color: "#fff" }, 
            { name: "LinkedIn", url: PROFILE[lang].linkedin, color: "#0A66C2" }
          ].map((social) => (
            <a 
              key={social.name} 
              href={social.url} 
              target="_blank" 
              rel="noreferrer"
              className="bg-white/[0.03] border border-white/10 text-white/60 px-7 py-3 rounded-lg no-underline font-mono text-[13px] tracking-widest transition-all duration-200"
              style={{
                '--hover-color': social.color,
                '--hover-bg': `${social.color}11`,
                '--hover-border': `${social.color}66`
              }}
              onMouseEnter={e => {
                e.target.style.color = 'var(--hover-color)';
                e.target.style.borderColor = 'var(--hover-border)';
                e.target.style.backgroundColor = 'var(--hover-bg)';
              }}
              onMouseLeave={e => {
                e.target.style.color = '';
                e.target.style.borderColor = '';
                e.target.style.backgroundColor = '';
              }}
            >
              {social.name} ↗
            </a>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
