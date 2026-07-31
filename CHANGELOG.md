# Changelog

Todos los cambios notables en este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [0.2.0] - 2026-07-31

### 🚀 Añadido
- **TypeScript Estricto:** Migración completa de contexto `LangContext` y páginas a TypeScript (`.tsx`).
- **Validación con Zod Schemas:** Integración de validadores Zod para asegurar la calidad de datos JSON.
- **Búsqueda Global (Command Palette):** Implementación de modal cibernético `Ctrl + K` para filtrado omnibox.
- **Error Boundaries:** Envoltorios de captura de excepciones por sección en `app/page.tsx`.
- **Suite de Testing con Vitest:** Cobertura de pruebas unitarias automatizadas para esquemas y contratos de datos.
- **Persistencia de Idioma:** Sincronización automática de preferencia `es`/`en` con `localStorage` y detector del navegador.
- **Subcomponentización de Certificaciones:** Refactorización modular del árbol de certificaciones (`BadgeCard`, `BadgeModal`, `ProviderGroup`).

### ⚡ Optimizado
- **Dynamic Code-Splitting:** Dynamic imports con `next/dynamic` para diferir componentes pesados bajo el pliegue inicial.
- **Performance de ParticleField:** Soporte para `devicePixelRatio` scaling (Retina/4K) y throttling en resize.
- **GitHub Actions CI/CD:** Adición de pasos `type-check` y `test` previos al build y deploy estático.

### 🗑️ Eliminado
- Eliminación de archivos legacy descontinuados: `portfolio.jsx` y `components/Certifications.jsx`.

---

## [0.1.0] - 2026-06-23

### 🚀 Añadido
- Versión inicial v2 Evolution sobre Next.js 14 App Router, Lenis Scroll y Framer Motion.
