import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "L'association — ABMS",
  description: "Découvrez l'Association Botanique et Mycologique de la Siagne : histoire, activités, adhésion et membres.",
}

export default function AProposPage() {
  return (
    <>
      {/* En-tête de page */}
      <section className="bg-foret-700 text-white py-14">
        <div className="container-main">
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white">
            L&apos;association
          </h1>
          <p className="text-foret-100 text-lg mt-3 max-w-2xl">
            L&apos;Association Botanique et Mycologique de la Siagne — qui sommes-nous, que faisons-nous ?
          </p>
        </div>
      </section>

      <div className="container-main py-12">
        <div className="max-w-3xl mx-auto">

          {/* Présentation */}
          <section aria-labelledby="presentation">
            <h2 id="presentation" className="text-2xl font-serif font-semibold text-foret-700 mb-6">
              Qui sommes-nous ?
            </h2>
            <div className="space-y-4 text-gray-700 text-lg leading-relaxed">
              <p>
                L&apos;Association Botanique et Mycologique de la Siagne (ABMS06) est une association
                à but non lucratif fondée par des passionnés de la nature dans les Alpes-Maritimes.
              </p>
              <p>
                Notre objectif est de <strong>rassembler des personnes de tous niveaux</strong> autour
                de la découverte et de l&apos;étude des plantes sauvages et des champignons de notre
                belle région méditerranéenne.
              </p>
              <p>
                Nous organisons régulièrement des <strong>sorties sur le terrain</strong> encadrées
                par des membres expérimentés, dans une atmosphère conviviale et pédagogique. Débutants
                comme passionnés confirmés y trouvent leur compte.
              </p>
            </div>
          </section>

          <hr className="border-foret-100 my-10" />

          {/* Nos activités */}
          <section aria-labelledby="activites">
            <h2 id="activites" className="text-2xl font-serif font-semibold text-foret-700 mb-6">
              Nos activités
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                {
                  emoji: '🥾',
                  titre: 'Sorties botaniques',
                  desc: 'Promenades en forêt, garrigue et montagne pour observer et identifier les plantes sauvages de notre région.',
                },
                {
                  emoji: '🍄',
                  titre: 'Sorties mycologiques',
                  desc: 'Cueillette et identification des champignons, particulièrement en automne. Attention portée à la sécurité alimentaire.',
                },
                {
                  emoji: '🎓',
                  titre: 'Sorties initiation',
                  desc: 'Sorties spécialement conçues pour les débutants, avec explications pédagogiques et rythme adapté.',
                },
                {
                  emoji: '📚',
                  titre: 'Conférences',
                  desc: 'Présentations thématiques sur la botanique, la mycologie et la nature de notre région.',
                },
              ].map((activite) => (
                <div key={activite.titre} className="card p-6">
                  <div className="text-3xl mb-3" aria-hidden="true">{activite.emoji}</div>
                  <h3 className="font-serif font-semibold text-foret-700 text-lg mb-2">{activite.titre}</h3>
                  <p className="text-gray-600 text-base leading-relaxed">{activite.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <hr className="border-foret-100 my-10" />

          {/* Adhésion */}
          <section aria-labelledby="adhesion">
            <h2 id="adhesion" className="text-2xl font-serif font-semibold text-foret-700 mb-6">
              Rejoindre l&apos;association
            </h2>
            <div className="bg-beige-100 border border-foret-200 rounded-card p-8">
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                Pour devenir membre de l&apos;ABMS06, contactez-nous par email ou lors d&apos;une sortie.
                L&apos;adhésion vous donne accès à toutes les sorties et activités de l&apos;association.
              </p>
              <div className="space-y-3 text-gray-700">
                <p className="flex items-center gap-3">
                  <span className="text-foret-700 font-semibold">✓</span>
                  Accès à toutes les sorties botaniques et mycologiques
                </p>
                <p className="flex items-center gap-3">
                  <span className="text-foret-700 font-semibold">✓</span>
                  Newsletter et informations sur les activités
                </p>
                <p className="flex items-center gap-3">
                  <span className="text-foret-700 font-semibold">✓</span>
                  Accès à la bibliothèque et aux ressources de l&apos;association
                </p>
                <p className="flex items-center gap-3">
                  <span className="text-foret-700 font-semibold">✓</span>
                  Rencontres conviviales entre passionnés
                </p>
              </div>
              <Link href="/contact" className="btn-primary mt-8 inline-flex">
                Nous contacter pour adhérer
              </Link>
            </div>
          </section>

          <hr className="border-foret-100 my-10" />

          {/* Documents */}
          <section aria-labelledby="documents">
            <h2 id="documents" className="text-2xl font-serif font-semibold text-foret-700 mb-6">
              Documents de l&apos;association
            </h2>
            <div className="space-y-3">
              <a
                href="https://abms06jb.info/infos2/prospectus_2025.pdf"
                className="card p-5 flex items-center gap-4 no-underline hover:shadow-card-hover transition-shadow"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Télécharger le prospectus 2025 (PDF, s'ouvre dans un nouvel onglet)"
              >
                <span className="text-3xl" aria-hidden="true">📄</span>
                <div>
                  <p className="font-semibold text-foret-700">Prospectus 2025</p>
                  <p className="text-sm text-gray-500">Présentation de l&apos;association — Format PDF</p>
                </div>
                <span className="ml-auto text-foret-600 text-sm" aria-hidden="true">↗</span>
              </a>
              <a
                href="https://abms06jb.info/infos2/Calendrier_25-26.pdf"
                className="card p-5 flex items-center gap-4 no-underline hover:shadow-card-hover transition-shadow"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Télécharger le calendrier 2025-2026 (PDF, s'ouvre dans un nouvel onglet)"
              >
                <span className="text-3xl" aria-hidden="true">📅</span>
                <div>
                  <p className="font-semibold text-foret-700">Calendrier 2025-2026</p>
                  <p className="text-sm text-gray-500">Programme des sorties et activités — Format PDF</p>
                </div>
                <span className="ml-auto text-foret-600 text-sm" aria-hidden="true">↗</span>
              </a>
            </div>
          </section>

        </div>
      </div>
    </>
  )
}
