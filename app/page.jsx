'use client';
import { useEffect } from 'react';
import Lenis from 'lenis';
import { LangProvider } from '../contexts/LangContext';

// Original Components
import Nav from '../components/Nav';
import Hero from '../components/Hero';
import About from '../components/About';
import TechStack from '../components/TechStack';
import Experience from '../components/Experience';
import Projects from '../components/Projects';
import Skills from '../components/Skills';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

// V2 Evolution Components
import CertificationTree from '../components/CertificationTree';
import KnowledgeGraph from '../components/KnowledgeGraph';
import TechTimeline from '../components/TechTimeline';
import ProofOfWork from '../components/ProofOfWork';
import BuilderDashboard from '../components/BuilderDashboard';
import NarrativeMode from '../components/NarrativeMode';

export default function Portfolio() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <LangProvider>
      <Nav />
      <Hero />
      <About />
      <TechStack />
      <Experience />
      <CertificationTree />
      <KnowledgeGraph />
      <Projects />
      <Skills />
      <ProofOfWork />
      <TechTimeline />
      <BuilderDashboard />
      <Contact />
      <Footer />
      <NarrativeMode />
    </LangProvider>
  );
}
