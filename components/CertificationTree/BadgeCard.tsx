'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Award, ExternalLink } from 'lucide-react';
import { CertificationBadge, Language } from '@/types';

interface BadgeCardProps {
  cert: CertificationBadge;
  providerName: string;
  providerColor: string;
  lang: Language;
  onClick: () => void;
}

export default function BadgeCard({ cert, providerName, providerColor, lang, onClick }: BadgeCardProps) {
  const title = (lang === 'es' ? (cert as any).name_es : (cert as any).name_en) || cert.name;
  const skills = (lang === 'es' ? (cert as any).skills_es : (cert as any).skills_en) || cert.skills || [];

  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.01 }}
      onClick={onClick}
      className="bg-white/[0.02] border border-white/10 hover:border-brand-secondary/40 rounded-xl p-4 cursor-pointer transition-all hover:bg-white/[0.04] group relative overflow-hidden"
    >
      <div
        className="absolute top-0 left-0 w-1 h-full rounded-l"
        style={{ backgroundColor: providerColor }}
      />
      <div className="flex items-start justify-between gap-3 mb-2 pl-2">
        <div>
          <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest block">
            {providerName} • {cert.year}
          </span>
          <h4 className="text-sm font-bold text-white group-hover:text-brand-secondary transition-colors font-syne mt-0.5">
            {title}
          </h4>
        </div>
        <div className="p-1.5 rounded bg-white/5 text-white/40 group-hover:text-white transition-colors">
          <Award size={16} />
        </div>
      </div>

      {skills.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-3 pl-2">
          {skills.slice(0, 3).map((s: string, i: number) => (
            <span key={i} className="text-[10px] font-mono bg-white/5 text-white/60 px-2 py-0.5 rounded">
              {s}
            </span>
          ))}
          {skills.length > 3 && (
            <span className="text-[10px] font-mono text-white/30 px-1 py-0.5">
              +{skills.length - 3}
            </span>
          )}
        </div>
      )}
    </motion.div>
  );
}
