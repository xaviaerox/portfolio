'use client';
import { useLang } from '../contexts/LangContext';
import PROFILE from '../data/profile.json';

export default function Footer() {
  const { lang } = useLang();
  
  return (
    <footer className="bg-[#03030a] py-8 px-5 border-t border-white/5">
      <div className="max-w-[1200px] mx-auto flex justify-between items-center flex-wrap gap-4">
        <span className="font-mono text-xs text-white/20">
          © {new Date().getFullYear()} {PROFILE[lang].name} · {lang === 'es' ? 'Construido con' : 'Built with'} Next.js, Tailwind & Framer Motion
        </span>
        <span className="font-mono text-[11px] text-white/15">
          {lang === 'es' ? 'DISEÑADO Y CONSTRUIDO CON PRECISIÓN' : 'DESIGNED & BUILT WITH PRECISION'}
        </span>
      </div>
    </footer>
  );
}
