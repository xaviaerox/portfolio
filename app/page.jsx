'use client';
import { useEffect } from 'react';
import Lenis from 'lenis';
import { LangProvider } from '../contexts/LangContext';

// Components
import Nav from '../components/Nav';
import Hero from '../components/Hero';
import About from '../components/About';
import TechStack from '../components/TechStack';
import Experience from '../components/Experience';
import Certifications from '../components/Certifications';
import Projects from '../components/Projects';
import Skills from '../components/Skills';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

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
      <Certifications />
      <Projects />
      <Skills />
      <Contact />
      <Footer />
    </LangProvider>
  );
}
