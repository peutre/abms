'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'

const navLinks = [
  { href: '/calendrier', label: 'Calendrier des sorties' },
  { href: '/especes', label: 'Plantes & Champignons' },
  { href: '/galerie', label: 'Galerie photos' },
  { href: '/comptes-rendus', label: 'Comptes rendus' },
  { href: '/a-propos', label: 'L\'association' },
  { href: '/contact', label: 'Contact' },
]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="bg-white border-b-2 border-foret-100 sticky top-0 z-50 shadow-sm">
      {/* Lien d'évitement pour accessibilité clavier */}
      <a
        href="#contenu-principal"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-foret-700 text-white px-4 py-2 rounded-lg z-50"
      >
        Aller au contenu principal
      </a>

      <div className="container-main">
        <div className="flex items-center justify-between h-20">
          {/* Logo / Nom de l'association */}
          <Link
            href="/"
            className="flex items-center gap-3 no-underline group"
            aria-label="ABMS — Retour à l'accueil"
          >
            <Image
              src="/logo.png"
              alt="Logo de l'Association Botanique et Mycologique de la Siagne"
              width={56}
              height={56}
              className="flex-shrink-0 group-hover:scale-105 transition-transform duration-200"
              priority
            />
            <div>
              <div className="font-serif font-bold text-foret-700 text-lg leading-tight group-hover:text-foret-600">
                ABMS
              </div>
              <div className="text-sm text-gray-500 leading-tight hidden sm:block">
                Botanique & Mycologie · Siagne
              </div>
            </div>
          </Link>

          {/* Navigation desktop */}
          <nav aria-label="Navigation principale" className="hidden lg:block">
            <ul className="flex items-center gap-0.5" role="list">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="px-3 py-2 rounded-md text-[13px] font-normal tracking-wide text-gray-600
                               hover:bg-foret-50 hover:text-foret-700 whitespace-nowrap
                               no-underline transition-colors duration-150 block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Bouton menu mobile */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden p-3 rounded-lg hover:bg-foret-50 text-gray-700 hover:text-foret-700"
            aria-expanded={menuOpen}
            aria-controls="menu-mobile"
            aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          >
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" aria-hidden="true">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      stroke="currentColor" d="M6 18L18 6M6 6l12 12"/>
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      stroke="currentColor" d="M4 6h16M4 12h16M4 18h16"/>
              )}
            </svg>
          </button>
        </div>

        {/* Menu mobile */}
        {menuOpen && (
          <nav id="menu-mobile" aria-label="Menu mobile">
            <ul className="pb-4 space-y-1 border-t border-foret-100 pt-3" role="list">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="block px-4 py-3 rounded-lg text-base font-medium text-gray-700
                               hover:bg-foret-50 hover:text-foret-700 no-underline transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </header>
  )
}
