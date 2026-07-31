'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { X, ExternalLink, Award, Calendar, Tag } from 'lucide-react';
import { CertificationBadge, Language } from '@/types';

interface BadgeModalProps {
  cert: CertificationBadge & { providerName?: string; providerColor?: string };
  lang: Language;
  onClose: () => void;
}

export default function BadgeModal({ cert, lang, onClose }: BadgeModalProps) {
  const title = (lang === 'es' ? (cert as any).name_es : (cert as any).name_en) || cert.name;
  const skills = (lang === 'es' ? (cert as any).skills_es : (cert as any).skills_en) || cert.skills || [];

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-brand-dark/85 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 10 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-lg bg-[#090a1a] border border-white/15 rounded-2xl p-6 shadow-2xl relative font-mono text-white"
      >
        <button
          onClick={onClose}
          aria-label="Cerrar modal"
          className="absolute top-4 right-4 text-white/40 hover:text-white p-1 rounded-md hover:bg-white/10 transition-all"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold"
            style={{ backgroundColor: `${cert.providerColor || '#6366f1'}20`, color: cert.providerColor || '#6366f1' }}
          >
            <Award size={22} />
          </div>
          <div>
            <span className="text-xs text-white/50 uppercase tracking-widest">{cert.providerName}</span>
            <h3 className="text-lg font-bold text-white font-syne leading-tight">{title}</h3>
          </div>
        </div>

        <div className="space-y-4 my-6 text-xs text-white/70">
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-brand-secondary" />
            <span>{lang === 'es' ? `Año de emisión: ${cert.year}` : `Issued Year: ${cert.year}`}</span>
          </div>

          {skills.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2 text-white/50">
                <Tag size={14} />
                <span>{lang === 'es' ? 'Competencias verificadas:' : 'Verified Skills:'}</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {skills.map((s: string, idx: number) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 bg-white/5 border border-white/10 rounded text-[11px] text-white/80"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {cert.url && (
          <a
            href={cert.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full mt-2 inline-flex items-center justify-center gap-2 bg-brand-secondary/15 hover:bg-brand-secondary/25 border border-brand-secondary/40 text-brand-secondary py-2.5 rounded-lg text-xs font-mono font-bold transition-all"
          >
            <span>{lang === 'es' ? 'VERIFICAR CREDENCIAL' : 'VERIFY CREDENTIAL'}</span>
            <ExternalLink size={14} />
          </a>
        )}
      </motion.div>
    </div>
  );
}
