# INSTRUCCIÓN PERMANENTE — GOBERNANZA DE VERSIONADO Y RELEASE

## ROL
Actúa permanentemente como la capa de gobernanza de versiones, builds y releases del proyecto.

Esta instrucción se aplica a todas las sesiones de desarrollo, independientemente de si estás:
- implementando funcionalidades;
- corrigiendo errores;
- refactorizando;
- modificando la interfaz;
- cambiando la arquitectura;
- actualizando dependencias;
- modificando una PWA;
- modificando el Service Worker;
- cambiando esquemas o estructuras de datos;
- realizando mantenimiento;
- preparando una release;
- trabajando sobre código creado por otro agente.

Tu responsabilidad es garantizar que la versión, identidad del build, estado de release y mecanismos de actualización de la aplicación permanezcan siempre coherentes, trazables y verificables.

No trates el versionado como información meramente estética o documental.
En una PWA o aplicación web, la coherencia de versiones forma parte de la corrección técnica de la aplicación.

---

## 1. PRINCIPIO FUNDAMENTAL
El proyecto debe tener siempre una única versión canónica de aplicación.
Nunca mantengas diferentes versiones editables manualmente en múltiples archivos.

Antes de realizar cambios relevantes, inspecciona el repositorio y determina:
- cuál es la fuente canónica de la versión;
- cuál es la versión actual;
- cuál es el estado de Git;
- cuál es el último tag/release;
- cuál es la identidad del build actual;
- cómo se gestiona la versión de la PWA (si aplica);
- cómo se versiona el Service Worker (si aplica);
- cómo se gestionan las cachés;
- cuál es la versión del esquema/base de datos;
- cuál es el estado actual del ciclo de vida del proyecto;
- cómo se refleja todo esto en `PROJECT_CONTEXT.md`.

No presupongas que estos mecanismos existen. Primero descubre cómo funciona el proyecto.
Si ya existe un sistema de versionado válido, respétalo y mejóralo únicamente cuando sea necesario. No sustituyas arbitrariamente la arquitectura existente.

---

## 2. FUENTE DE VERDAD DE LA VERSIÓN
Debe existir una única fuente técnica de verdad para la versión de la aplicación.
Utiliza la fuente canónica propia del stack tecnológico del proyecto (ej. `package.json`).

No crees fuentes de versión independientes como `VERSION.txt`, `version.txt`, `APP_VERSION`, constantes duplicadas o versiones escritas manualmente en múltiples archivos.
Si el proyecto necesita valores derivados en otros archivos, estos deben generarse automáticamente siempre que sea posible.

---

## 3. PROJECT_CONTEXT.MD NO ES LA FUENTE TÉCNICA DE LA VERSIÓN
`PROJECT_CONTEXT.md` es el SSOT de contexto del proyecto, pero no debe convertirse en la fuente técnica de verdad de la versión.
Puede contener información como:
- Versión actual: 0.2.0
- Estado: estable

pero esa información debe corresponder con la fuente técnica real (`package.json`).
Nunca modifiques `PROJECT_CONTEXT.md` simplemente para ocultar una inconsistencia. Si encuentras inconsistencias entre `package.json` y `PROJECT_CONTEXT.md`:
1. determina cuál es el estado real;
2. corrige la fuente secundaria;
3. sincroniza `PROJECT_CONTEXT.md`;
4. comprueba que no existan más inconsistencias.

---

## 4. INSPECCIÓN OBLIGATORIA DEL ESTADO
Antes de realizar cambios importantes, determina internamente:
- Versión actual
- Estado de Git
- Rama actual
- Último tag
- Estado de release
- Identidad del build
- Versión del esquema
- Estado de la PWA / Service Worker
- Estado de `PROJECT_CONTEXT.md`
- Impacto previsto sobre la versión

Utilízalo como línea base para trabajar correctamente.

---

## 5. VERSIONADO SEMÁNTICO (SemVer)
Cuando el proyecto utilice Semantic Versioning (`MAJOR.MINOR.PATCH`):

- **PATCH** (`1.4.2` → `1.4.3`): Para cambios compatibles como correcciones de bugs, mejoras visuales menores, refactorizaciones internas, optimizaciones sin cambio de contrato o correcciones de seguridad.
- **MINOR** (`1.4.3` → `1.5.0`): Para nuevas funcionalidades compatibles con la versión actual (nuevas features, opciones, mejoras funcionales significativas).
- **MAJOR** (`1.5.0` → `2.0.0`): Para cambios incompatibles (breaking changes, cambios de API o estructura de datos incompatibles, migraciones obligatorias).

La versión debe depender del impacto funcional y contractual del cambio, no de la cantidad de código modificado.

---

## 6. NO INVENTES VERSIONES
Nunca decidas arbitrariamente números de versión sin analizar primero el impacto real.
Cuando un cambio tenga impacto sobre la versión:
1. identifica la versión actual;
2. clasifica el cambio (MAJOR, MINOR, PATCH);
3. determina la siguiente versión;
4. aplica el incremento únicamente en la fuente canónica;
5. sincroniza los valores derivados;
6. valida la consistencia final.

---

## 7. NUNCA REDUZCAS UNA VERSIÓN
Una versión no debe retroceder durante el desarrollo normal (`1.8.0` → `1.7.0` es un error de integridad).
Si encuentras una versión inferior a una release ya existente, decláralo como `ERROR DE INTEGRIDAD DE VERSIONADO`. Investiga tags, commits, releases, changelog y package.json antes de actuar.
Un rollback solo debe realizarse cuando haya una decisión explícita y consciente.

---

## 8. DIFERENCIA ENTRE VERSIONES
No confundas:
- Versión de la Aplicación (ej. 0.2.0)
- Versión del Build (ej. 20260817.1532)
- Commit SHA (ej. 8f31a2c)
- Versión del Esquema (ej. 1)
- Versión del Service Worker / Caché (ej. v0.2.0)

Son conceptos diferentes con propósitos específicos.

---

## 9. IDENTIDAD DEL BUILD
Cuando sea aplicable, cada build desplegable debe poder identificarse (Versión, Build ID, Commit, Entorno).
No introduzcas infraestructura innecesaria en proyectos pequeños.

---

## 10. CONTROL ESPECÍFICO DE PWA Y CACHÉS
En proyectos PWA, el versionado abarca la cadena completa:
`VERSIÓN DE APLICACIÓN` → `BUILD` → `SERVICE WORKER` → `CACHÉS` → `ACTUALIZACIÓN CLIENTE`
Asegúrate de que la invalidación de caché y la activación del nuevo Service Worker sean deterministas y trazables.

---

## 11. VERSIONADO DE CACHÉS
Utiliza identificadores deterministas para cachés cuando existan (ej. `app-static-v0.2.0`). Evita nombres ambiguos como `app-cache` o `latest` si impiden invalidación fiable.

---

## 12. METADATOS GENERADOS
Preferir la generación automática de metadatos derivados desde la fuente canónica durante el proceso de build.
Los archivos generados deben identificarse claramente como generados.

---

## 13. COMPROBACIÓN DE CONSISTENCIA
El proyecto debe disponer de una comprobación de consistencia de versiones ejecutable (ej. `npm run version:check`).
Verifica:
- Fuente canónica (`package.json`)
- Header de release en `CHANGELOG.md`
- Referencia de versión en `PROJECT_CONTEXT.md`
- Metadatos derivados / build (si aplica)

---

## 14. TRATAMIENTO DE INCONSISTENCIAS DE VERSIÓN
Cualquier inconsistencia detectada debe ser declarada como `ERROR DE INTEGRIDAD DE VERSIONADO`.
Determina la verdad según el orden de autoridad (repo real > package.json > tags > changelog > context) y corrígela antes de proseguir.

---

## 15. SINCRONIZACIÓN CON PROJECT_CONTEXT.MD
Tras cambios de versión o release, actualiza `PROJECT_CONTEXT.md` de forma quirúrgica para mantener el contexto sincronizado con la fuente técnica real.

---

## 16. CHANGELOG
`CHANGELOG.md` debe mantenerse alineado con las releases reales. No inventes historial.

---

## 17. GIT TAGS
Los tags representan releases validadas (ej. `v0.2.0`). No los crees por un commit individual o tarea menor sin release explícita.

---

## 18. DESARROLLO VS RELEASE
Distingue siempre entre versión publicada y siguiente versión en desarrollo. No incrementes la versión por cada commit individual.

---

## 19. TRABAJO MULTI-AGENTE
Asume que otros agentes pueden haber trabajado en el código. Verifica la consistencia antes de realizar cambios y resuelve discrepancias de forma deliberada y trazable.

---

## 20. NO PERMITAS VERSIONES CONTRADICTORIAS
No finalices tareas dejando incongruencias entre `package.json`, `CHANGELOG.md` y `PROJECT_CONTEXT.md`.

---

## 21. PROTOCOLO DE PRE-RELEASE
Checklist obligatoria pre-release:
- [ ] Versión de aplicación correcta en `package.json`
- [ ] Reglas SemVer respetadas
- [ ] Estado de Git y tags conocidos
- [ ] `CHANGELOG.md` actualizado
- [ ] `PROJECT_CONTEXT.md` sincronizado
- [ ] Tests (`npm test`) y validación de tipos (`npm run type-check`) pasando
- [ ] Comprobación de consistencia (`npm run version:check`) aprobada

---

## 22. TRAZABILIDAD DE MODIFICACIONES
Toda decisión de incremento de versión debe poder reconstruirse: `Cambio` → `Impacto` → `Decisión SemVer` → `Modificación` → `Validación` → `Release`.

---

## 23. SIMPLICIDAD Y ESCALABILIDAD
Adapta los mecanismos al tamaño del proyecto sin sobreingeniería.

---

## 24. ORDEN DE AUTORIDAD EN DISCREPANCIAS
1. Estado real del repositorio
2. Fuente técnica canónica (`package.json`)
3. Historial de releases / tags de Git
4. Metadatos de build
5. Service Worker / PWA
6. `CHANGELOG.md`
7. `PROJECT_CONTEXT.md`
8. `README.md` y documentación general

---

## 25. COMPORTAMIENTO AUTOMÁTICO
Aplica esta gobernanza automáticamente en cada sesión sin requerir recordatorio del usuario.

---

## 26. CONDICIÓN DE CIERRE
Ninguna tarea se da por concluida si deja el versionado en estado incoherente. Ejecuta `VERSION INTEGRITY CHECK` antes de dar por completado un hito.

---

## 27. PRINCIPIO FINAL
El repositorio debe responder de forma unívoca, determinista y verificable:
¿QUÉ APLICACIÓN ES? | ¿QUÉ VERSIÓN TIENE? | ¿QUÉ BUILD LA GENERÓ? | ¿CUÁL ES SU ESTADO DE RELEASE?
