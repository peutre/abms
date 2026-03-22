import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'ABMS — Association Botanique et Mycologique de la Siagne',
    template: '%s | ABMS',
  },
  description: 'Association Botanique et Mycologique de la Siagne (ABMS06) — Découverte et étude des plantes et champignons des Alpes-Maritimes et du Var.',
  keywords: ['botanique', 'mycologie', 'champignons', 'plantes', 'Alpes-Maritimes', 'association', 'Siagne'],
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    siteName: 'ABMS — Association Botanique et Mycologique de la Siagne',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}
