'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, ExternalLink, X, FileText, Eye, Sparkles } from 'lucide-react';
import { useLang } from '@/contexts/LangContext';

interface CVModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CVModal({ isOpen, onClose }: CVModalProps) {
  const { lang } = useLang();
  const [zoomPreview, setZoomPreview] = useState(false);

  const pdfUrl = `${process.env.NEXT_PUBLIC_BASE_PATH || ''}/cv/Xavi_Alonso_CV.pdf`;
  const pngUrl = `${process.env.NEXT_PUBLIC_BASE_PATH || ''}/cv/Xavi_Alonso_CV_preview.png`;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-brand-dark/90 backdrop-blur-xl font-mono">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-4xl max-h-[90vh] bg-[#090a1a] border border-brand-secondary/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col relative"
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

              <button
                onClick={onClose}
                aria-label="Cerrar modal de CV"
                className="text-white/40 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center justify-center bg-black/40">
              <div className="relative group max-w-2xl w-full border border-white/10 rounded-xl overflow-hidden shadow-2xl">
                <img
                  src={pngUrl}
                  alt="Xavi Alonso CV Preview"
                  className={`w-full h-auto transition-transform duration-300 ${
                    zoomPreview ? 'scale-125 cursor-zoom-out' : 'cursor-zoom-in'
                  }`}
                  onClick={() => setZoomPreview(!zoomPreview)}
                />
                <div className="absolute top-3 right-3 bg-brand-dark/80 backdrop-blur-md px-3 py-1.5 rounded-md text-[11px] text-white/70 flex items-center gap-2 pointer-events-none">
                  <Eye size={14} className="text-brand-secondary" />
                  <span>{lang === 'es' ? 'Clic para ampliar' : 'Click to zoom'}</span>
                </div>
              </div>
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
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/15 text-white px-4 py-2.5 rounded-lg text-xs font-bold transition-all"
                >
                  <ExternalLink size={14} />
                  <span>{lang === 'es' ? 'VER EN PESTAÑA' : 'OPEN IN TAB'}</span>
                </a>

                <a
                  href={pdfUrl}
                  download="Xavi_Alonso_CV.pdf"
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-brand-secondary hover:bg-brand-secondary/90 text-brand-dark px-5 py-2.5 rounded-lg text-xs font-bold transition-all shadow-lg shadow-brand-secondary/20"
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
