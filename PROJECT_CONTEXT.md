# PROJECT_CONTEXT.md

---

# Proyecto

**Nombre:** Portfolio Xavi Alonso (v2 Evolution)

**Descripción:** Portafolio profesional interactivo, futurista y cinematográfico diseñado para Xavi Alonso, Operador IT, Arquitecto de Infraestructura y Desarrollador Web. Combina la exposición de 12+ años de experiencia en administración de sistemas e infraestructuras críticas con proyectos de desarrollo de software propios (como Queryclin y StockFlow), formación continua y certificaciones técnicas.

**Objetivo principal:** Destacar el perfil técnico senior, la trayectoria profesional, las certificaciones verificables, el grafo de conocimiento y las capacidades de innovación tecnológica mediante un sitio web inmersivo de alto impacto visual y nivel boutique.

**Problema que resuelve:** Sustituye los portafolios web tradicionales, planos o corporativos por una plataforma visualmente impactante, fluida y modular que comunica eficazmente seniority técnico, versatilidad y capacidad de resolución de problemas complejos.

**Usuarios objetivo:** Reclutadores IT, directores de tecnología (CTOs), clientes corporativos de consultoría en infraestructura, ciberseguridad e IA, y la comunidad de desarrollo software.

**Estado del proyecto:** En producción / Activo (Evolución V2 completamente desplegada y funcional).

**Nivel de madurez:** Estable y modular. Permite una fácil expansión mediante actualización de archivos de datos JSON y adición de componentes visuales.

**Repositorio:** `https://github.com/xaviaerox/portfolio`

**Versión actual:** 0.1.0 (Portfolio Evolution V2)

**Última actualización:** 2026-07-31

---

# Visión General

**Explicación de alto nivel del sistema:**  
El sistema es una aplicación web de página única (Single Page Application - SPA) construida con Next.js 14 (App Router) y React 18, totalmente optimizada para exportación estática (`output: 'export'`) y alojamiento sin servidor (serverless/static) en GitHub Pages.

**Cómo funciona:**  
1. **Carga de Datos:** Los componentes leen la información técnica, laboral y personal desde archivos JSON estáticos estructurados (`data/*.json`), garantizando la separación entre datos y presentación.
2. **Internacionalización (i18n):** El estado global de idioma (`es` / `en`) es gestionado a través de `LangContext` (`contexts/LangContext.jsx`), permitiendo la traducción dinámica e instantánea de todo el sitio.
3. **Experiencia de Scroll Inmersiva:** Un bucle de animación optimizado con `Lenis Scroll` controla el desplazamiento suave en toda la página.
4. **Renderizado de Interacciones:** Las animaciones al hacer scroll, revelados progresivos, efectos de brillo y micro-interacciones son gestionados mediante `Framer Motion`, Canvas API y CSS avanzado.

**Qué hace:**  
- **Hero Section:** Presentación cinematográfica con sistema de partículas dinámico en Canvas, indicador de disponibilidad y efecto de maquina de escribir (typewriter).
- **Sobre Mí (About):** Desglose de mentalidad, filosofía de trabajo, fortalezas y principios de arquitectura silenciosa.
- **Tech Stack:** Módulo interactivo con filtrado por categorías de tecnologías y barras animadas de nivel de competencia.
- **Experiencia Laboral (Experience Tree):** Timeline vertical cronológico con nodos expandibles, detalles de proyectos, logros cuantitativos y tecnologías empleadas.
- **Árbol de Certificaciones (CertificationTree):** Visualización agrupada por proveedores (Google, IBM, Microsoft, Cisco, Coursera, etc.) con badges interactivos, desglose de competencias adquiridas y enlaces de verificación.
- **Grafo de Conocimiento (KnowledgeGraph):** Red visual interactiva de dominios técnicos y sus relaciones.
- **Proyectos Destacados (Projects):** Tarjetas premium que muestran proyectos clave (Queryclin, StockFlow, Solutech, Solutech Blog) con arquitectura, stack y métricas.
- **Habilidades y Capacidades (Skills):** Métrica de competencias core, habilidades blandas y especializaciones.
- **Prueba de Trabajo (ProofOfWork) & Dashboard de Builder (BuilderDashboard):** Métricas operativas, código de muestra y telemetría de desarrollo.
- **Línea de Tiempo Tecnológica (TechTimeline):** Evolución histórica de herramientas y roles desde 2012.
- **Contacto (Contact) & Modo Narrativo (NarrativeMode):** Copia rápida de email al portapapeles, enlaces sociales y tour narrativo interactivo guiado.

**Qué no hace:**  
- No requiere backend activo en tiempo de ejecución (Node.js/Express/BBDD).
- No realiza consultas a bases de datos relacionales o NoSQL en servidor.
- No procesa autenticación ni almacenamiento de sesiones de usuario en servidor.

**Límites del proyecto:**  
Todas las operaciones ocurren en el navegador del cliente (Client-Side). Las actualizaciones de contenido requieren editar los archivos JSON y relanzar el build/export estático.

---

# Arquitectura

**Descripción completa:**  
El proyecto adopta una arquitectura Jamstack (JavaScript, APIs, Markup) basada en capas desacopladas:

1. **Capa de Datos (Data Layer):** Archivos JSON locales estáticos estructurados por dominio (`data/*.json`).
2. **Capa de Integración (Integration Layer):** Módulos mapeadores (`integrations/credly`, `integrations/github`) para procesar e igualar formatos de datos de fuentes externas.
3. **Capa de Lógica y Estado (State Layer):** React Context (`LangProvider`) y Custom Hooks (`useInView`, `useTypewriter`, `useScrollY`).
4. **Capa de Presentación y Motion Design (UI/UX Layer):** Componentes React modulares apoyados en Tailwind CSS v4, Framer Motion y Lenis Scroll.

**Diagrama ASCII:**

```
+-----------------------------------------------------------------------------------+
|                                 NAVEGADOR CLIENTE                                 |
|                                                                                   |
|  +-----------------------------------------------------------------------------+  |
|  |                 Next.js App Router (app/layout.jsx + app/page.jsx)           |  |
|  |                                                                             |  |
|  |  +-----------------------------------------------------------------------+  |  |
|  |  |                 LangProvider (contexts/LangContext.jsx)                 |  |  |
|  |  |                                                                       |  |  |
|  |  |  [Lenis Smooth Scroll Engine] ---> [Global Event Loop (rAF)]          |  |  |
|  |  |                                                                       |  |  |
|  |  |  +-----------------------------------------------------------------+  |  |  |
|  |  |  |                     COMPONENTES UI (components/)                |  |  |  |
|  |  |  | - Hero.jsx (Canvas Particles)   - CertificationTree.jsx       |  |  |  |
|  |  |  | - TechStack.jsx                 - KnowledgeGraph.jsx          |  |  |  |
|  |  |  | - Experience.jsx                - Projects.jsx                |  |  |  |
|  |  |  | - ProofOfWork.jsx               - BuilderDashboard.jsx        |  |  |  |
|  |  |  | - TechTimeline.jsx              - Contact.jsx & NarrativeMode |  |  |  |
|  |  |  +--------------------------------+--------------------------------+  |  |  |
|  |  +-----------------------------------|-----------------------------------+  |  |
|  +--------------------------------------|--------------------------------------+  |
|                                         |                                         |
|                      Lectura estática / Import JSON                               |
|                                         v                                         |
|  +-----------------------------------------------------------------------------+  |
|  |                           DATA LAYER (data/*.json)                          |  |
|  |  profile.json | skills.json | experience.json | certifications.json        |  |
|  |  projects.json | knowledge-graph.json | timeline.json | narrative.json      |  |
|  +-----------------------------------------------------------------------------+  |
+-----------------------------------------------------------------------------------+
                                          |
                        Alojado en GitHub Pages (Servidor Estático)
```

**Capas y Responsabilidades:**  
- `app/`: Enrutamiento y estructura HTML raíz (App Router layout y page).
- `components/`: Bloques de interfaz de usuario desacoplados, autónomos y reutilizables.
- `contexts/`: Proveedores de estado global (Idiomas `es`/`en`).
- `data/`: Almacenamiento primario de la Single Source of Truth del contenido del portafolio.
- `integrations/`: Normalización de estructuras de datos provenientes de APIs como Credly o GitHub.

**Flujo completo de datos:**  
1. Al compilar o ejecutar el cliente, los componentes importan los JSON de `data/`.
2. El componente solicita la variante de idioma activa (`es` o `en`) desde `useLang()`.
3. El componente renderiza los elementos HTML con clases de Tailwind CSS e integra animaciones de entrada con Framer Motion / Intersection Observer.

**Patrones utilizados:**  
- **Provider Pattern:** Para la inyección de contexto de idioma en todo el árbol de componentes.
- **Atomic & Modular Component Architecture:** Dividido en componentes orientados a una única responsabilidad.
- **Stateless UI Design:** Componentes de presentación impulsados por props puras extraídas de JSON.
- **Custom Hooks:** Para encapsulación de lógica de efectos de scroll, visibilidad en pantalla e impresión de texto.

---

# Stack Tecnológico

**Framework:** Next.js 14.2.3 (App Router con exportación estática `output: 'export'`)  
**Lenguaje:** JavaScript (ES6+ / JSX) / TypeScript (^5.0.0 para configuración e integraciones)  
**Base de datos:** N/A (JSON estático local-first)  
**ORM:** N/A  
**Frontend:** React 18, Next.js 14, Framer Motion (^12.38.0), Lenis Scroll (^1.3.23), Lucide React (^1.16.0), Tailwind CSS v4 (`@tailwindcss/postcss` ^4.3.0)  
**Backend:** N/A (Static Export)  
**Infraestructura:** Static Web Hosting  
**Hosting:** GitHub Pages (`https://xaviaerox.github.io/portfolio/`)  
**CI/CD:** GitHub Actions / GitHub Pages Deployment Pipeline  
**Herramientas:** Node.js, npm, PostCSS, ESLint  
**Dependencias importantes:**
- `next`: 14.2.3
- `react`: ^18.0.0
- `react-dom`: ^18.0.0
- `framer-motion`: ^12.38.0
- `lenis`: ^1.3.23
- `lucide-react`: ^1.16.0
- `tailwindcss`: ^4.3.0
- `@tailwindcss/postcss`: ^4.3.0

---

# Estructura del Repositorio

```
portfolio/
├── .github/              # Workflows de GitHub Actions para despliegue estático
├── app/                  # Next.js App Router
│   ├── globals.css       # CSS global, directivas Tailwind v4, keyframes y fuentes
│   ├── icon.png          # Favicon de la aplicación
│   ├── layout.jsx        # Root Layout: HTML base, tipografías Google (Syne, JetBrains, Space) y SEO Metadata
│   └── page.jsx          # Página principal SPA: Orquestación de componentes y Lenis Smooth Scroll
├── components/           # Componentes UI reutilizables de la portafolio V2
│   ├── About.jsx             # Sección Biografía, filosofía y rasgos
│   ├── BuilderDashboard.jsx  # Dashboard interactivo con telemetría de proyectos
│   ├── CertificationTree.jsx # Árbol interactivo de certificaciones agrupadas por proveedor
│   ├── Certifications.jsx    # Vista alternativa/adicional de certificaciones
│   ├── Contact.jsx           # Sección de contacto con botón interactivo de copiar email
│   ├── Experience.jsx        # Timeline interactivo de trayectoria laboral
│   ├── Footer.jsx            # Pie de página y derechos
│   ├── Hero.jsx              # Hero principal con partículas y máquina de escribir
│   ├── KnowledgeGraph.jsx    # Red/Grafo interactivo de conceptos técnicos
│   ├── NarrativeMode.jsx     # Tour narrativo guiado e interactivo
│   ├── Nav.jsx               # Barra de navegación flotante y responsive
│   ├── ParticleField.jsx     # Campo de partículas Canvas 2D
│   ├── Projects.jsx          # Catálogo de proyectos destacados con efectos de brillo
│   ├── ProofOfWork.jsx       # Métricas de código, terminal e hitos técnicos
│   ├── SectionLabel.jsx      # Indicadores etiquetados numéricos de sección
│   ├── Skills.jsx            # Gráficos de barras de nivel y competencias
│   ├── TechStack.jsx         # Grilla de tecnologías filtrables por categoría
│   └── TechTimeline.jsx      # Evolución temporal cronológica de tecnologías (2012-2026)
├── contexts/             # Contextos de React
│   └── LangContext.jsx   # Proveedor de estado global de idioma ('es' | 'en') y hook useLang
├── data/                 # Capa de datos JSON (Single Source of Content Truth)
│   ├── achievements.json     # Logros e hitos clave
│   ├── certifications.json   # Certificaciones, habilidades asociadas y enlaces verificables
│   ├── experience.json       # Roles, empresas, períodos, descripciones y logros
│   ├── github.json           # Datos e integraciones de repositorios GitHub
│   ├── knowledge-graph.json # Nodos y enlaces del grafo de conocimiento técnico
│   ├── learning-paths.json   # Rutas de aprendizaje e hitos formativos
│   ├── narrative.json        # Pasos del tour narrativo guiado
│   ├── profile.json          # Información personal, bio, lema, filosofía y estadísticas
│   ├── projects.json         # Proyectos (Queryclin, StockFlow, Solutech, Blog) y métricas
│   ├── providers.json        # Metadatos de proveedores de certificación (Google, IBM, etc.)
│   ├── skills.json           # Stack tecnológico, niveles, hard/soft skills y especializaciones
│   ├── social.json           # Enlaces a redes sociales y perfiles
│   └── timeline.json         # Eventos históricos de la trayectoria desde 2012
├── integrations/         # Normalizadores y mapeadores de APIs externas
│   ├── credly/           # Mapeador de credenciales Credly (config, mapper, types)
│   └── github/           # Mapeador de actividad de GitHub (config, mapper, types)
├── public/               # Archivos estáticos servidos directamente (imágenes, iconos, etc.)
├── AGENT.md              # Especificaciones de diseño, objetivos visuales y directivas para desarrolladores/agentes
├── next.config.js        # Configuración de Next.js (output: 'export', imágenes no optimizadas para export estático)
├── package.json          # Manifiesto de dependencias y scripts npm (`dev`, `build`, `start`, `lint`)
├── postcss.config.js     # Configuración de PostCSS con Tailwind v4
├── portfolio.jsx         # Implementación monolítica previa (conservada como referencia histórica)
├── RULES.md              # Reglas arquitectónicas, de rendimiento y diseño del proyecto
└── tailwind.config.js    # Configuración de Tailwind CSS
```

**Archivos críticos:**  
- [app/page.jsx](file:///c:/Users/Xaviaerox/Documents/GitHub/portfolio/app/page.jsx): Entrada principal del árbol de componentes y orquestador del scroll.
- [app/layout.jsx](file:///c:/Users/Xaviaerox/Documents/GitHub/portfolio/app/layout.jsx): Definición de metadatos SEO y carga de tipografías globales.
- [contexts/LangContext.jsx](file:///c:/Users/Xaviaerox/Documents/GitHub/portfolio/contexts/LangContext.jsx): Gestión del idioma.
- [next.config.js](file:///c:/Users/Xaviaerox/Documents/GitHub/portfolio/next.config.js): Define el modo de exportación estática imprescindible para GitHub Pages.

---

# Componentes Principales

| Componente | Responsabilidad | Relaciones / Dependencias |
| :--- | :--- | :--- |
| **Nav** | Barra de navegación fija con cambio de sección fluido y CTA de contacto. | Consume `contexts/LangContext` |
| **Hero** | Primer impacto visual con partículas Canvas, maquina de escribir y llamadas a la acción. | `ParticleField`, `data/profile.json`, `LangContext` |
| **About** | Muestra biografía, filosofía, trayectoria y tarjetas de rasgos/enfoques técnicos. | `SectionLabel`, `data/profile.json`, `LangContext` |
| **TechStack** | Grilla interactiva de tecnologías filtrable por categoría con barras de nivel. | `SectionLabel`, `data/skills.json`, `LangContext` |
| **Experience** | Timeline vertical cronológico de puestos de trabajo con detalles expandibles. | `SectionLabel`, `data/experience.json`, `LangContext` |
| **CertificationTree** | Visualización en árbol de certificaciones agrupadas por proveedor con enlaces. | `SectionLabel`, `data/certifications.json`, `LangContext` |
| **KnowledgeGraph** | Grafo conceptual interactivo interconectando nodos de especialización técnica. | `SectionLabel`, `data/knowledge-graph.json`, `LangContext` |
| **Projects** | Tarjetas premium que exponen los proyectos destacados (Queryclin, StockFlow, etc.). | `SectionLabel`, `data/projects.json`, `LangContext` |
| **Skills** | Barras de competencias clave, etiquetas de habilidades blandas y especializaciones. | `SectionLabel`, `data/skills.json`, `LangContext` |
| **ProofOfWork** | Demostración visual de código, métricas operativas y filosofía de desarrollo. | `SectionLabel`, `data/github.json`, `LangContext` |
| **TechTimeline** | Hitos históricos de evolución tecnológica desde el año 2012 al presente. | `SectionLabel`, `data/timeline.json`, `LangContext` |
| **BuilderDashboard** | Panel interactivo con estadísticas y telemetría de desarrollo. | `SectionLabel`, `data/profile.json`, `LangContext` |
| **Contact** | Formulario/Sección final de contacto con utilidad para copiar email al portapapeles. | `SectionLabel`, `data/profile.json`, `LangContext` |
| **Footer** | Cierre de página con branding y copyright. | `LangContext` |
| **NarrativeMode** | Modal/Overlay interactivo que guía al usuario por la historia profesional. | `data/narrative.json`, `LangContext` |

---

# Flujo de Funcionamiento

**Paso a paso de ejecución:**

1. **Solicitud Inicial:** El usuario accede a `https://xaviaerox.github.io/portfolio/`. El servidor web de GitHub Pages entrega el documento `index.html` estático previamente generado por Next.js (`npm run build`).
2. **Hidratación y Fuentes:** El navegador ejecuta los paquetes JavaScript de React y Next.js. `app/layout.jsx` aplica las fuentes de Google Fonts (Syne, JetBrains Mono, Space Mono) mediante CSS variables.
3. **Inicialización de Contexto e Idioma:** `LangProvider` establece el idioma inicial (`es` por defecto).
4. **Inicio de Lenis Scroll:** En `app/page.jsx`, el efecto `useEffect` inicializa la instancia de `Lenis`, registrando el bucle `requestAnimationFrame` para suavizar el desplazamiento.
5. **Renderizado de Secciones:**
   - `Hero` inicia la animación de partículas en Canvas y el hook `useTypewriter` imprime la frase descriptiva.
   - A medida que el usuario se desplaza, los observadores de intersección (`useInView`) activan las animaciones de revelado progresivo de `About`, `TechStack`, `Experience`, `CertificationTree`, `KnowledgeGraph`, `Projects` y `Skills`.
6. **Interacciones del Usuario:**
   - **Filtros en TechStack:** El usuario hace clic en una categoría (ej. "Seguridad") y el estado local filtra las tecnologías presentadas en la grilla.
   - **Expansión en Experiencia / Certificaciones:** Al pulsar en un nodo o tarjeta, el estado `expanded` se actualiza y muestra los detalles ocultos, logros y tags de habilidades.
   - **Copia de Email en Contacto:** Al pulsar la tarjeta de email en `Contact`, la Web API `navigator.clipboard.writeText` guarda la dirección en el portapapeles y activa el estado `copied` durante 2 segundos.

---

# Modelo de Datos

## 1. Entidad Perfil (`data/profile.json`)
Contiene datos personales, biografía, lema, estadísticas y tarjetas de filosofía (en `es` y `en`).

## 2. Entidad Habilidades (`data/skills.json`)
- `tech_stack`: Array de objetos `{ name, cat, level, color }`.
- `hard_skills`: Array de objetos `{ name, level }`.
- `soft_skills`: Array de cadenas de texto.
- `specializations`: Array de cadenas con áreas de alta especialidad.

## 3. Entidad Experiencia (`data/experience.json`)
Array de objetos:
- `id`: Identificador único (ej. `"exp-1"`).
- `company`: Nombre de la empresa u organización.
- `role_es` / `role_en`: Cargo desempeñado.
- `period`: Rango temporal (ej. `"2024 – Presente"`).
- `location`: Ubicación o modalidad.
- `description_es` / `description_en`: Resumen ejecutivo del rol.
- `stack`: Lista de tecnologías utilizadas.
- `achievements_es` / `achievements_en`: Logros cuantificables.
- `color`: Código de color distintivo en formato Hex.

## 4. Entidad Certificaciones (`data/certifications.json`)
Estructura en árbol agrupada por entidad emisora:
- `id`: Identificador (ej. `"cert-google"`).
- `provider`: Nombre del emisor (Google, IBM, Cisco, etc.).
- `color` / `icon`: Identidad visual.
- `items`: Colección de certificaciones individuales conteniendo `name`, `year`, `skills` y enlace de verificación `url`.

## 5. Entidad Proyectos (`data/projects.json`)
- `id`: Identificador único.
- `name`: Nombre del proyecto (Queryclin, StockFlow, Solutech, Solutech Blog).
- `tagline_es` / `tagline_en`: Subtítulo descriptivo.
- `description_es` / `description_en`: Explicación detallada.
- `stack`: Tecnologías utilizadas.
- `highlights_es` / `highlights_en`: Puntos clave.
- `color` / `gradient`: Estilos visuales.
- `url` / `github`: Enlaces al proyecto activo y al código fuente.

---

# API

El proyecto **no dispone de API REST/GraphQL de backend propia** debido a su naturaleza de exportación estática (Jamstack).

**Integraciones de Datos Externas (`integrations/`):**
- **Credly Integration (`integrations/credly/`):** Contiene utilidades de configuración y mapeadores (`mapper.js`) para transformar respuestas de la API pública/badges de Credly al formato normalizado de certificaciones de la aplicación.
- **GitHub Integration (`integrations/github/`):** Contiene utilidades (`mapper.js`) para procesar datos de repositorios y actividad pública de la API de GitHub.

---

# Reglas de Negocio

1. **Arquitectura 100% Client-Side:** Ninguna funcionalidad puede requerir ejecución de código Node.js en servidor en runtime (sin SSR dinámico), garantizando la compatibilidad con GitHub Pages.
2. **Soporte Multilingüe (i18n):** Todo el contenido de la interfaz debe leer del contexto `LangContext` e incluir variantes para español (`es`) e inglés (`en`).
3. **Consistencia Visual y Performance:** Las animaciones deben mantenerse a 60 FPS sin bloquear el hilo principal de renderizado.
4. **Diseño Adaptativo (Mobile-First / Responsive):** La disposición debe adaptarse fluidamente a pantallas móviles, tablets y monitores de alta resolución.
5. **Formato Verificable:** Todas las certificaciones y proyectos destacados deben incluir enlaces directos a sus credenciales oficiales o repositorios públicos siempre que estén disponibles.

---

# Configuración

**Archivos de configuración requeridos:**
- `next.config.js`:
  ```javascript
  /** @type {import('next').NextConfig} */
  const nextConfig = {
    output: 'export',
    images: { unoptimized: true },
  };
  module.exports = nextConfig;
  ```
- `postcss.config.js`:
  ```javascript
  module.exports = {
    plugins: {
      '@tailwindcss/postcss': {},
    },
  };
  ```
- `package.json`: Scripts de npm:
  - `npm run dev`: Inicia el servidor local de desarrollo Next.js.
  - `npm run build`: Genera la exportación estática compilada en la carpeta `out/`.
  - `npm run start`: Servidor Next.js (no aplicable para GitHub Pages).
  - `npm run lint`: Ejecuta la verificación estática de ESLint.

**Variables de Entorno:**  
Actualmente el proyecto no requiere variables de entorno obligatorias `.env` para el build estático base.

---

# Seguridad

1. **Superficie de Ataque Nula en Backend:** Al exportarse como sitio estático sin servidor ni bases de datos activas, se eliminan vectores de ataque comunes como SQL Injection, RCE o SSRF.
2. **Protección de Enlaces Externos:** Todos los hipervínculos salientes utilizan atributos de seguridad `target="_blank"` y `rel="noopener noreferrer"`.
3. **Gestión de Secretos:** No se incluyen claves API privadas ni credenciales sensibles en el código fuente ni en los archivos JSON.

---

# Rendimiento

**Optimización existente:**
- Exportación estática HTML/JS pre-compilada.
- Scroll suave optimizado con `Lenis` ejecutado dentro de `requestAnimationFrame`.
- Uso de `IntersectionObserver` (`useInView`) para diferir animaciones hasta que los componentes entren en el viewport.
- Carga eficiente de tipografías desde Google Fonts con la propiedad `display: 'swap'`.

**Cuellos de botella potenciales:**
- Carga de múltiples componentes visuales complejos en una sola página (Single Page Scrolling).
- Manejo intensivo de partículas Canvas si se incrementa el número de nodos.

**Posibles mejoras:**
- Implementar `React.lazy` / `next/dynamic` para carga diferida de componentes pesados como `KnowledgeGraph` o `BuilderDashboard`.

---

# Estado Actual

**Qué funciona correctamente:**
- Toda la estructura V2 del portafolio (Hero, About, TechStack, Experience, CertificationTree, KnowledgeGraph, Projects, Skills, ProofOfWork, TechTimeline, BuilderDashboard, Contact, Footer, NarrativeMode).
- Cambio de idioma `es`/`en` en tiempo real.
- Desplazamiento suave con Lenis Scroll.
- Despliegue estático automatizado en GitHub Pages.

**Qué está parcialmente implementado / Deuda técnica:**
- Los módulos de integración (`integrations/credly` e `integrations/github`) cuentan con mapeadores funcionales pero su ejecución es mediante datos sincronizados en build/JSON local.
- Archivo legacy `portfolio.jsx` presente en la raíz (conservado como referencia).

---

# Roadmap

1. **Automatización de Sync de Badges:** Implementar un script de CI (GitHub Action) que consulte automáticamente la API de Credly y actualice `data/certifications.json` antes de compilar.
2. **Integración 3D Optativa:** Evaluar la incorporación de elementos 3D sutiles con React Three Fiber / Three.js en la sección Hero o KnowledgeGraph si no compromete la tasa de frames en dispositivos móviles.
3. **Migración progresiva a TypeScript strict en componentes:** Tipar formalmente todas las props de los componentes de la carpeta `components/`.

---

# Decisiones Técnicas

| Fecha | Descripción | Motivo | Alternativas Descartadas | Consecuencias |
| :--- | :--- | :--- | :--- | :--- |
| **2026-06-23** | Migración a Next.js App Router (V2 Architecture) | Modularizar la aplicación monolítica `portfolio.jsx` en componentes React limpios y escalables. | React SPA con Vite, Gatsby. | Arquitectura enterprise limpia, fácil mantenimiento y excelente rendimiento en build estático. |
| **2026-06-23** | Exportación estática (`output: 'export'`) | Permitir el alojamiento gratuito, rápido y seguro en GitHub Pages. | Vercel Serverless Functions, SSR en VPS. | Cero costes de hosting, alta disponibilidad y máxima seguridad sin servidor backend. |
| **2026-06-23** | Adición de Lenis Scroll | Ofrecer una experiencia de desplazamiento suave de nivel cinematográfico en toda la página single-page. | Native CSS Smooth Scroll, GSAP ScrollSmoother. | Desplazamiento ultra fluido sin añadir bibliotecas pesadas. |
| **2026-07-31** | Creación de `PROJECT_CONTEXT.md` | Establecer la Single Source of Truth (SSOT) del proyecto para agentes de Inteligencia Artificial. | Documentación dispersa en README o wikis externas. | Cualquier modelo LLM o agente IA puede comprender la totalidad del sistema al instante. |

---

# Problemas Conocidos

1. **Optimización de imágenes en Next.js Static Export:** La etiqueta `<Image />` de Next.js requiere `images: { unoptimized: true }` en `next.config.js` debido a la ausencia de servidor Node.js para optimización al vuelo en GitHub Pages.
2. **Presencia de archivo legacy:** `portfolio.jsx` permanece en el directorio raíz como histórico de la fase 1.

---

# Historial Relevante

- **Evolución V1 a V2:** Transición de prototipo monolítico a arquitectura modular basada en Next.js 14 App Router, división en componentes UI reutilizables (`components/`), contextualización de idioma (`contexts/LangContext.jsx`), sistema de datos estáticos (`data/*.json`) y adición de secciones avanzadas (`CertificationTree`, `KnowledgeGraph`, `TechTimeline`, `ProofOfWork`, `BuilderDashboard`, `NarrativeMode`).

---

# Convenciones del Proyecto

- **Naming:** 
  - Componentes React: `PascalCase.jsx` (ej. `CertificationTree.jsx`).
  - Archivos de datos: `kebab-case.json` (ej. `knowledge-graph.json`).
  - Funciones y variables: `camelCase`.
- **Arquitectura:** Separación estricta de responsabilidades entre Capa de Datos (`data/`), Lógica de Estado (`contexts/`) e Interfaz Gráfica (`components/`).
- **Estilo de código:** Código limpio, sin librerías pesadas innecesarias, formateo consistente con ESLint.
- **Motion Design:** Transiciones suaves, uso moderado de transparencias glassmorphism, esquemas de color oscuros/futuristas con acentos neón tail-made.

---

# Guía para Agentes IA

**Instrucciones específicas:**
- **ACTUALIZACIÓN OBLIGATORIA:** Antes de finalizar cualquier tarea (implementación, refactorización, corrección de bugs, modificación de estructuras de datos), **DEBES actualizar `PROJECT_CONTEXT.md`**.
- **Compatibilidad con GitHub Pages:** NUNCA introduzcas código de servidor (SSR, API Routes dinámicas de Next.js, operaciones de sistema de archivos en tiempo de ejecución del navegador) que rompa la exportación estática (`output: 'export'`).
- **Separación de Datos:** NUNCA insertes contenido de texto o información personal de forma hardcodeada dentro de los componentes JSX. Utiliza siempre los archivos JSON correspondientes en la carpeta `data/`.
- **Tipado e Idioma:** Asegúrate de mantener las entradas bilingües (`_es` / `_en` o estructuras `es` / `en`) en todos los archivos de `data/`.

---

# Resumen Ejecutivo

**Portfolio Xavi Alonso (V2)** es una plataforma web profesional desarrollada con **Next.js 14, React 18, Framer Motion y Tailwind CSS v4**, diseñada bajo el paradigma **Jamstack (Static Site Export)** para su despliegue en **GitHub Pages**. 

El sistema presenta una arquitectura modular totalmente desacoplada en la que el contenido (biografía, trayectoria, certificaciones, proyectos y habilidades) reside en archivos JSON estáticos (`data/*.json`) con soporte nativo para internacionalización (`es`/`en`). Destaca por una experiencia de navegación cinematográfica de página única con scroll suave impulsado por `Lenis Scroll`, componentes interactivos de alta complejidad visual (como árboles de certificación expandibles, grafos de conocimiento interconectados y dashboards de métricas) y un diseño futurista optimizado a 60 FPS. 

Cualquier actualización del portafolio debe preservar la compatibilidad estática, la separación entre datos e interfaz y la fidelidad técnica documentada en este archivo **PROJECT_CONTEXT.md**.
