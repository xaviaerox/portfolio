export const metadata = {
  title: 'Portfolio - Xavi Alonso',
  description: 'Operador IT & Arquitecto de Infraestructura',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
