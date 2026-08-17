const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

function checkVersions() {
  let hasErrors = false;

  // 1. Canonical source: package.json
  const packageJsonPath = path.join(rootDir, 'package.json');
  if (!fs.existsSync(packageJsonPath)) {
    console.error('❌ [ERROR] package.json no encontrado.');
    process.exit(1);
  }
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const canonicalVersion = packageJson.version;

  console.log(`📌 Fuente canónica (package.json): v${canonicalVersion}`);

  // 2. Check CHANGELOG.md
  const changelogPath = path.join(rootDir, 'CHANGELOG.md');
  if (fs.existsSync(changelogPath)) {
    const changelogContent = fs.readFileSync(changelogPath, 'utf8');
    const changelogMatch = changelogContent.match(/^##\s*\[(\d+\.\d+\.\d+)\]/m);
    if (changelogMatch) {
      const changelogVersion = changelogMatch[1];
      if (changelogVersion !== canonicalVersion) {
        console.error(`❌ [ERROR DE INTEGRIDAD DE VERSIONADO] Discrepancia en CHANGELOG.md:`);
        console.error(`   Canonical (package.json): v${canonicalVersion}`);
        console.error(`   CHANGELOG.md última versión: v${changelogVersion}`);
        hasErrors = true;
      } else {
        console.log(`✓ CHANGELOG.md sincronizado: v${changelogVersion}`);
      }
    } else {
      console.warn(`⚠️ [WARNING] No se encontró cabecera de versión tipo ## [X.Y.Z] en CHANGELOG.md`);
    }
  }

  // 3. Check PROJECT_CONTEXT.md
  const contextPath = path.join(rootDir, 'PROJECT_CONTEXT.md');
  if (fs.existsSync(contextPath)) {
    const contextContent = fs.readFileSync(contextPath, 'utf8');
    const contextMatch = contextContent.match(/\*\*Versión actual:\*\*\s*(\d+\.\d+\.\d+)/i);
    if (contextMatch) {
      const contextVersion = contextMatch[1];
      if (contextVersion !== canonicalVersion) {
        console.error(`❌ [ERROR DE INTEGRIDAD DE VERSIONADO] Discrepancia en PROJECT_CONTEXT.md:`);
        console.error(`   Canonical (package.json): v${canonicalVersion}`);
        console.error(`   PROJECT_CONTEXT.md: v${contextVersion}`);
        hasErrors = true;
      } else {
        console.log(`✓ PROJECT_CONTEXT.md sincronizado: v${contextVersion}`);
      }
    } else {
      console.warn(`⚠️ [WARNING] No se encontró campo **Versión actual:** en PROJECT_CONTEXT.md`);
    }
  }

  if (hasErrors) {
    console.error('\n💥 FALLO DE INTEGRIDAD DE VERSIONADO DETECTADO.');
    process.exit(1);
  }

  console.log(`\n✅ VERIFICACIÓN DE INTEGRIDAD DE VERSIONADO CORRECTA (v${canonicalVersion}).`);
}

checkVersions();
