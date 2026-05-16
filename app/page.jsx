'use client';

// PREMIUM PORTFOLIO - Full React Implementation
// Stack: React + Tailwind-like inline styles + CSS animations
// Ready to migrate to Next.js + Framer Motion

import { useState, useEffect, useRef, useCallback, createContext, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Lenis from "lenis";
import { Mail, Github, Linkedin, ExternalLink, ArrowRight, Menu, X, Check, Globe } from "lucide-react";

const LangContext = createContext();

// ============================================================
// DATA LAYER
// ============================================================

import PROFILE from "../data/profile.json";
import SKILLS from "../data/skills.json";
import EXPERIENCE from "../data/experience.json";
import CERTIFICATIONS from "../data/certifications.json";
import PROJECTS from "../data/projects.json";

// ============================================================
// HOOKS
// ============================================================

function useScrollY() {
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const handler = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);
  return scrollY;
}

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

function useTypewriter(text, speed = 50, delay = 0) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    let i = 0;
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setDisplayed(text.slice(0, i + 1));
        i++;
        if (i >= text.length) { clearInterval(interval); setDone(true); }
      }, speed);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timer);
  }, [text, speed, delay]);
  return [displayed, done];
}

// ============================================================
// PARTICLE SYSTEM
// ============================================================

function ParticleField({ count = 60 }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animId;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.5 + 0.5,
      alpha: Math.random() * 0.5 + 0.1,
    }));
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(249,115,22,${p.alpha})`;
        ctx.fill();
      });
      // Draw connections
      particles.forEach((a, i) => {
        particles.slice(i + 1).forEach(b => {
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(249,115,22,${0.08 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, [count]);
  return (
    <canvas
      ref={canvasRef}
      style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0 }}
    />
  );
}

// ============================================================
// NAV
// ============================================================

function Nav({ scrollY }) {
  const { lang, setLang } = useContext(LangContext);
  const [open, setOpen] = useState(false);
  const scrolled = scrollY > 60;
  
  const links = lang === 'es'
    ? [
        { label: "Sobre mí", id: "about" },
        { label: "Tecnologías", id: "stack" },
        { label: "Experiencia", id: "experience" },
        { label: "Certificaciones", id: "certifications" },
        { label: "Proyectos", id: "projects" },
        { label: "Contacto", id: "contact" }
      ]
    : [
        { label: "About", id: "about" },
        { label: "Stack", id: "stack" },
        { label: "Experience", id: "experience" },
        { label: "Certifications", id: "certifications" },
        { label: "Projects", id: "projects" },
        { label: "Contact", id: "contact" }
      ];

  const scrollTo = (id) => {
    document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: "smooth" });
    setOpen(false);
  };

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      transition: "all 0.4s ease",
      background: scrolled ? "rgba(5,5,15,0.85)" : "transparent",
      backdropFilter: scrolled ? "blur(20px)" : "none",
      borderBottom: scrolled ? "1px solid rgba(249,115,22,0.15)" : "none",
      padding: "0 5%",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 68 }}>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 16, fontWeight: 700, color: "#f97316", letterSpacing: 2 }}>
          XA<span style={{ color: "rgba(249,115,22,0.4)" }}>_</span>
        </span>
        <div className="nav-links" style={{ display: "flex", gap: 36 }}>
          {links.map(l => (
            <button key={l.id} onClick={() => scrollTo(l.id)}
              style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.55)", fontSize: 13, fontFamily: "'Space Mono', monospace", letterSpacing: 1, transition: "color 0.2s", padding: "4px 0" }}
              onMouseEnter={e => e.target.style.color = "#fff"}
              onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.55)"}
            >{l.label}</button>
          ))}
        </div>
        
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          {/* Language Switcher */}
          <div style={{ display: "flex", gap: 8, fontFamily: "'Space Mono', monospace", fontSize: 13 }}>
            <button 
              onClick={() => setLang('es')}
              style={{ background: "none", border: "none", cursor: "pointer", color: lang === 'es' ? "#f97316" : "rgba(255,255,255,0.3)", fontWeight: lang === 'es' ? 700 : 400, transition: "color 0.2s" }}
              onMouseEnter={e => { if (lang !== 'es') e.target.style.color = "rgba(255,255,255,0.7)"; }}
              onMouseLeave={e => { if (lang !== 'es') e.target.style.color = "rgba(255,255,255,0.3)"; }}
            >ES</button>
            <span style={{ color: "rgba(255,255,255,0.15)" }}>/</span>
            <button 
              onClick={() => setLang('en')}
              style={{ background: "none", border: "none", cursor: "pointer", color: lang === 'en' ? "#f97316" : "rgba(255,255,255,0.3)", fontWeight: lang === 'en' ? 700 : 400, transition: "color 0.2s" }}
              onMouseEnter={e => { if (lang !== 'en') e.target.style.color = "rgba(255,255,255,0.7)"; }}
              onMouseLeave={e => { if (lang !== 'en') e.target.style.color = "rgba(255,255,255,0.3)"; }}
            >EN</button>
          </div>

          {/* Hire Me Button */}
          <button
            className="desktop-only"
            onClick={() => scrollTo("Contact")}
            style={{
              background: "transparent", border: "1px solid rgba(249,115,22,0.5)", color: "#f97316",
              padding: "8px 20px", borderRadius: 6, cursor: "pointer", fontSize: 12,
              fontFamily: "'Space Mono', monospace", letterSpacing: 1, transition: "all 0.2s",
            }}
            onMouseEnter={e => { e.target.style.background = "rgba(249,115,22,0.15)"; e.target.style.borderColor = "#f97316"; }}
            onMouseLeave={e => { e.target.style.background = "transparent"; e.target.style.borderColor = "rgba(249,115,22,0.5)"; }}
          >
            {lang === 'es' ? 'CONTRÁTAME' : 'HIRE ME'}
          </button>

          {/* Hamburger Button */}
          <button className="mobile-only" onClick={() => setOpen(!open)}
            style={{ background: "none", border: "none", cursor: "pointer", color: "#fff", fontSize: 24, padding: "4px" }}
          >
            {open ? "✕" : "☰"}
          </button>
        </div>
      </div>
      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="mobile-only"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: "fixed", top: 68, left: 0, right: 0, bottom: 0,
              background: "rgba(5,5,15,0.95)", backdropFilter: "blur(20px)",
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              gap: 32, zIndex: 99,
            }}
          >
            {links.map(l => (
              <button key={l.id} onClick={() => scrollTo(l.id)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#fff", fontSize: 18, fontFamily: "'Space Mono', monospace" }}
              >{l.label}</button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

// ============================================================
// HERO
// ============================================================

function Hero() {
  const { lang } = useContext(LangContext);
  const [mounted, setMounted] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [tagline] = useTypewriter(PROFILE[lang].tagline, 45, 1200);

  useEffect(() => { setTimeout(() => setMounted(true), 100); }, []);

  const handleMouseMove = (e) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  return (
    <section id="hero" onMouseMove={handleMouseMove} style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", overflow: "hidden", background: "#0c0a09" }}>
      <ParticleField count={70} />

      {/* Ambient glow */}
      <div style={{ 
        position: "absolute", top: "20%", left: "50%", 
        transform: `translate(calc(-50% + ${(mousePos.x - 500) * 0.05}px), ${(mousePos.y - 300) * 0.05}px)`, 
        width: 600, height: 600, borderRadius: "50%", 
        background: "radial-gradient(circle, rgba(249,115,22,0.08) 0%, transparent 70%)", 
        pointerEvents: "none", transition: "transform 0.1s ease" 
      }} />
      <div style={{ 
        position: "absolute", bottom: "10%", right: "15%", 
        transform: `translate(${(mousePos.x - 500) * 0.03}px, ${(mousePos.y - 300) * 0.03}px)`, 
        width: 300, height: 300, borderRadius: "50%", 
        background: "radial-gradient(circle, rgba(6,182,212,0.06) 0%, transparent 70%)", 
        pointerEvents: "none", transition: "transform 0.1s ease" 
      }} />

      {/* Grid overlay */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(249,115,22,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(249,115,22,0.03) 1px, transparent 1px)", backgroundSize: "80px 80px", pointerEvents: "none" }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 1200, margin: "0 auto", padding: "0 5%", width: "100%" }}>
        {/* Status pill */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 32,
          background: "rgba(249,115,22,0.08)", border: "1px solid rgba(249,115,22,0.25)",
          borderRadius: 100, padding: "6px 16px",
          opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(12px)",
          transition: "all 0.6s ease 0.1s",
        }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#10b981", boxShadow: "0 0 8px #10b981", display: "inline-block" }} />
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "rgba(255,255,255,0.6)", letterSpacing: 1 }}>{lang === 'es' ? 'DISPONIBLE PARA OPORTUNIDADES' : 'AVAILABLE FOR OPPORTUNITIES'}</span>
        </div>

        {/* Name and Photo */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 40,
          marginBottom: 8,
          flexWrap: "wrap",
          opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(24px)",
          transition: "all 0.7s ease 0.25s",
        }}>
          <h1 style={{
            fontSize: "clamp(52px, 8vw, 96px)", fontWeight: 800, lineHeight: 1.05, letterSpacing: -2,
            color: "#fff", fontFamily: "'Syne', sans-serif",
          }}>
            {PROFILE[lang].name.split(" ").map((w, i) => (
              <span key={i} style={{ display: "block" }}>
                {i === 1 ? <span style={{ WebkitTextStroke: "1px rgba(249,115,22,0.7)", WebkitTextFillColor: "transparent", color: "transparent" }}>{w}</span> : w}
              </span>
            ))}
          </h1>
          <div style={{
            width: "clamp(150px, 20vw, 250px)",
            height: "clamp(150px, 20vw, 250px)",
            borderRadius: "50%",
            overflow: "hidden",
            border: "2px solid rgba(249,115,22,0.5)",
            boxShadow: "0 0 40px rgba(249,115,22,0.3)",
            flexShrink: 0,
          }}>
            <img src="xavi-alonso.jpg" alt="Xavi Alonso" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        </div>

        {/* Role */}
        <div style={{
          fontSize: "clamp(14px, 2vw, 18px)", color: "#f97316", fontFamily: "'Space Mono', monospace",
          letterSpacing: 3, marginBottom: 24, textTransform: "uppercase",
          opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(20px)",
          transition: "all 0.7s ease 0.4s",
        }}>
          {PROFILE[lang].role}
        </div>

        {/* Tagline */}
        <p style={{
          fontSize: "clamp(18px, 2.5vw, 26px)", color: "rgba(255,255,255,0.65)", maxWidth: 580,
          fontFamily: "'Syne', sans-serif", fontWeight: 400, lineHeight: 1.5, marginBottom: 48,
          opacity: mounted ? 1 : 0, transition: "opacity 0.6s ease 0.6s",
          minHeight: "1.5em",
        }}>
          {tagline}<span style={{ opacity: 0.6, animation: "blink 1s infinite" }}>|</span>
        </p>

        {/* CTAs */}
        <div style={{
          display: "flex", gap: 16, flexWrap: "wrap",
          opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(20px)",
          transition: "all 0.7s ease 0.9s",
        }}>
          <button
            onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
            style={{
              background: "#f97316", color: "#fff", border: "none", padding: "14px 32px",
              borderRadius: 8, cursor: "pointer", fontSize: 14, fontFamily: "'Space Mono', monospace",
              letterSpacing: 1, transition: "all 0.2s", boxShadow: "0 0 40px rgba(249,115,22,0.3)",
            }}
            onMouseEnter={e => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 8px 50px rgba(249,115,22,0.5)"; }}
            onMouseLeave={e => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "0 0 40px rgba(249,115,22,0.3)"; }}
          >{lang === 'es' ? 'VER PROYECTOS →' : 'VIEW PROJECTS →'}</button>
          <button
            onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
            style={{
              background: "transparent", color: "rgba(255,255,255,0.75)", border: "1px solid rgba(255,255,255,0.15)",
              padding: "14px 32px", borderRadius: 8, cursor: "pointer", fontSize: 14,
              fontFamily: "'Space Mono', monospace", letterSpacing: 1, transition: "all 0.2s",
            }}
            onMouseEnter={e => { e.target.style.borderColor = "rgba(255,255,255,0.4)"; e.target.style.color = "#fff"; }}
            onMouseLeave={e => { e.target.style.borderColor = "rgba(255,255,255,0.15)"; e.target.style.color = "rgba(255,255,255,0.75)"; }}
          >{lang === 'es' ? 'CONTACTAR' : 'GET IN TOUCH'}</button>
        </div>

        {/* Stats row */}
        <div style={{
          display: "flex", gap: 48, marginTop: 80, paddingTop: 48,
          justifyContent: "center",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          opacity: mounted ? 1 : 0, transition: "opacity 0.8s ease 1.1s",
        }}>
          {(lang === 'es' 
            ? [["12+", "Años Exp."], ["3+", "Casos Éxito"], ["6+", "Certificados"], ["100%", "Disponibilidad"]]
            : [["12+", "Years Exp."], ["3+", "Success Cases"], ["6+", "Certifications"], ["100%", "Availability"]]
          ).map(([n, l]) => (
            <div key={l} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 32, fontWeight: 800, color: "#fff", fontFamily: "'Syne', sans-serif", lineHeight: 1 }}>{n}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", fontFamily: "'Space Mono', monospace", letterSpacing: 1, marginTop: 6 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{ position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, opacity: 0.4 }}>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: "#fff", letterSpacing: 2 }}>SCROLL</span>
        <div style={{ width: 1, height: 40, background: "linear-gradient(to bottom, rgba(255,255,255,0.5), transparent)", animation: "scrollPulse 2s infinite" }} />
      </div>
    </section>
  );
}

// ============================================================
// ABOUT
// ============================================================

function About() {
  const { lang } = useContext(LangContext);
  const [ref, inView] = useInView(0.1);
  const traits = lang === 'es'
    ? [
        { icon: "⚡", label: "Pensador Sistémico", desc: "Ver la arquitectura de forma holística" },
        { icon: "🤖", label: "Ingeniero de IA", desc: "LLMs, RAG, pipelines de IA" },
        { icon: "🔬", label: "Solucionador de Problemas", desc: "Depurar cualquier cosa, en cualquier lugar" },
        { icon: "🚀", label: "Aprendizaje Rápido", desc: "Nueva tecnología en días, no semanas" },
        { icon: "🏗️", label: "Arquitecto", desc: "Sistemas escalables y limpios" },
        { icon: "🔄", label: "Automatizador", desc: "Eliminar la repetición a escala" },
      ]
    : [
        { icon: "⚡", label: "Systems Thinker", desc: "See architecture holistically" },
        { icon: "🤖", label: "AI Engineer", desc: "LLMs, RAG, AI pipelines" },
        { icon: "🔬", label: "Problem Solver", desc: "Debug anything, anywhere" },
        { icon: "🚀", label: "Fast Learner", desc: "New tech in days, not weeks" },
        { icon: "🏗️", label: "Architect", desc: "Scalable, clean systems" },
        { icon: "🔄", label: "Automator", desc: "Eliminate repetition at scale" },
      ];

  return (
    <section id="about" style={{ background: "#0c0a09", padding: "120px 5%" }}>
      <div ref={ref} style={{ maxWidth: 1200, margin: "0 auto" }}>
        <SectionLabel label={lang === 'es' ? "01 / SOBRE MÍ" : "01 / ABOUT"} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "start", marginTop: 60 }}>
          <div style={{ opacity: inView ? 1 : 0, transform: inView ? "translateX(0)" : "translateX(-30px)", transition: "all 0.8s ease" }}>
            <h2 style={{ fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 800, color: "#fff", fontFamily: "'Syne', sans-serif", lineHeight: 1.1, marginBottom: 28 }}>
              {lang === 'es' ? (
                <>Ingeniero por lógica,<br /><span style={{ color: "#f97316" }}>creador</span> por pasión.</>
              ) : (
                <>Engineer by logic,<br /><span style={{ color: "#f97316" }}>creator</span> by passion.</>
              )}
            </h2>
            <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 16, lineHeight: 1.9, marginBottom: 20, fontFamily: "system-ui" }}>{PROFILE[lang].bio}</p>
            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 14, lineHeight: 1.8, fontFamily: "'Space Mono', monospace", borderLeft: "2px solid rgba(249,115,22,0.5)", paddingLeft: 20, marginTop: 32 }}>
              "{PROFILE[lang].philosophy}"
            </p>
          </div>
          <div style={{ opacity: inView ? 1 : 0, transform: inView ? "translateX(0)" : "translateX(30px)", transition: "all 0.8s ease 0.2s" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 30 }}>
              {traits.map((t, i) => (
                <div key={t.label}
                  style={{
                    background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: 12, padding: "20px", transition: "all 0.3s",
                    opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(20px)",
                    transitionDelay: `${0.3 + i * 0.07}s`,
                    cursor: "default",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(249,115,22,0.08)"; e.currentTarget.style.borderColor = "rgba(249,115,22,0.3)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.02)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; }}
                >
                  <div style={{ fontSize: 24, marginBottom: 10 }}>{t.icon}</div>
                  <div style={{ color: "#fff", fontWeight: 700, fontSize: 14, fontFamily: "'Syne', sans-serif", marginBottom: 4 }}>{t.label}</div>
                  <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, fontFamily: "'Space Mono', monospace" }}>{t.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// TECH STACK
// ============================================================

function TechStack() {
  const { lang } = useContext(LangContext);
  const TECH_STACK = SKILLS[lang].tech_stack;
  const [ref, inView] = useInView(0.05);
  const [filter, setFilter] = useState(lang === 'es' ? "Todas" : "All");
  const categories = [lang === 'es' ? "Todas" : "All", ...new Set(TECH_STACK.map(t => t.cat))];
  const filtered = filter === (lang === 'es' ? "Todas" : "All") ? TECH_STACK : TECH_STACK.filter(t => t.cat === filter);

  return (
    <section id="stack" style={{ background: "#1c1917", padding: "120px 5%" }}>
      <div ref={ref} style={{ maxWidth: 1200, margin: "0 auto" }}>
        <SectionLabel label={lang === 'es' ? "02 / TECNOLOGÍAS" : "02 / TECH STACK"} />
        <h2 style={{ fontSize: "clamp(28px, 3.5vw, 48px)", fontWeight: 800, color: "#fff", fontFamily: "'Syne', sans-serif", marginTop: 16, marginBottom: 16 }}>
          {lang === 'es' ? "Tecnologías que domino" : "Technologies I master"}
        </h2>

        {/* Filter pills */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 48, marginTop: 32 }}>
          {categories.map(c => (
            <button key={c} onClick={() => setFilter(c)} style={{
              background: filter === c ? "rgba(249,115,22,0.2)" : "transparent",
              border: `1px solid ${filter === c ? "#f97316" : "rgba(255,255,255,0.1)"}`,
              color: filter === c ? "#f97316" : "rgba(255,255,255,0.45)",
              padding: "6px 16px", borderRadius: 100, cursor: "pointer", fontSize: 11,
              fontFamily: "'Space Mono', monospace", letterSpacing: 1, transition: "all 0.2s",
            }}>{c.toUpperCase()}</button>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
          {filtered.map((tech, i) => (
            <div key={tech.name}
              style={{
                background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 12, padding: "20px 20px 16px",
                opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(20px)",
                transition: `all 0.5s ease ${i * 0.04}s`,
                cursor: "default", position: "relative", overflow: "hidden",
              }}
              onMouseEnter={e => { 
                e.currentTarget.style.borderColor = tech.color + "44"; 
                e.currentTarget.style.background = tech.color + "11"; 
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow = `0 10px 20px -10px ${tech.color}33`;
              }}
              onMouseLeave={e => { 
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; 
                e.currentTarget.style.background = "rgba(255,255,255,0.02)"; 
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: "#fff", fontFamily: "'Syne', sans-serif" }}>{tech.name}</span>
                <span style={{ fontSize: 10, color: tech.color, fontFamily: "'Space Mono', monospace", background: tech.color + "22", padding: "2px 8px", borderRadius: 4 }}>{tech.cat}</span>
              </div>
              <div style={{ height: 3, background: "rgba(255,255,255,0.06)", borderRadius: 2, overflow: "hidden" }}>
                <div style={{
                  height: "100%", width: inView ? `${tech.level}%` : "0%",
                  background: tech.color, borderRadius: 2, transition: `width 1s ease ${0.3 + i * 0.04}s`,
                  boxShadow: `0 0 8px ${tech.color}66`,
                }} />
              </div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", fontFamily: "'Space Mono', monospace", marginTop: 6, textAlign: "right" }}>{tech.level}%</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// EXPERIENCE
// ============================================================

function Experience() {
  const { lang } = useContext(LangContext);
  const [ref, inView] = useInView(0.05);
  const [expanded, setExpanded] = useState(null);

  return (
    <section id="experience" style={{ background: "#0c0a09", padding: "120px 5%" }}>
      <div ref={ref} style={{ maxWidth: 1200, margin: "0 auto" }}>
        <SectionLabel label={lang === 'es' ? "03 / EXPERIENCIA" : "03 / EXPERIENCE"} />
        <h2 style={{ fontSize: "clamp(28px, 3.5vw, 48px)", fontWeight: 800, color: "#fff", fontFamily: "'Syne', sans-serif", marginTop: 16, marginBottom: 60 }}>
          {lang === 'es' ? "Evolución profesional" : "Career evolution"}
        </h2>

        <div style={{ position: "relative" }}>
          {/* Timeline line */}
          <div style={{
            position: "absolute", left: 24, top: 0, bottom: 0, width: 1,
            background: "linear-gradient(to bottom, transparent, rgba(249,115,22,0.4) 10%, rgba(249,115,22,0.4) 90%, transparent)",
          }} />

          {EXPERIENCE.map((exp, i) => (
            <div key={exp.id}
              style={{
                paddingLeft: 72, marginBottom: 32, position: "relative",
                opacity: inView ? 1 : 0, transform: inView ? "translateX(0)" : "translateX(-20px)",
                transition: `all 0.6s ease ${i * 0.12}s`,
              }}
            >
              {/* Node */}
              <div style={{
                position: "absolute", left: 12, top: 24, width: 26, height: 26,
                borderRadius: "50%", background: exp.color, border: "3px solid #0c0a09",
                boxShadow: `0 0 20px ${exp.color}66`,
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", transition: "transform 0.2s",
                zIndex: 2,
              }}
                onClick={() => setExpanded(expanded === exp.id ? null : exp.id)}
                onMouseEnter={e => e.currentTarget.style.transform = "scale(1.2)"}
                onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
              >
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#fff" }} />
              </div>

              {/* Card */}
              <div style={{
                background: "rgba(255,255,255,0.02)", border: `1px solid ${expanded === exp.id ? exp.color + "44" : "rgba(255,255,255,0.06)"}`,
                borderRadius: 16, overflow: "hidden", cursor: "pointer",
                transition: "border-color 0.3s",
              }}
                onClick={() => setExpanded(expanded === exp.id ? null : exp.id)}
              >
                <div style={{ padding: "24px 28px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
                    <div>
                      <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: exp.color, letterSpacing: 2, marginBottom: 6 }}>{exp.period}</div>
                      <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 20, color: "#fff", marginBottom: 2 }}>{exp[`role_${lang}`]}</div>
                      <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, fontFamily: "'Space Mono', monospace" }}>{exp.company} · {exp.location}</div>
                    </div>
                    <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 18, transition: "transform 0.3s", transform: expanded === exp.id ? "rotate(180deg)" : "rotate(0)" }}>▼</div>
                  </div>
                </div>

                {expanded === exp.id && (
                  <div style={{ padding: "0 28px 28px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                    <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 14, lineHeight: 1.8, marginTop: 20, marginBottom: 20, fontFamily: "system-ui" }}>{exp[`description_${lang}`]}</p>

                    {/* Stack */}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 20 }}>
                      {exp.stack.map(s => (
                        <span key={s} style={{ background: exp.color + "18", border: `1px solid ${exp.color}33`, color: exp.color, padding: "3px 10px", borderRadius: 4, fontSize: 11, fontFamily: "'Space Mono', monospace" }}>{s}</span>
                      ))}
                    </div>

                    {/* Achievements */}
                    <div>
                      {exp[`achievements_${lang}`].map(a => (
                        <div key={a} style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 10 }}>
                          <span style={{ color: exp.color, fontSize: 12, marginTop: 2, flexShrink: 0 }}>◆</span>
                          <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, lineHeight: 1.6, fontFamily: "system-ui" }}>{a}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// CERTIFICATIONS
// ============================================================

function Certifications() {
  const { lang } = useContext(LangContext);
  const [ref, inView] = useInView(0.05);
  const [expanded, setExpanded] = useState(null);

  return (
    <section id="certifications" style={{ background: "#1c1917", padding: "120px 5%" }}>
      <div ref={ref} style={{ maxWidth: 1200, margin: "0 auto" }}>
        <SectionLabel label={lang === 'es' ? "04 / CERTIFICACIONES" : "04 / CERTIFICATIONS"} />
        <h2 style={{ fontSize: "clamp(28px, 3.5vw, 48px)", fontWeight: 800, color: "#fff", fontFamily: "'Syne', sans-serif", marginTop: 16, marginBottom: 16 }}>
          {lang === 'es' ? "Grafo de conocimiento" : "Knowledge graph"}
        </h2>
        <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 14, fontFamily: "'Space Mono', monospace", marginBottom: 60 }}>
          {lang === 'es' 
            ? `${CERTIFICATIONS.reduce((a, c) => a + c.items.length, 0)} certificaciones en ${CERTIFICATIONS.length} proveedores`
            : `${CERTIFICATIONS.reduce((a, c) => a + c.items.length, 0)} certifications across ${CERTIFICATIONS.length} providers`
          }
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
          {CERTIFICATIONS.map((cert, i) => (
            <div key={cert.id}
              style={{
                opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(24px)",
                transition: `all 0.6s ease ${i * 0.1}s`,
              }}
            >
              <div
                style={{
                  background: "rgba(255,255,255,0.02)", border: `1px solid ${expanded === cert.id ? cert.color + "55" : "rgba(255,255,255,0.07)"}`,
                  borderRadius: 16, overflow: "hidden", cursor: "pointer", transition: "all 0.3s",
                }}
                onClick={() => setExpanded(expanded === cert.id ? null : cert.id)}
              >
                {/* Header */}
                <div style={{
                  display: "flex", alignItems: "center", gap: 16, padding: "20px 22px",
                  background: expanded === cert.id ? cert.color + "14" : "transparent",
                  borderBottom: expanded === cert.id ? `1px solid ${cert.color}22` : "1px solid transparent",
                  transition: "all 0.3s",
                }}>
                  {/* Badge */}
                  <div style={{
                    width: 48, height: 48, borderRadius: 12, background: cert.color + "22",
                    border: `1px solid ${cert.color}44`, display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                  }}>
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
                    ) : (
                      <span style={{ fontSize: 16, fontWeight: 900, color: cert.color, fontFamily: "'Space Mono', monospace" }}>{cert.icon}</span>
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 16, color: "#fff" }}>{cert.provider}</div>
                    <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>{cert.items.length} {lang === 'es' ? `certificación${cert.items.length > 1 ? "es" : ""}` : `certification${cert.items.length > 1 ? "s" : ""}`}</div>
                  </div>
                  <div style={{ color: cert.color, fontSize: 16, transition: "transform 0.3s", transform: expanded === cert.id ? "rotate(45deg)" : "rotate(0)" }}>+</div>
                </div>

                {/* Expanded items */}
                {expanded === cert.id && (
                  <div style={{ padding: "16px 22px 20px" }}>
                    {cert.items.map((item, j) => (
                      <div key={item.name} style={{
                        padding: "14px 0", borderBottom: j < cert.items.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                      }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                          <span style={{ color: "#fff", fontSize: 13, fontFamily: "'Syne', sans-serif", fontWeight: 600, flex: 1 }}>{item[`name_${lang}`]}</span>
                          {item.badge ? (
                            <img src={item.badge} alt={item.name} style={{ height: 32, borderRadius: 4, flexShrink: 0, marginLeft: 12 }} />
                          ) : (
                            <span style={{ color: cert.color, fontFamily: "'Space Mono', monospace", fontSize: 11, flexShrink: 0, marginLeft: 12 }}>{item.year}</span>
                          )}
                        </div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                          {item[`skills_${lang}`].map(s => (
                            <span key={s} style={{ background: cert.color + "15", color: cert.color, padding: "2px 8px", borderRadius: 4, fontSize: 10, fontFamily: "'Space Mono', monospace" }}>{s}</span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// PROJECTS
// ============================================================

function ProjectCard({ proj, i, lang, inView }) {
  const [hovered, setHovered] = useState(false);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 15;
    const rotateY = (centerX - x) / 15;
    setRotate({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setHovered(false);
    setRotate({ x: 0, y: 0 });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
    >
      <div
        style={{
          background: hovered ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.02)",
          border: `1px solid ${hovered ? proj.color + "44" : "rgba(255,255,255,0.07)"}`,
          borderRadius: 20, padding: 32, cursor: "pointer",
          transition: "background 0.3s, border 0.3s, transform 0.1s ease",
          transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
          position: "relative", overflow: "hidden",
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Glow bg */}
        <div style={{
          position: "absolute", top: -60, right: -60, width: 180, height: 180,
          borderRadius: "50%", background: `radial-gradient(circle, ${proj.color}18 0%, transparent 70%)`,
          pointerEvents: "none", opacity: hovered ? 1 : 0, transition: "opacity 0.4s",
        }} />

        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
            <div>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: proj.color, letterSpacing: 2, marginBottom: 6 }}>{lang === 'es' ? 'PROYECTO' : 'PROJECT'}</div>
              <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 800, color: "#fff", marginBottom: 4 }}>{proj.name}</h3>
              <p style={{ color: proj.color, fontSize: 12, fontFamily: "'Space Mono', monospace" }}>{proj[`tagline_${lang}`]}</p>
            </div>
            <div style={{
              width: 44, height: 44, borderRadius: 10, background: proj.color + "20",
              border: `1px solid ${proj.color}33`, display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 18, color: proj.color, transition: "transform 0.3s",
              transform: hovered ? "rotate(-8deg)" : "rotate(0)",
            }}>→</div>
          </div>

          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, lineHeight: 1.7, marginBottom: 24, fontFamily: "system-ui" }}>{proj[`description_${lang}`]}</p>

          {/* Highlights */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 20 }}>
            {proj[`highlights_${lang}`].map(h => (
              <span key={h} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.65)", padding: "4px 12px", borderRadius: 6, fontSize: 11, fontFamily: "'Space Mono', monospace" }}>{h}</span>
            ))}
          </div>

          {/* Stack */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 24 }}>
            {proj.stack.map(s => (
              <span key={s} style={{ background: proj.color + "15", color: proj.color, padding: "3px 10px", borderRadius: 4, fontSize: 11, fontFamily: "'Space Mono', monospace" }}>{s}</span>
            ))}
          </div>

          {/* Links */}
          <div style={{ display: "flex", gap: 12 }}>
            <a href={proj.url} target="_blank" rel="noreferrer"
              style={{
                background: proj.color + "20", border: `1px solid ${proj.color}44`,
                color: proj.color, padding: "8px 16px", borderRadius: 8, fontSize: 12,
                fontFamily: "'Space Mono', monospace", textDecoration: "none", transition: "all 0.2s",
              }}
              onMouseEnter={e => { e.target.style.background = proj.color; e.target.style.color = "#fff"; }}
              onMouseLeave={e => { e.target.style.background = proj.color + "20"; e.target.style.color = proj.color; }}
            >
              {lang === 'es' ? 'Ver Proyecto' : 'View Project'} ↗
            </a>
            <a href={proj.github} target="_blank" rel="noreferrer"
              style={{
                background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)",
                color: "rgba(255,255,255,0.6)", padding: "8px 16px", borderRadius: 8, fontSize: 12,
                fontFamily: "'Space Mono', monospace", textDecoration: "none", transition: "all 0.2s",
              }}
              onMouseEnter={e => { e.target.style.borderColor = "#fff"; e.target.style.color = "#fff"; }}
              onMouseLeave={e => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; e.target.style.color = "rgba(255,255,255,0.6)"; }}
            >
              GitHub ↗
            </a>
          </div>
        </div>
      </div>
    </motion.div>
}

function Projects() {
  const { lang } = useContext(LangContext);
  const [ref, inView] = useInView(0.05);

  return (
    <section id="projects" style={{ background: "#0c0a09", padding: "120px 5%" }}>
      <div ref={ref} style={{ maxWidth: 1200, margin: "0 auto" }}>
        <SectionLabel label={lang === 'es' ? "05 / PROYECTOS" : "05 / PROJECTS"} />
        <h2 style={{ fontSize: "clamp(28px, 3.5vw, 48px)", fontWeight: 800, color: "#fff", fontFamily: "'Syne', sans-serif", marginTop: 16, marginBottom: 60 }}>
          {lang === 'es' ? "Trabajos seleccionados" : "Selected work"}
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
          {PROJECTS.map((proj, i) => (
            <ProjectCard key={proj.id} proj={proj} i={i} lang={lang} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  );
}
  );
}

// ============================================================
// SKILLS VISUALIZATION
// ============================================================

function Skills() {
  const { lang } = useContext(LangContext);
  const [ref, inView] = useInView(0.1);
  const hardSkills = SKILLS[lang].hard_skills;
  const softSkills = SKILLS[lang].soft_skills;

  return (
    <section id="skills" style={{ background: "#1c1917", padding: "120px 5%" }}>
      <div ref={ref} style={{ maxWidth: 1200, margin: "0 auto" }}>
        <SectionLabel label={lang === 'es' ? "06 / HABILIDADES" : "06 / SKILLS"} />
        <h2 style={{ fontSize: "clamp(28px, 3.5vw, 48px)", fontWeight: 800, color: "#fff", fontFamily: "'Syne', sans-serif", marginTop: 16, marginBottom: 60 }}>
          {lang === 'es' ? "Capacidades" : "Capabilities"}
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 60 }}>
          <div style={{ opacity: inView ? 1 : 0, transform: inView ? "translateX(0)" : "translateX(-20px)", transition: "all 0.7s ease" }}>
            <h3 style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#f97316", letterSpacing: 3, marginBottom: 32, textTransform: "uppercase" }}>{lang === 'es' ? 'Competencias Clave' : 'Core Competencies'}</h3>
            {hardSkills.map((s, i) => (
              <div key={s.name} style={{ marginBottom: 24, opacity: inView ? 1 : 0, transition: `opacity 0.5s ease ${0.2 + i * 0.1}s` }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ color: "#fff", fontSize: 14, fontFamily: "'Syne', sans-serif", fontWeight: 600 }}>{s.name}</span>
                  <span style={{ color: "#f97316", fontSize: 12, fontFamily: "'Space Mono', monospace" }}>{s.level}%</span>
                </div>
                <div style={{ height: 3, background: "rgba(255,255,255,0.06)", borderRadius: 2, overflow: "hidden" }}>
                  <div style={{
                    height: "100%", background: "linear-gradient(90deg, #f97316, #06b6d4)",
                    borderRadius: 2, transition: `width 1.2s ease ${0.3 + i * 0.1}s`,
                    width: inView ? `${s.level}%` : "0%",
                    boxShadow: "0 0 12px rgba(249,115,22,0.5)",
                  }} />
                </div>
              </div>
            ))}
          </div>

          <div style={{ opacity: inView ? 1 : 0, transform: inView ? "translateX(0)" : "translateX(20px)", transition: "all 0.7s ease 0.2s" }}>
            <h3 style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#06b6d4", letterSpacing: 3, marginBottom: 32, textTransform: "uppercase" }}>{lang === 'es' ? 'Habilidades Blandas y Enfoque' : 'Soft Skills & Approach'}</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {softSkills.map((s, i) => (
                <span key={s} style={{
                  background: "rgba(6,182,212,0.08)", border: "1px solid rgba(6,182,212,0.2)",
                  color: "rgba(255,255,255,0.7)", padding: "10px 18px", borderRadius: 8, fontSize: 13,
                  fontFamily: "system-ui", transition: "all 0.2s",
                  opacity: inView ? 1 : 0, transitionDelay: `${0.3 + i * 0.08}s`,
                }}
                  onMouseEnter={e => { e.target.style.background = "rgba(6,182,212,0.15)"; e.target.style.borderColor = "rgba(6,182,212,0.5)"; e.target.style.color = "#fff"; }}
                  onMouseLeave={e => { e.target.style.background = "rgba(6,182,212,0.08)"; e.target.style.borderColor = "rgba(6,182,212,0.2)"; e.target.style.color = "rgba(255,255,255,0.7)"; }}
                >{s}</span>
              ))}
            </div>

            {/* Specialization areas */}
            <h3 style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#8b5cf6", letterSpacing: 3, marginBottom: 20, marginTop: 40, textTransform: "uppercase" }}>{lang === 'es' ? 'Especializaciones' : 'Specializations'}</h3>
            {SKILLS[lang].specializations.map((spec, i) => (
              <div key={spec} style={{
                display: "flex", alignItems: "center", gap: 12, padding: "10px 0",
                borderBottom: "1px solid rgba(255,255,255,0.04)",
                opacity: inView ? 1 : 0, transitionDelay: `${0.5 + i * 0.07}s`, transition: "opacity 0.5s ease",
              }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#8b5cf6", flexShrink: 0 }} />
                <span style={{ color: "rgba(255,255,255,0.65)", fontSize: 14, fontFamily: "system-ui" }}>{spec}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// CONTACT
// ============================================================

function Contact() {
  const { lang } = useContext(LangContext);
  const [ref, inView] = useInView(0.1);
  const [copied, setCopied] = useState(false);

  const copyEmail = () => {
    navigator.clipboard.writeText(PROFILE[lang].email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="contact" style={{ background: "#0c0a09", padding: "120px 5%", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(249,115,22,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div ref={ref} style={{ maxWidth: 800, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
        <SectionLabel label={lang === 'es' ? "07 / CONTACTO" : "07 / CONTACT"} center />
        <h2 style={{
          fontSize: "clamp(36px, 6vw, 72px)", fontWeight: 800, color: "#fff", fontFamily: "'Syne', sans-serif",
          lineHeight: 1.05, marginTop: 24, marginBottom: 20,
          opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(24px)", transition: "all 0.7s ease",
        }}>
          {lang === 'es' ? (
            <>Vamos a construir<br /><span style={{ color: "#f97316" }}>algo</span><br />grande juntos.</>
          ) : (
            <>Let's build<br /><span style={{ color: "#f97316" }}>something</span><br />great together.</>
          )}
        </h2>
        <p style={{
          color: "rgba(255,255,255,0.45)", fontSize: 16, lineHeight: 1.7, maxWidth: 480, margin: "0 auto 48px",
          fontFamily: "system-ui",
          opacity: inView ? 1 : 0, transition: "opacity 0.7s ease 0.2s",
        }}>
          {lang === 'es' 
            ? "Disponible para roles de ingeniería senior, consultoría técnica y desarrollo de productos de IA. Conectemos."
            : "Available for senior engineering roles, technical consulting, and AI product development. Let's connect."
          }
        </p>

        {/* Email */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 16, background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "16px 24px", marginBottom: 40, cursor: "pointer",
          opacity: inView ? 1 : 0, transition: "all 0.7s ease 0.3s",
        }}
          onClick={copyEmail}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(249,115,22,0.5)"; e.currentTarget.style.background = "rgba(249,115,22,0.08)"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
        >
          <span style={{ color: "#f97316", fontSize: 16 }}>✉</span>
          <span style={{ color: "#fff", fontFamily: "'Space Mono', monospace", fontSize: 14 }}>{PROFILE[lang].email}</span>
          <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 12, fontFamily: "'Space Mono', monospace" }}>{copied ? (lang === 'es' ? "¡COPIADO!" : "COPIED!") : (lang === 'es' ? "CLIC PARA COPIAR" : "CLICK TO COPY")}</span>
        </div>

        {/* Social links */}
        <div style={{
          display: "flex", gap: 16, justifyContent: "center",
          opacity: inView ? 1 : 0, transition: "opacity 0.7s ease 0.4s",
        }}>
          {[["GitHub", PROFILE[lang].github, "#fff"], ["LinkedIn", PROFILE[lang].linkedin, "#0A66C2"]].map(([name, url, color]) => (
            <a key={name} href={url} target="_blank" rel="noreferrer"
              style={{
                background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)",
                color: "rgba(255,255,255,0.6)", padding: "12px 28px", borderRadius: 8, textDecoration: "none",
                fontFamily: "'Space Mono', monospace", fontSize: 13, letterSpacing: 1, transition: "all 0.2s",
              }}
              onMouseEnter={e => { e.target.style.color = color; e.target.style.borderColor = color + "66"; e.target.style.background = color + "11"; }}
              onMouseLeave={e => { e.target.style.color = "rgba(255,255,255,0.6)"; e.target.style.borderColor = "rgba(255,255,255,0.1)"; e.target.style.background = "rgba(255,255,255,0.03)"; }}
            >{name} ↗</a>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// FOOTER
// ============================================================

function Footer() {
  const { lang } = useContext(LangContext);
  return (
    <footer style={{ background: "#03030a", padding: "32px 5%", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, color: "rgba(255,255,255,0.2)" }}>
          © 2025 {PROFILE[lang].name} · {lang === 'es' ? 'Construido con' : 'Built with'} Next.js & Framer Motion
        </span>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "rgba(255,255,255,0.15)" }}>
          {lang === 'es' ? 'DISEÑADO E INGENIADO CON PRECISIÓN' : 'DESIGNED & ENGINEERED WITH PRECISION'}
        </span>
      </div>
    </footer>
  );
}

// ============================================================
// SECTION LABEL
// ============================================================

function SectionLabel({ label, center = false }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, justifyContent: center ? "center" : "flex-start" }}>
      <div style={{ width: 32, height: 1, background: "#f97316" }} />
      <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#f97316", letterSpacing: 3 }}>{label}</span>
    </div>
  );
}

// ============================================================
// MAIN APP
// ============================================================

export default function Portfolio() {
  const scrollY = useScrollY();
  const [lang, setLang] = useState('es');

  useEffect(() => {
    const lenis = new Lenis();
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
    <LangContext.Provider value={{ lang, setLang }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Space+Mono:wght@400;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: #0c0a09; color: #fff; overflow-x: hidden; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0c0a09; }
        ::-webkit-scrollbar-thumb { background: rgba(249,115,22,0.4); border-radius: 2px; }
        @keyframes blink { 0%,100% { opacity:1 } 50% { opacity:0 } }
        @keyframes scrollPulse { 0%,100% { opacity:0.4 } 50% { opacity:0.8 } }
        @keyframes float { 0%,100% { transform:translateY(0) } 50% { transform:translateY(-8px) } }
        button { outline: none; }
        a { outline: none; }
        @media (max-width: 768px) {
          .desktop-only { display: none !important; }
          .nav-links { display: none !important; }
        }
        @media (min-width: 769px) {
          .mobile-only { display: none !important; }
        }
      `}</style>
      <Nav scrollY={scrollY} />
      <Hero />
      <About />
      <TechStack />
      <Experience />
      <Certifications />
      <Projects />
      <Skills />
      <Contact />
      <Footer />
    </LangContext.Provider>
  );
}
