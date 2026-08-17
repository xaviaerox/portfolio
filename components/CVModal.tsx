'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, ExternalLink, X, FileText, Eye, Sparkles, AlertCircle } from 'lucide-react';
import { useLang } from '@/contexts/LangContext';

interface CVModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CVModal({ isOpen, onClose }: CVModalProps) {
  const { lang } = useLang();
  const [zoomPreview, setZoomPreview] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [pdfUrl, setPdfUrl] = useState('/cv/Xavi_Alonso_CV.pdf');
  const [pngUrl, setPngUrl] = useState('/cv/Xavi_Alonso_CV_preview.png');
  const [viewMode, setViewMode] = useState<'pdf' | 'img'>('pdf');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
      let prefix = basePath;
      if (!prefix) {
        const parts = window.location.pathname.split('/').filter(Boolean);
        if (parts.length > 0 && !parts[0].includes('.')) {
          prefix = `/${parts[0]}`;
        }
      }
      const cleanPrefix = prefix.endsWith('/') ? prefix.slice(0, -1) : prefix;
      setPdfUrl(`${cleanPrefix}/cv/Xavi_Alonso_CV.pdf`);
      setPngUrl(`${cleanPrefix}/cv/Xavi_Alonso_CV_preview.png`);
    }
  }, []);

  const handleOpenNewTab = (e: React.MouseEvent) => {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      window.open(pdfUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-brand-dark/90 backdrop-blur-xl font-mono">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-5xl max-h-[92vh] bg-[#090a1a] border border-brand-secondary/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col relative"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-brand-secondary/15 text-brand-secondary">
                  <FileText size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-syne">
                    {lang === 'es' ? 'Currículum Vitae Oficial' : 'Official Resume / CV'}
                  </h3>
                  <span className="text-xs text-white/50 flex items-center gap-1.5 mt-0.5">
                    <Sparkles size={12} className="text-amber-400" />
                    {lang === 'es' ? 'Compilado con RenderCV (Engine Typst/LaTeX)' : 'Compiled via RenderCV (Typst/LaTeX Engine)'}
                  </span>
                </div>
              </div>

              {/* View Mode Toggle & Close */}
              <div className="flex items-center gap-3">
                <div className="flex bg-white/5 p-1 rounded-lg border border-white/10 text-xs">
                  <button
                    onClick={() => setViewMode('pdf')}
                    className={`px-3 py-1 rounded transition-colors ${
                      viewMode === 'pdf' ? 'bg-brand-secondary text-brand-dark font-bold' : 'text-white/60 hover:text-white'
                    }`}
                  >
                    PDF
                  </button>
                  <button
                    onClick={() => setViewMode('img')}
                    className={`px-3 py-1 rounded transition-colors ${
                      viewMode === 'img' ? 'bg-brand-secondary text-brand-dark font-bold' : 'text-white/60 hover:text-white'
                    }`}
                  >
                    {lang === 'es' ? 'IMAGEN' : 'IMAGE'}
                  </button>
                </div>

                <button
                  onClick={onClose}
                  aria-label="Cerrar modal de CV"
                  className="text-white/40 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col items-center justify-center bg-black/40 min-h-[450px]">
              {viewMode === 'pdf' ? (
                <div className="w-full h-[65vh] min-h-[400px] border border-white/10 rounded-xl overflow-hidden shadow-2xl bg-white/[0.02]">
                  <object
                    data={pdfUrl}
                    type="application/pdf"
                    className="w-full h-full"
                  >
                    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                      <FileText size={48} className="text-brand-secondary mb-4" />
                      <p className="text-sm text-white/80 mb-2">
                        {lang === 'es'
                          ? 'Tu navegador no permite la vista previa directa del PDF.'
                          : 'Your browser does not support inline PDF viewing.'}
                      </p>
                      <button
                        onClick={handleOpenNewTab}
                        className="mt-4 px-4 py-2 bg-brand-secondary text-brand-dark font-bold rounded-lg text-xs cursor-pointer"
                      >
                        {lang === 'es' ? 'Abrir PDF en nueva pestaña' : 'Open PDF in new tab'}
                      </button>
                    </div>
                  </object>
                </div>
              ) : (
                <div className="relative group max-w-2xl w-full border border-white/10 rounded-xl overflow-hidden shadow-2xl">
                  {!imgError ? (
                    <>
                      <img
                        src={pngUrl}
                        alt="Xavi Alonso CV Preview"
                        onError={() => setImgError(true)}
                        className={`w-full h-auto transition-transform duration-300 ${
                          zoomPreview ? 'scale-125 cursor-zoom-out' : 'cursor-zoom-in'
                        }`}
                        onClick={() => setZoomPreview(!zoomPreview)}
                      />
                      <div className="absolute top-3 right-3 bg-brand-dark/80 backdrop-blur-md px-3 py-1.5 rounded-md text-[11px] text-white/70 flex items-center gap-2 pointer-events-none">
                        <Eye size={14} className="text-brand-secondary" />
                        <span>{lang === 'es' ? 'Clic para ampliar' : 'Click to zoom'}</span>
                      </div>
                    </>
                  ) : (
                    <div className="p-12 text-center flex flex-col items-center justify-center">
                      <AlertCircle size={40} className="text-amber-400 mb-3" />
                      <p className="text-sm text-white/70">
                        {lang === 'es' ? 'Vista previa en imagen no disponible' : 'Image preview unavailable'}
                      </p>
                      <button
                        onClick={() => setViewMode('pdf')}
                        className="mt-4 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs"
                      >
                        {lang === 'es' ? 'Ver modo PDF' : 'Switch to PDF view'}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="px-6 py-4 border-t border-white/10 bg-white/[0.02] flex flex-wrap items-center justify-between gap-4">
              <span className="text-xs text-white/40 hidden sm:inline">
                Francisco Javier Alonso Fondón • Técnico Superior ASIR
              </span>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleOpenNewTab}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/15 text-white px-4 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer"
                >
                  <ExternalLink size={14} />
                  <span>{lang === 'es' ? 'VER EN PESTAÑA' : 'OPEN IN TAB'}</span>
                </a>

                <a
                  href={pdfUrl}
                  download="Xavi_Alonso_CV.pdf"
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-brand-secondary hover:bg-brand-secondary/90 text-brand-dark px-5 py-2.5 rounded-lg text-xs font-bold transition-all shadow-lg shadow-brand-secondary/20 cursor-pointer"
                >
                  <Download size={14} />
                  <span>{lang === 'es' ? 'DESCARGAR PDF' : 'DOWNLOAD PDF'}</span>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
