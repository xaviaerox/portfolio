export default function CertificationTree() {
33:   const { lang } = useLang();
34:   const [view, setView] = useState(\'tree\');
35:   const [search, setSearch] = useState(\'\');
36:   const [selected, setSelected] = useState(null);
37:   const [activeProvider, setActiveProvider] = useState(null);
38:   const [expanded, setExpanded] = useState(null);
39: 
40:   const totalCerts = CERTIFICATIONS.reduce((a, c) => a + c.items.length, 0);
41: 
42:   const filtered = useMemo(() => {
43:     if (!search) return CERTIFICATIONS;
44:     const q = search.toLowerCase();
45:     return CERTIFICATIONS.map(p => ({
46:       ...p,
47:       items: p.items.filter(c =>
48:         (c[`name_${lang}`] || c.name || \'\').toLowerCase().includes(q) ||
49:         (c[`skills_${lang}`] || []).some(s => s.toLowerCase().includes(q))
50:       ),
51:     })).filter(p => p.items.length > 0);
52:   }, [search, lang]);
53: 
54:   /* ── Tree Layout Calculation ── */
55:   const treeLayout = useMemo(() => {
56:     const cx = 400, cy = 300;
57:     const providers = filtered.map((p, i) => {
58:       const angle = (2 * Math.PI * i) / filtered.length - Math.PI / 2;
59:       const pr = 160;
60:       const px = cx + pr * Math.cos(angle);
61:       const py = cy + pr * Math.sin(angle);
62:       const certs = p.items.map((c, j) => {
63:         const ca = angle + ((j - (p.items.length - 1) / 2) * 0.35);
64:         const cr = 100;
65:         return { ...c, x: px + cr * Math.cos(ca), y: py + cr * Math.sin(ca), provider: p.provider, providerColor: p.color };
66:       });
67:       return { ...p, x: px, y: py, certs };
68:     });
69:     return { cx, cy, providers };
70:   }, [filtered]);
71: 
72:   return (
73:     <section id="certifications" className="bg-black py-32 px-5 relative">
74:       <div className="max-w-[1200px] mx-auto">
75:         <SectionLabel label={lang === \'es\' ? "04 / CERTIFICACIONES" : "04 / CERTIFICATIONS"} />
76:         <h2 className="text-[clamp(28px,3.5vw,48px)] font-extrabold text-white font-syne mt-4 mb-2">
77:           {lang === \'es\' ? \'Árbol de conocimiento\' : \'Knowledge tree\'}
78:         </h2>
79:         <p className="text-white/35 text-sm font-mono mb-8">
80:           {totalCerts} {lang === \'es\' ? `certificaciones · ${CERTIFICATIONS.length} proveedores` : `certifications · ${CERTIFICATIONS.length} providers`}
81:         </p>
82: 
83:         {/* Controls */}
84:         <div className="flex flex-wrap items-center gap-3 mb-8">
85:           {/* View Toggle */}
86:           <div className="flex bg-white/[0.04] border border-white/10 rounded-lg overflow-hidden">
87:             <button onClick={() => setView(\'tree\')} className={`px-4 py-2 text-xs font-mono transition-all ${view === \'tree\' ? \'bg-brand-accent/20 text-brand-accent\' : \'text-white/40 hover:text-white/70\'}`}>
88:               {lang === \'es\' ? \'ÁRBOL\' : \'TREE\'}
89:             </button>
90:             <button onClick={() => setView(\'list\')} className={`px-4 py-2 text-xs font-mono transition-all ${view === \'list\' ? \'bg-brand-accent/20 text-brand-accent\' : \'text-white/40 hover:text-white/70\'}`}>
91:               {lang === \'es\' ? \'LISTA\' : \'LIST\'}
92:             </button>
93:           </div>
94:           {/* Search */}
95:           <div className="flex-1 min-w-[200px] max-w-[320px] relative">
96:             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 w-4 h-4" />
97:             <input
98:               type="text" value={search} onChange={(e) => setSearch(e.target.value)}
99:               placeholder={lang === \'es\' ? \'Buscar certificación...\' : \'Search certification...\'}
100:               className="w-full bg-white/[0.04] border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white font-mono placeholder:text-white/25 focus:outline-none focus:border-brand-accent/50 transition-colors"
101:             />
102:           </div>
103:         </div>
104: 
105:         {/* ── TREE VIEW ── */}
106:         <AnimatePresence mode="wait">
107:           {view === \'tree\' && (
108:             <motion.div key="tree" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
109:               {/* Desktop SVG Tree */}
110:               <div className="hidden md:block relative">
111:                 <svg viewBox="0 0 800 600" className="w-full h-auto" style={{ maxHeight: \'600px\' }}>
112:                   <defs>
113:                     <filter id="glow">
114:                       <feGaussianBlur stdDeviation="4" result="blur" />
115:                       <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
116:                     </filter>
117:                   </defs>
118: 
119:                   {/* Connection lines: center → providers */}
120:                   {treeLayout.providers.map((p, i) => (
121:                     <motion.line
122:                       key={`line-center-${p.id}`} x1={treeLayout.cx} y1={treeLayout.cy} x2={p.x} y2={p.y}
123:                       stroke={p.color} strokeWidth="1.5" strokeOpacity={activeProvider === p.id || !activeProvider ? 0.3 : 0.05}
124:                       initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
125:                       transition={{ duration: 0.8, delay: 0.3 + i * 0.08 }}
126:                     />
127:                   ))}
128: 
129:                   {/* Connection lines: providers → certs */}
130:                   {treeLayout.providers.map((p) =>
131:                     p.certs.map((c, j) => (
132:                       <motion.line
133:                         key={`line-${p.id}-${j}`} x1={p.x} y1={p.y} x2={c.x} y2={c.y}
134:                         stroke={p.color} strokeWidth="1" strokeOpacity={activeProvider === p.id || !activeProvider ? 0.2 : 0.03}
135:                         initial={{ opacity: 0 }} animate={{ opacity: 1 }}
136:                         transition={{ duration: 0.5, delay: 0.8 + j * 0.05 }}
137:                       />
138:                     ))
139:                   )}
140: 
141:                   {/* Center node */}
142:                   <motion.g initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: \'spring\', delay: 0.1 }}>
143:                     <polygon points={hexPoints(treeLayout.cx, treeLayout.cy, 32)} fill="#6366f115" stroke="#6366f1" strokeWidth="2" filter="url(#glow)" />
144:                     <text x={treeLayout.cx} y={treeLayout.cy + 4} textAnchor="middle" className="fill-white text-[10px] font-bold" style={{ fontFamily: \'var(--font-syne)\' }}>
145:                       {lang === \'es\' ? \'Conocimiento\' : \'Knowledge\'}
146:                     </text>
147:                   </motion.g>
148: 
149:                   {/* Provider nodes */}
150:                   {treeLayout.providers.map((p, i) => (
The above content does NOT show the entire file contents. If you need to view any lines of the file which were not shown to complete your task, call this tool again to view those lines.
'}