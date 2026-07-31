'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, LangContextType } from '@/types';

const LangContext = createContext<LangContextType | undefined>(undefined);

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>('es');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const savedLang = localStorage.getItem('portfolio_lang') as Language | null;
      if (savedLang === 'es' || savedLang === 'en') {
        setLangState(savedLang);
      } else if (typeof navigator !== 'undefined') {
        const browserLang = navigator.language.toLowerCase();
        if (browserLang.startsWith('es')) {
          setLangState('es');
        } else {
          setLangState('en');
        }
      }
    } catch {
      // Fallback silently if localStorage fails
    }
    setIsInitialized(true);
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    try {
      localStorage.setItem('portfolio_lang', newLang);
    } catch {
      // Ignore storage errors
    }
  };

  return (
    <LangContext.Provider value={{ lang, setLang }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang(): LangContextType {
  const context = useContext(LangContext);
  if (!context) {
    throw new Error('useLang must be used within a LangProvider');
  }
  return context;
}
