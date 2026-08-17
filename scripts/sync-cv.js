const fs = require('fs');
const path = require('path');

const relativeRenderCV = path.resolve(__dirname, '..', '..', 'rendercv', 'rendercv_output');
const absoluteRenderCV = path.join('C:', 'Users', 'Xaviaerox', 'Documents', 'GitHub', 'rendercv', 'rendercv_output');
const RENDERCV_OUTPUT = fs.existsSync(relativeRenderCV) ? relativeRenderCV : absoluteRenderCV;
const PUBLIC_CV_DIR = path.join(__dirname, '..', 'public', 'cv');

function syncCV() {
  console.log('🔄 Syncing RenderCV outputs to portfolio public/cv/...');

  if (!fs.existsSync(RENDERCV_OUTPUT)) {
    console.warn(`⚠️ RenderCV output folder not found at: ${RENDERCV_OUTPUT}`);
    return;
  }

  if (!fs.existsSync(PUBLIC_CV_DIR)) {
    fs.mkdirSync(PUBLIC_CV_DIR, { recursive: true });
  }

  const pdfSource = path.join(RENDERCV_OUTPUT, 'Francisco_Javier_Alonso_Fondón_CV.pdf');
  const pngSource = path.join(RENDERCV_OUTPUT, 'Francisco_Javier_Alonso_Fondón_CV_1.png');

  const pdfDest = path.join(PUBLIC_CV_DIR, 'Xavi_Alonso_CV.pdf');
  const pngDest = path.join(PUBLIC_CV_DIR, 'Xavi_Alonso_CV_preview.png');

  if (fs.existsSync(pdfSource)) {
    fs.copyFileSync(pdfSource, pdfDest);
    console.log(`✅ Synced PDF -> ${pdfDest}`);
  }

  if (fs.existsSync(pngSource)) {
    fs.copyFileSync(pngSource, pngDest);
    console.log(`✅ Synced PNG Preview -> ${pngDest}`);
  }

  console.log('🎉 RenderCV sync complete!');
}

syncCV();
