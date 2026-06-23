'use client';
import { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useLang } from '../contexts/LangContext';
import SectionLabel from './SectionLabel';
import GRAPH_DATA from '../data/knowledge-graph.json';

/* ── Force simulation (simple spring model) ── */
function runSimulation(nodes, edges, width, height, iterations = 120) {
  const pos = {};
  // Init positions in circle
  nodes.forEach((n, i) => {
    const angle = (2 * Math.PI * i) / nodes.length;
    const r = Math.min(width, height) * 0.3;
    pos[n.id] = { x: width / 2 + r * Math.cos(angle) + (Math.random() - 0.5) * 40, y: height / 2 + r * Math.sin(angle) + (Math.random() - 0.5) * 40 };
  });

  for (let iter = 0; iter < iterations; iter++) {
    const forces = {};
    nodes.forEach(n => { forces[n.id] = { fx: 0, fy: 0 }; });

    // Repulsion
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = pos[nodes[i].id], b = pos[nodes[j].id];
        let dx = b.x - a.x, dy = b.y - a.y;
        const dist = Math.max(Math.sqrt(dx * dx + dy * dy), 1);
        const force = 3000 / (dist * dist);
        const fx = (dx / dist) * force, fy = (dy / dist) * force;
        forces[nodes[i].id].fx -= fx; forces[nodes[i].id].fy -= fy;
        forces[nodes[j].id].fx += fx; forces[nodes[j].id].fy += fy;
      }
    }

    // Attraction along edges
    edges.forEach(e => {
      const a = pos[e.from], b = pos[e.to];
      if (!a || !b) return;
      const dx = b.x - a.x, dy = b.y - a.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const force = (dist - 100) * 0.01 * (e.strength || 0.5);
      if (forces[e.from] && forces[e.to]) {
        forces[e.from].fx += (dx / dist) * force;
        forces[e.from].fy += (dy / dist) * force;
        forces[e.to].fx -= (dx / dist) * force;
        forces[e.to].fy -= (dy / dist) * force;
      }
    });

    // Centering
    nodes.forEach(n => {
      const p = pos[n.id];
      forces[n.id].fx += (width / 2 - p.x) * 0.005;
      forces[n.id].fy += (height / 2 - p.y) * 0.005;
    });

    // Apply
    const damping = 1 - iter / iterations;
    nodes.forEach(n => {
      const f = forces[n.id];
      pos[n.id].x += f.fx * damping * 0.5;
      pos[n.id].y += f.fy * damping * 0.5;
      // Bounds
      pos[n.id].x = Math.max(50, Math.min(width - 50, pos[n.id].x));
      pos[n.id].y = Math.max(40, Math.min(height - 40, pos[n.id].y));
    });
  }
  return pos;
}

/* ── Draw shapes ── */
function drawNode(ctx, x, y, type, size, color, highlighted, hovered) {
  const s = hovered ? size * 1.3 : highlighted ? size * 1.1 : size;
  ctx.save();
  ctx.fillStyle = highlighted || hovered ? color + '55' : color + '22';
  ctx.strokeStyle = highlighted || hovered ? color : color + '88';
  ctx.lineWidth = hovered ? 2.5 : 1.5;

  if (hovered) {
    ctx.shadowColor = color;
    ctx.shadowBlur = 16;
  }

  ctx.beginPath();
  if (type === 'circle' || type === 'skill') {
    ctx.arc(x, y, s, 0, Math.PI * 2);
  } else if (type === 'hexagon' || type === 'certification') {
    for (let i = 0; i < 6; i++) {
      const a = (Math.PI / 3) * i - Math.PI / 2;
      const px = x + s * Math.cos(a), py = y + s * Math.sin(a);
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.closePath();
  } else if (type === 'diamond' || type === 'project') {
    ctx.moveTo(x, y - s); ctx.lineTo(x + s, y); ctx.lineTo(x, y + s); ctx.lineTo(x - s, y); ctx.closePath();
  } else { // square / experience
    ctx.rect(x - s * 0.8, y - s * 0.8, s * 1.6, s * 1.6);
  }
  ctx.fill(); ctx.stroke();
  ctx.restore();
}

export default function KnowledgeGraph() {
  const { lang } = useLang();
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [hovered, setHovered] = useState(null);
  const [filters, setFilters] = useState({ certification: true, skill: true, project: true, experience: true });
  const [canvasSize, setCanvasSize] = useState({ w: 800, h: 500 });

  const nodeLabel = useCallback((n) => n[`label_${lang}`] || n.label || '', [lang]);

  // Filter nodes and edges
  const { visibleNodes, visibleEdges } = useMemo(() => {
    const vn = GRAPH_DATA.nodes.filter(n => filters[n.type]);
    const vnIds = new Set(vn.map(n => n.id));
    const ve = GRAPH_DATA.edges.filter(e => vnIds.has(e.from) && vnIds.has(e.to));
    return { visibleNodes: vn, visibleEdges: ve };
  }, [filters]);

  // Run layout
  const positions = useMemo(() => {
    return runSimulation(visibleNodes, visibleEdges, canvasSize.w, canvasSize.h);
  }, [visibleNodes, visibleEdges, canvasSize]);

  // Resize
  useEffect(() => {
    const onResize = () => {
      if (containerRef.current) {
        const w = containerRef.current.offsetWidth;
        setCanvasSize({ w, h: w < 640 ? 350 : 500 });
      }
    };
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Mouse → find nearest node
  const findNode = useCallback((mx, my) => {
    let closest = null, minD = 30;
    for (const n of visibleNodes) {
      const p = positions[n.id];
      if (!p) continue;
      const d = Math.sqrt((mx - p.x) ** 2 + (my - p.y) ** 2);
      if (d < minD) { minD = d; closest = n.id; }
    }
    return closest;
  }, [visibleNodes, positions]);

  const handleMouseMove = useCallback((e) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const mx = (e.clientX - rect.left) * (canvasSize.w / rect.width);
    const my = (e.clientY - rect.top) * (canvasSize.h / rect.height);
    setHovered(findNode(mx, my));
  }, [findNode, canvasSize]);

  // Render
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvasSize.w * dpr;
    canvas.height = canvasSize.h * dpr;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, canvasSize.w, canvasSize.h);

    // Connected nodes for highlight
    const connected = new Set();
    if (hovered) {
      connected.add(hovered);
      visibleEdges.forEach(e => {
        if (e.from === hovered) connected.add(e.to);
        if (e.to === hovered) connected.add(e.from);
      });
    }

    // Draw edges
    visibleEdges.forEach(e => {
      const a = positions[e.from], b = positions[e.to];
      if (!a || !b) return;
      const isHighlighted = hovered && (connected.has(e.from) && connected.has(e.to));
      ctx.beginPath();
      ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
      ctx.strokeStyle = isHighlighted ? '#6366f188' : hovered ? '#ffffff08' : '#ffffff15';
      ctx.lineWidth = isHighlighted ? 2 : 1;
      ctx.stroke();
    });

    // Draw nodes
    visibleNodes.forEach(n => {
      const p = positions[n.id];
      if (!p) return;
      const nt = GRAPH_DATA.nodeTypes[n.type] || { color: '#888', size: 12 };
      const isHovered = hovered === n.id;
      const isHighlighted = hovered ? connected.has(n.id) : true;
      const dimmed = hovered && !isHighlighted;
      const finalColor = dimmed ? '#444444' : nt.color;
      const sz = canvasSize.w < 640 ? nt.size * 0.7 : nt.size;

      drawNode(ctx, p.x, p.y, n.type, sz, finalColor, isHighlighted && hovered, isHovered);

      // Label
      ctx.save();
      ctx.font = `${canvasSize.w < 640 ? 8 : 10}px 'JetBrains Mono', monospace`;
      ctx.textAlign = 'center';
      ctx.fillStyle = dimmed ? '#ffffff15' : isHovered ? '#fff' : '#ffffff88';
      ctx.fillText(nodeLabel(n), p.x, p.y + sz + (canvasSize.w < 640 ? 12 : 16));
      ctx.restore();
    });
  }, [visibleNodes, visibleEdges, positions, hovered, canvasSize, nodeLabel]);

  const typeLabels = {
    certification: lang === 'es' ? 'Certificaciones' : 'Certifications',
    skill: lang === 'es' ? 'Habilidades' : 'Skills',
    project: lang === 'es' ? 'Proyectos' : 'Projects',
    experience: lang === 'es' ? 'Experiencia' : 'Experience',
  };

  return (
    <section id="knowledge-graph" className="bg-brand-dark/95 py-32 px-5">
      <div className="max-w-[1200px] mx-auto">
        <SectionLabel label={lang === 'es' ? "GRAFO DE CONOCIMIENTO" : "KNOWLEDGE GRAPH"} />
        <h2 className="text-[clamp(28px,3.5vw,48px)] font-extrabold text-white font-syne mt-4 mb-2">
          {lang === 'es' ? 'Cómo se conecta todo' : 'How it all connects'}
        </h2>
        <p className="text-white/35 text-sm font-mono mb-8">
          {visibleNodes.length} {lang === 'es' ? 'nodos' : 'nodes'} · {visibleEdges.length} {lang === 'es' ? 'conexiones' : 'connections'}
        </p>

        {/* Filters */}
        <div className="flex gap-2 flex-wrap mb-6">
          {Object.entries(GRAPH_DATA.nodeTypes).map(([type, config]) => (
            <button key={type} onClick={() => setFilters(f => ({ ...f, [type]: !f[type] }))}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-[11px] font-mono tracking-widest border transition-all ${filters[type] ? 'border-white/20 text-white' : 'border-white/5 text-white/25'}`}
            >
              <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: filters[type] ? config.color : '#333' }} />
              {typeLabels[type]?.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Canvas */}
        <div ref={containerRef} className="relative rounded-2xl overflow-hidden border border-white/5 bg-black/40">
          <canvas
            ref={canvasRef}
            style={{ width: '100%', height: canvasSize.h, cursor: hovered ? 'pointer' : 'default' }}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setHovered(null)}
          />
          {/* Vignette overlay */}
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, transparent 50%, #05050f 100%)' }} />

          {/* Hover tooltip */}
          {hovered && positions[hovered] && (() => {
            const node = visibleNodes.find(n => n.id === hovered);
            if (!node) return null;
            const nt = GRAPH_DATA.nodeTypes[node.type];
            const connCount = visibleEdges.filter(e => e.from === hovered || e.to === hovered).length;
            return (
              <motion.div
                initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                className="absolute top-4 right-4 bg-black/80 backdrop-blur-lg border border-white/10 rounded-xl p-4 min-w-[180px] pointer-events-none"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: nt?.color }} />
                  <span className="text-xs font-mono uppercase tracking-widest" style={{ color: nt?.color }}>{typeLabels[node.type]}</span>
                </div>
                <div className="text-white font-syne font-bold text-sm">{nodeLabel(node)}</div>
                <div className="text-white/40 text-[10px] font-mono mt-1">{connCount} {lang === 'es' ? 'conexiones' : 'connections'}</div>
              </motion.div>
            );
          })()}
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-6 mt-6 flex-wrap">
          {Object.entries(GRAPH_DATA.nodeTypes).map(([type, config]) => (
            <div key={type} className="flex items-center gap-2 text-[10px] font-mono text-white/40">
              <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: config.color }} />
              {typeLabels[type]}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
