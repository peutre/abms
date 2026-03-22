import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-foret-700 text-white mt-16">
      <div className="container-main py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Colonne 1 : Présentation */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-white rounded-lg p-1">
                <Image
                  src="/logo.png"
                  alt="Logo ABMS"
                  width={44}
                  height={44}
                />
              </div>
              <h2 className="font-serif text-xl font-semibold text-white">
                ABMS
              </h2>
            </div>
            <p className="text-foret-100 leading-relaxed text-sm">
              Association Botanique et Mycologique de la Siagne — passionnés de plantes
              et de champignons dans les Alpes-Maritimes et le Var.
            </p>
          </div>

          {/* Colonne 2 : Navigation rapide */}
          <nav aria-label="Navigation secondaire">
            <h3 className="font-semibold text-white mb-4 text-base">Découvrir</h3>
            <ul className="space-y-2" role="list">
              {[
                { href: '/calendrier', label: 'Calendrier des sorties' },
                { href: '/especes', label: 'Plantes & Champignons' },
                { href: '/galerie', label: 'Galerie photos' },
                { href: '/comptes-rendus', label: 'Comptes rendus' },
                { href: '/a-propos', label: "L'association" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-foret-200 hover:text-white text-sm no-underline hover:underline transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Colonne 3 : Contact */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-base">Nous contacter</h3>
            <address className="not-italic text-foret-200 text-sm space-y-2">
              <p>Association Botanique et Mycologique de la Siagne</p>
              <p>Alpes-Maritimes (06) · Var (83)</p>
            </address>
            <Link
              href="/contact"
              className="btn-secondary mt-4 text-sm !py-2 !px-4"
              style={{ color: '#2D5016', background: '#F5F0E8' }}
            >
              Envoyer un message
            </Link>
          </div>
        </div>

        <div className="border-t border-foret-600 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-foret-300 text-sm">
            © {currentYear} Association Botanique et Mycologique de la Siagne — Tous droits réservés
          </p>
          <Link
            href="/admin"
            className="text-foret-400 hover:text-foret-200 text-sm no-underline hover:underline"
            aria-label="Accès à l'espace d'administration"
          >
            Administration
          </Link>
        </div>
      </div>
    </footer>
  )
}
