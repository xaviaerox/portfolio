import './globals.css';
import React from 'react';
import type { Metadata } from 'next';
import { Syne, JetBrains_Mono, Space_Mono } from 'next/font/google';

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

const spaceMono = Space_Mono({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-space-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Xavi Alonso | Operador IT & Arquitecto de Infraestructura',
  description:
    'Portafolio profesional de Xavi Alonso, especialista en infraestructuras críticas, seguridad operativa y alta disponibilidad. Creador de Queryclin y StockFlow.',
  keywords: [
    'Xavi Alonso',
    'IT Operator',
    'Operador IT',
    'Infrastructure Architect',
    'Arquitecto de Infraestructura',
    'Alta Disponibilidad',
    'Seguridad Operativa',
    'Ciberseguridad',
    'Dolibarr ERP',
    'Queryclin',
    'StockFlow',
    'Sistemas Críticos',
    'Proxmox',
    'Zero Trust',
    'DevOps',
    'Desarrollador Web',
  ],
  authors: [{ name: 'Xavi Alonso' }],
  creator: 'Xavi Alonso',
  publisher: 'Xavi Alonso',
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://xaviaerox.github.io/portfolio/',
  },
  openGraph: {
    title: 'Xavi Alonso | Operador IT & Arquitecto de Infraestructura',
    description:
      'Especialista en infraestructuras críticas y seguridad operativa con más de 12 años de trayectoria. Conoce mis proyectos como Queryclin y StockFlow.',
    url: 'https://xaviaerox.github.io/portfolio/',
    siteName: 'Xavi Alonso Portfolio',
    images: [
      {
        url: 'https://xaviaerox.github.io/portfolio/xavi-alonso.jpg',
        width: 800,
        height: 800,
        alt: 'Xavi Alonso',
      },
    ],
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Xavi Alonso | Operador IT & Arquitecto de Infraestructura',
    description:
      'Especialista en infraestructuras críticas y seguridad operativa con más de 12 años de trayectoria. Conoce mis proyectos como Queryclin y StockFlow.',
    images: ['https://xaviaerox.github.io/portfolio/xavi-alonso.jpg'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${syne.variable} ${jetbrainsMono.variable} ${spaceMono.variable}`}>
      <body className="antialiased font-sans">{children}</body>
    </html>
  );
}
