
// PREMIUM PORTFOLIO - Full React Implementation
// Stack: React + Tailwind-like inline styles + CSS animations
// Ready to migrate to Next.js + Framer Motion

import { useState, useEffect, useRef, useCallback } from "react";

// ============================================================
// DATA LAYER
// ============================================================

import PROFILE from "./data/profile.json";
import SKILLS from "./data/skills.json";

const TECH_STACK = SKILLS.tech_stack;

import EXPERIENCE from "./data/experience.json";

import CERTIFICATIONS from "./data/certifications.json";

import PROJECTS from "./data/projects.json";

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
        ctx.fillStyle = `rgba(99,102,241,${p.alpha})`;
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
            ctx.strokeStyle = `rgba(99,102,241,${0.08 * (1 - dist / 120)})`;
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
  const [open, setOpen] = useState(false);
  const scrolled = scrollY > 60;
  const links = ["About", "Stack", "Experience", "Certifications", "Projects", "Contact"];
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
      borderBottom: scrolled ? "1px solid rgba(99,102,241,0.15)" : "none",
      padding: "0 5%",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 68 }}>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 16, fontWeight: 700, color: "#6366f1", letterSpacing: 2 }}>
          AM<span style={{ color: "rgba(99,102,241,0.4)" }}>_</span>
        </span>
        <div style={{ display: "flex", gap: 36 }}>
          {links.map(l => (
            <button key={l} onClick={() => scrollTo(l)}
              style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.55)", fontSize: 13, fontFamily: "'Space Mono', monospace", letterSpacing: 1, transition: "color 0.2s", padding: "4px 0" }}
              onMouseEnter={e => e.target.style.color = "#fff"}
              onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.55)"}
            >{l}</button>
          ))}
        </div>
        <button
          onClick={() => scrollTo("Contact")}
          style={{
            background: "transparent", border: "1px solid rgba(99,102,241,0.5)", color: "#6366f1",
            padding: "8px 20px", borderRadius: 6, cursor: "pointer", fontSize: 12,
            fontFamily: "'Space Mono', monospace", letterSpacing: 1, transition: "all 0.2s",
          }}
          onMouseEnter={e => { e.target.style.background = "rgba(99,102,241,0.15)"; e.target.style.borderColor = "#6366f1"; }}
          onMouseLeave={e => { e.target.style.background = "transparent"; e.target.style.borderColor = "rgba(99,102,241,0.5)"; }}
        >
          HIRE ME
        </button>
      </div>
    </nav>
  );
}

// ============================================================
// HERO
// ============================================================

function Hero() {
  const [mounted, setMounted] = useState(false);
  const [tagline] = useTypewriter(PROFILE.tagline, 45, 1200);
  useEffect(() => { setTimeout(() => setMounted(true), 100); }, []);

  return (
    <section id="hero" style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", overflow: "hidden", background: "#05050f" }}>
      <ParticleField count={70} />

      {/* Ambient glow */}
      <div style={{ position: "absolute", top: "20%", left: "50%", transform: "translateX(-50%)", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "10%", right: "15%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(6,182,212,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />

      {/* Grid overlay */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(99,102,241,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.03) 1px, transparent 1px)", backgroundSize: "80px 80px", pointerEvents: "none" }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 1200, margin: "0 auto", padding: "0 5%", width: "100%" }}>
        {/* Status pill */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 32,
          background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.25)",
          borderRadius: 100, padding: "6px 16px",
          opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(12px)",
          transition: "all 0.6s ease 0.1s",
        }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#10b981", boxShadow: "0 0 8px #10b981", display: "inline-block" }} />
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "rgba(255,255,255,0.6)", letterSpacing: 1 }}>AVAILABLE FOR OPPORTUNITIES</span>
        </div>

        {/* Name */}
        <h1 style={{
          fontSize: "clamp(52px, 8vw, 96px)", fontWeight: 800, lineHeight: 1.05, letterSpacing: -2,
          color: "#fff", fontFamily: "'Syne', sans-serif", marginBottom: 8,
          opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(24px)",
          transition: "all 0.7s ease 0.25s",
        }}>
          {PROFILE.name.split(" ").map((w, i) => (
            <span key={i} style={{ display: "block" }}>
              {i === 1 ? <span style={{ WebkitTextStroke: "1px rgba(99,102,241,0.7)", WebkitTextFillColor: "transparent", color: "transparent" }}>{w}</span> : w}
            </span>
          ))}
        </h1>

        {/* Role */}
        <div style={{
          fontSize: "clamp(14px, 2vw, 18px)", color: "#6366f1", fontFamily: "'Space Mono', monospace",
          letterSpacing: 3, marginBottom: 24, textTransform: "uppercase",
          opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(20px)",
          transition: "all 0.7s ease 0.4s",
        }}>
          {PROFILE.role}
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
              background: "#6366f1", color: "#fff", border: "none", padding: "14px 32px",
              borderRadius: 8, cursor: "pointer", fontSize: 14, fontFamily: "'Space Mono', monospace",
              letterSpacing: 1, transition: "all 0.2s", boxShadow: "0 0 40px rgba(99,102,241,0.3)",
            }}
            onMouseEnter={e => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 8px 50px rgba(99,102,241,0.5)"; }}
            onMouseLeave={e => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "0 0 40px rgba(99,102,241,0.3)"; }}
          >VIEW PROJECTS →</button>
          <button
            onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
            style={{
              background: "transparent", color: "rgba(255,255,255,0.75)", border: "1px solid rgba(255,255,255,0.15)",
              padding: "14px 32px", borderRadius: 8, cursor: "pointer", fontSize: 14,
              fontFamily: "'Space Mono', monospace", letterSpacing: 1, transition: "all 0.2s",
            }}
            onMouseEnter={e => { e.target.style.borderColor = "rgba(255,255,255,0.4)"; e.target.style.color = "#fff"; }}
            onMouseLeave={e => { e.target.style.borderColor = "rgba(255,255,255,0.15)"; e.target.style.color = "rgba(255,255,255,0.75)"; }}
          >GET IN TOUCH</button>
        </div>

        {/* Stats row */}
        <div style={{
          display: "flex", gap: 48, marginTop: 80, paddingTop: 48,
          borderTop: "1px solid rgba(255,255,255,0.06)",
          opacity: mounted ? 1 : 0, transition: "opacity 0.8s ease 1.1s",
        }}>
          {[["12+", "Años Exp."], ["3+", "Casos Éxito"], ["6+", "Certificados"], ["100%", "Disponibilidad"]].map(([n, l]) => (
            <div key={l}>
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
  const [ref, inView] = useInView(0.1);
  const traits = [
    { icon: "⚡", label: "Systems Thinker", desc: "See architecture holistically" },
    { icon: "🤖", label: "AI Engineer", desc: "LLMs, RAG, AI pipelines" },
    { icon: "🔬", label: "Problem Solver", desc: "Debug anything, anywhere" },
    { icon: "🚀", label: "Fast Learner", desc: "New tech in days, not weeks" },
    { icon: "🏗️", label: "Architect", desc: "Scalable, clean systems" },
    { icon: "🔄", label: "Automator", desc: "Eliminate repetition at scale" },
  ];

  return (
    <section id="about" style={{ background: "#05050f", padding: "120px 5%" }}>
      <div ref={ref} style={{ maxWidth: 1200, margin: "0 auto" }}>
        <SectionLabel label="01 / ABOUT" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "start", marginTop: 60 }}>
          <div style={{ opacity: inView ? 1 : 0, transform: inView ? "translateX(0)" : "translateX(-30px)", transition: "all 0.8s ease" }}>
            <h2 style={{ fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 800, color: "#fff", fontFamily: "'Syne', sans-serif", lineHeight: 1.1, marginBottom: 28 }}>
              Engineer by logic,<br /><span style={{ color: "#6366f1" }}>creator</span> by passion.
            </h2>
            <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 16, lineHeight: 1.9, marginBottom: 20, fontFamily: "system-ui" }}>{PROFILE.bio}</p>
            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 14, lineHeight: 1.8, fontFamily: "'Space Mono', monospace", borderLeft: "2px solid rgba(99,102,241,0.5)", paddingLeft: 20, marginTop: 32 }}>
              "{PROFILE.philosophy}"
            </p>
          </div>
          <div style={{ opacity: inView ? 1 : 0, transform: inView ? "translateX(0)" : "translateX(30px)", transition: "all 0.8s ease 0.2s" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {traits.map((t, i) => (
                <div key={t.label}
                  style={{
                    background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: 12, padding: "20px", transition: "all 0.3s",
                    opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(20px)",
                    transitionDelay: `${0.3 + i * 0.07}s`,
                    cursor: "default",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(99,102,241,0.08)"; e.currentTarget.style.borderColor = "rgba(99,102,241,0.3)"; }}
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
  const [ref, inView] = useInView(0.05);
  const [filter, setFilter] = useState("All");
  const categories = ["All", ...new Set(TECH_STACK.map(t => t.cat))];
  const filtered = filter === "All" ? TECH_STACK : TECH_STACK.filter(t => t.cat === filter);

  return (
    <section id="stack" style={{ background: "#080818", padding: "120px 5%" }}>
      <div ref={ref} style={{ maxWidth: 1200, margin: "0 auto" }}>
        <SectionLabel label="02 / TECH STACK" />
        <h2 style={{ fontSize: "clamp(28px, 3.5vw, 48px)", fontWeight: 800, color: "#fff", fontFamily: "'Syne', sans-serif", marginTop: 16, marginBottom: 16 }}>
          Technologies I master
        </h2>

        {/* Filter pills */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 48, marginTop: 32 }}>
          {categories.map(c => (
            <button key={c} onClick={() => setFilter(c)} style={{
              background: filter === c ? "rgba(99,102,241,0.2)" : "transparent",
              border: `1px solid ${filter === c ? "#6366f1" : "rgba(255,255,255,0.1)"}`,
              color: filter === c ? "#6366f1" : "rgba(255,255,255,0.45)",
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
              onMouseEnter={e => { e.currentTarget.style.borderColor = tech.color + "44"; e.currentTarget.style.background = tech.color + "11"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }}
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
  const [ref, inView] = useInView(0.05);
  const [expanded, setExpanded] = useState(null);

  return (
    <section id="experience" style={{ background: "#05050f", padding: "120px 5%" }}>
      <div ref={ref} style={{ maxWidth: 1200, margin: "0 auto" }}>
        <SectionLabel label="03 / EXPERIENCE" />
        <h2 style={{ fontSize: "clamp(28px, 3.5vw, 48px)", fontWeight: 800, color: "#fff", fontFamily: "'Syne', sans-serif", marginTop: 16, marginBottom: 60 }}>
          Career evolution
        </h2>

        <div style={{ position: "relative" }}>
          {/* Timeline line */}
          <div style={{
            position: "absolute", left: 24, top: 0, bottom: 0, width: 1,
            background: "linear-gradient(to bottom, transparent, rgba(99,102,241,0.4) 10%, rgba(99,102,241,0.4) 90%, transparent)",
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
                borderRadius: "50%", background: exp.color, border: "3px solid #05050f",
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
                      <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 20, color: "#fff", marginBottom: 2 }}>{exp.role}</div>
                      <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, fontFamily: "'Space Mono', monospace" }}>{exp.company} · {exp.location}</div>
                    </div>
                    <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 18, transition: "transform 0.3s", transform: expanded === exp.id ? "rotate(180deg)" : "rotate(0)" }}>▼</div>
                  </div>
                </div>

                {expanded === exp.id && (
                  <div style={{ padding: "0 28px 28px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                    <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 14, lineHeight: 1.8, marginTop: 20, marginBottom: 20, fontFamily: "system-ui" }}>{exp.description}</p>

                    {/* Stack */}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 20 }}>
                      {exp.stack.map(s => (
                        <span key={s} style={{ background: exp.color + "18", border: `1px solid ${exp.color}33`, color: exp.color, padding: "3px 10px", borderRadius: 4, fontSize: 11, fontFamily: "'Space Mono', monospace" }}>{s}</span>
                      ))}
                    </div>

                    {/* Achievements */}
                    <div>
                      {exp.achievements.map(a => (
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
  const [ref, inView] = useInView(0.05);
  const [expanded, setExpanded] = useState(null);

  return (
    <section id="certifications" style={{ background: "#080818", padding: "120px 5%" }}>
      <div ref={ref} style={{ maxWidth: 1200, margin: "0 auto" }}>
        <SectionLabel label="04 / CERTIFICATIONS" />
        <h2 style={{ fontSize: "clamp(28px, 3.5vw, 48px)", fontWeight: 800, color: "#fff", fontFamily: "'Syne', sans-serif", marginTop: 16, marginBottom: 16 }}>
          Knowledge graph
        </h2>
        <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 14, fontFamily: "'Space Mono', monospace", marginBottom: 60 }}>
          {CERTIFICATIONS.reduce((a, c) => a + c.items.length, 0)} certifications across {CERTIFICATIONS.length} providers
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 20 }}>
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
                    fontSize: 12, fontWeight: 900, color: cert.color, fontFamily: "'Space Mono', monospace",
                    flexShrink: 0,
                  }}>{cert.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 16, color: "#fff" }}>{cert.provider}</div>
                    <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>{cert.items.length} certification{cert.items.length > 1 ? "s" : ""}</div>
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
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                          <span style={{ color: "#fff", fontSize: 13, fontFamily: "'Syne', sans-serif", fontWeight: 600, flex: 1 }}>{item.name}</span>
                          <span style={{ color: cert.color, fontFamily: "'Space Mono', monospace", fontSize: 11, flexShrink: 0, marginLeft: 12 }}>{item.year}</span>
                        </div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                          {item.skills.map(s => (
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

function Projects() {
  const [ref, inView] = useInView(0.05);
  const [hovered, setHovered] = useState(null);

  return (
    <section id="projects" style={{ background: "#05050f", padding: "120px 5%" }}>
      <div ref={ref} style={{ maxWidth: 1200, margin: "0 auto" }}>
        <SectionLabel label="05 / PROJECTS" />
        <h2 style={{ fontSize: "clamp(28px, 3.5vw, 48px)", fontWeight: 800, color: "#fff", fontFamily: "'Syne', sans-serif", marginTop: 16, marginBottom: 60 }}>
          Selected work
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(520px, 1fr))", gap: 20 }}>
          {PROJECTS.map((proj, i) => (
            <div key={proj.id}
              style={{
                background: hovered === proj.id ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.02)",
                border: `1px solid ${hovered === proj.id ? proj.color + "44" : "rgba(255,255,255,0.07)"}`,
                borderRadius: 20, padding: 32, cursor: "pointer",
                transition: "all 0.35s ease",
                opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(24px)",
                transitionDelay: `${i * 0.1}s`,
                position: "relative", overflow: "hidden",
              }}
              onMouseEnter={() => setHovered(proj.id)}
              onMouseLeave={() => setHovered(null)}
            >
              {/* Glow bg */}
              <div style={{
                position: "absolute", top: -60, right: -60, width: 180, height: 180,
                borderRadius: "50%", background: `radial-gradient(circle, ${proj.color}18 0%, transparent 70%)`,
                pointerEvents: "none", opacity: hovered === proj.id ? 1 : 0, transition: "opacity 0.4s",
              }} />

              <div style={{ position: "relative", zIndex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                  <div>
                    <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: proj.color, letterSpacing: 2, marginBottom: 6 }}>PROJECT</div>
                    <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 800, color: "#fff", marginBottom: 4 }}>{proj.name}</h3>
                    <p style={{ color: proj.color, fontSize: 12, fontFamily: "'Space Mono', monospace" }}>{proj.tagline}</p>
                  </div>
                  <div style={{
                    width: 44, height: 44, borderRadius: 10, background: proj.color + "20",
                    border: `1px solid ${proj.color}33`, display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 18, color: proj.color, transition: "transform 0.3s",
                    transform: hovered === proj.id ? "rotate(-8deg)" : "rotate(0)",
                  }}>→</div>
                </div>

                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, lineHeight: 1.7, marginBottom: 24, fontFamily: "system-ui" }}>{proj.description}</p>

                {/* Highlights */}
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 20 }}>
                  {proj.highlights.map(h => (
                    <span key={h} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.65)", padding: "4px 12px", borderRadius: 6, fontSize: 11, fontFamily: "'Space Mono', monospace" }}>{h}</span>
                  ))}
                </div>

                {/* Stack */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {proj.stack.map(s => (
                    <span key={s} style={{ background: proj.color + "15", color: proj.color, padding: "3px 10px", borderRadius: 4, fontSize: 11, fontFamily: "'Space Mono', monospace" }}>{s}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// SKILLS VISUALIZATION
// ============================================================

function Skills() {
  const [ref, inView] = useInView(0.1);
  const hardSkills = SKILLS.hard_skills;
  const softSkills = SKILLS.soft_skills;

  return (
    <section id="skills" style={{ background: "#080818", padding: "120px 5%" }}>
      <div ref={ref} style={{ maxWidth: 1200, margin: "0 auto" }}>
        <SectionLabel label="06 / SKILLS" />
        <h2 style={{ fontSize: "clamp(28px, 3.5vw, 48px)", fontWeight: 800, color: "#fff", fontFamily: "'Syne', sans-serif", marginTop: 16, marginBottom: 60 }}>
          Capabilities
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60 }}>
          <div style={{ opacity: inView ? 1 : 0, transform: inView ? "translateX(0)" : "translateX(-20px)", transition: "all 0.7s ease" }}>
            <h3 style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#6366f1", letterSpacing: 3, marginBottom: 32, textTransform: "uppercase" }}>Core Competencies</h3>
            {hardSkills.map((s, i) => (
              <div key={s.name} style={{ marginBottom: 24, opacity: inView ? 1 : 0, transition: `opacity 0.5s ease ${0.2 + i * 0.1}s` }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ color: "#fff", fontSize: 14, fontFamily: "'Syne', sans-serif", fontWeight: 600 }}>{s.name}</span>
                  <span style={{ color: "#6366f1", fontSize: 12, fontFamily: "'Space Mono', monospace" }}>{s.level}%</span>
                </div>
                <div style={{ height: 3, background: "rgba(255,255,255,0.06)", borderRadius: 2, overflow: "hidden" }}>
                  <div style={{
                    height: "100%", background: "linear-gradient(90deg, #6366f1, #06b6d4)",
                    borderRadius: 2, transition: `width 1.2s ease ${0.3 + i * 0.1}s`,
                    width: inView ? `${s.level}%` : "0%",
                    boxShadow: "0 0 12px rgba(99,102,241,0.5)",
                  }} />
                </div>
              </div>
            ))}
          </div>

          <div style={{ opacity: inView ? 1 : 0, transform: inView ? "translateX(0)" : "translateX(20px)", transition: "all 0.7s ease 0.2s" }}>
            <h3 style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#06b6d4", letterSpacing: 3, marginBottom: 32, textTransform: "uppercase" }}>Soft Skills & Approach</h3>
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
            <h3 style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#8b5cf6", letterSpacing: 3, marginBottom: 20, marginTop: 40, textTransform: "uppercase" }}>Specializations</h3>
            {SKILLS.specializations.map((spec, i) => (
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
  const [ref, inView] = useInView(0.1);
  const [copied, setCopied] = useState(false);

  const copyEmail = () => {
    navigator.clipboard.writeText(PROFILE.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="contact" style={{ background: "#05050f", padding: "120px 5%", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div ref={ref} style={{ maxWidth: 800, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
        <SectionLabel label="07 / CONTACT" center />
        <h2 style={{
          fontSize: "clamp(36px, 6vw, 72px)", fontWeight: 800, color: "#fff", fontFamily: "'Syne', sans-serif",
          lineHeight: 1.05, marginTop: 24, marginBottom: 20,
          opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(24px)", transition: "all 0.7s ease",
        }}>
          Let's build<br /><span style={{ color: "#6366f1" }}>something</span><br />great together.
        </h2>
        <p style={{
          color: "rgba(255,255,255,0.45)", fontSize: 16, lineHeight: 1.7, maxWidth: 480, margin: "0 auto 48px",
          fontFamily: "system-ui",
          opacity: inView ? 1 : 0, transition: "opacity 0.7s ease 0.2s",
        }}>
          Available for senior engineering roles, technical consulting, and AI product development. Let's connect.
        </p>

        {/* Email */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 16, background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "16px 24px", marginBottom: 40, cursor: "pointer",
          opacity: inView ? 1 : 0, transition: "all 0.7s ease 0.3s",
        }}
          onClick={copyEmail}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(99,102,241,0.5)"; e.currentTarget.style.background = "rgba(99,102,241,0.08)"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
        >
          <span style={{ color: "#6366f1", fontSize: 16 }}>✉</span>
          <span style={{ color: "#fff", fontFamily: "'Space Mono', monospace", fontSize: 14 }}>{PROFILE.email}</span>
          <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 12, fontFamily: "'Space Mono', monospace" }}>{copied ? "COPIED!" : "CLICK TO COPY"}</span>
        </div>

        {/* Social links */}
        <div style={{
          display: "flex", gap: 16, justifyContent: "center",
          opacity: inView ? 1 : 0, transition: "opacity 0.7s ease 0.4s",
        }}>
          {[["GitHub", PROFILE.github, "#fff"], ["LinkedIn", PROFILE.linkedin, "#0A66C2"]].map(([name, url, color]) => (
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
  return (
    <footer style={{ background: "#03030a", padding: "32px 5%", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, color: "rgba(255,255,255,0.2)" }}>
          © 2025 {PROFILE.name} · Built with Next.js & Framer Motion
        </span>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "rgba(255,255,255,0.15)" }}>
          DESIGNED & ENGINEERED WITH PRECISION
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
      <div style={{ width: 32, height: 1, background: "#6366f1" }} />
      <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#6366f1", letterSpacing: 3 }}>{label}</span>
    </div>
  );
}

// ============================================================
// MAIN APP
// ============================================================

export default function Portfolio() {
  const scrollY = useScrollY();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Space+Mono:wght@400;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: #05050f; color: #fff; overflow-x: hidden; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #05050f; }
        ::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.4); border-radius: 2px; }
        @keyframes blink { 0%,100% { opacity:1 } 50% { opacity:0 } }
        @keyframes scrollPulse { 0%,100% { opacity:0.4 } 50% { opacity:0.8 } }
        @keyframes float { 0%,100% { transform:translateY(0) } 50% { transform:translateY(-8px) } }
        button { outline: none; }
        a { outline: none; }
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
    </>
  );
}
