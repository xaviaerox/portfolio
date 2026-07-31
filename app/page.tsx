'use client';
import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import Lenis from 'lenis';
import { LangProvider } from '@/contexts/LangContext';

// Core Above-the-Fold Components (Synchronous)
import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import About from '@/components/About';
import TechStack from '@/components/TechStack';
import Experience from '@/components/Experience';
import Projects from '@/components/Projects';
import Skills from '@/components/Skills';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import CommandPalette from '@/components/CommandPalette';
import ErrorBoundary from '@/components/ErrorBoundary';

// Dynamic Below-the-Fold Heavy Components (Code-Splitting)
const CertificationTree = dynamic(() => import('@/components/CertificationTree'), {
  ssr: false,
  loading: () => <SectionSkeleton title="Certification Tree" />,
});

const KnowledgeGraph = dynamic(() => import('@/components/KnowledgeGraph'), {
  ssr: false,
  loading: () => <SectionSkeleton title="Knowledge Graph" />,
});

const TechTimeline = dynamic(() => import('@/components/TechTimeline'), {
  ssr: false,
  loading: () => <SectionSkeleton title="Tech Timeline" />,
});

const ProofOfWork = dynamic(() => import('@/components/ProofOfWork'), {
  ssr: false,
  loading: () => <SectionSkeleton title="Proof of Work" />,
});

const BuilderDashboard = dynamic(() => import('@/components/BuilderDashboard'), {
  ssr: false,
  loading: () => <SectionSkeleton title="Builder Dashboard" />,
});

const NarrativeMode = dynamic(() => import('@/components/NarrativeMode'), {
  ssr: false,
});

function SectionSkeleton({ title }: { title: string }) {
  return (
    <div className="w-full py-20 px-6 max-w-[1200px] mx-auto text-center font-mono animate-pulse">
      <div className="h-6 w-48 bg-white/10 mx-auto rounded mb-4" />
      <div className="h-4 w-72 bg-white/5 mx-auto rounded" />
      <span className="sr-only">Loading {title}...</span>
    </div>
  );
}

export default function Portfolio() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    const animId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(animId);
      lenis.destroy();
    };
  }, []);

  return (
    <LangProvider>
      <Nav />
      <main id="main-content">
        <ErrorBoundary fallbackTitle="Hero Section Error">
          <Hero />
        </ErrorBoundary>

        <ErrorBoundary fallbackTitle="About Section Error">
          <About />
        </ErrorBoundary>

        <ErrorBoundary fallbackTitle="Tech Stack Section Error">
          <TechStack />
        </ErrorBoundary>

        <ErrorBoundary fallbackTitle="Experience Section Error">
          <Experience />
        </ErrorBoundary>

        <ErrorBoundary fallbackTitle="Certification Tree Error">
          <CertificationTree />
        </ErrorBoundary>

        <ErrorBoundary fallbackTitle="Knowledge Graph Error">
          <KnowledgeGraph />
        </ErrorBoundary>

        <ErrorBoundary fallbackTitle="Projects Section Error">
          <Projects />
        </ErrorBoundary>

        <ErrorBoundary fallbackTitle="Skills Section Error">
          <Skills />
        </ErrorBoundary>

        <ErrorBoundary fallbackTitle="Proof of Work Error">
          <ProofOfWork />
        </ErrorBoundary>

        <ErrorBoundary fallbackTitle="Tech Timeline Error">
          <TechTimeline />
        </ErrorBoundary>

        <ErrorBoundary fallbackTitle="Builder Dashboard Error">
          <BuilderDashboard />
        </ErrorBoundary>

        <ErrorBoundary fallbackTitle="Contact Section Error">
          <Contact />
        </ErrorBoundary>
      </main>
      <Footer />
      <CommandPalette />
      <NarrativeMode />
    </LangProvider>
  );
}
