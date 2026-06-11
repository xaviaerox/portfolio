import './globals.css';
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

export const metadata = {
  title: 'Portfolio - Xavi Alonso',
  description: 'Operador IT & Arquitecto de Infraestructura',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={`${syne.variable} ${jetbrainsMono.variable} ${spaceMono.variable}`}>
      <body className="antialiased font-sans">{children}</body>
    </html>
  )
}
