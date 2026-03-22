import type { Metadata } from 'next'
import ContactForm from './ContactForm'

export const metadata: Metadata = {
  title: 'Contact — ABMS',
  description: "Contactez l'Association Botanique et Mycologique de la Siagne. Nous répondons à toutes vos questions.",
}

export default function ContactPage() {
  return (
    <>
      {/* En-tête de page */}
      <section className="bg-foret-700 text-white py-14">
        <div className="container-main">
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white">
            Nous contacter
          </h1>
          <p className="text-foret-100 text-lg mt-3">
            Une question ? Envie de rejoindre l&apos;association ? Écrivez-nous.
          </p>
        </div>
      </section>

      <div className="container-main py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl">

          {/* Formulaire */}
          <div>
            <h2 className="text-xl font-serif font-semibold text-foret-700 mb-6">
              Envoyer un message
            </h2>
            <ContactForm />
          </div>

          {/* Informations */}
          <div>
            <h2 className="text-xl font-serif font-semibold text-foret-700 mb-6">
              Informations pratiques
            </h2>
            <div className="space-y-6">
              <div className="card p-6">
                <h3 className="font-semibold text-foret-700 mb-3 flex items-center gap-2">
                  <span aria-hidden="true">📍</span> Zone d&apos;activité
                </h3>
                <p className="text-gray-700">
                  Nos sorties se déroulent dans les <strong>Alpes-Maritimes (06)</strong> et
                  le <strong>Var (83)</strong>, principalement dans les massifs de l&apos;Estérel,
                  des Maures, et les Préalpes.
                </p>
              </div>

              <div className="card p-6">
                <h3 className="font-semibold text-foret-700 mb-3 flex items-center gap-2">
                  <span aria-hidden="true">📅</span> Fréquence des sorties
                </h3>
                <p className="text-gray-700">
                  Nous organisons des sorties tout au long de l&apos;année, avec une fréquence
                  plus importante au <strong>printemps</strong> (plantes en fleurs) et
                  en <strong>automne</strong> (champignons).
                </p>
              </div>

              <div className="card p-6">
                <h3 className="font-semibold text-foret-700 mb-3 flex items-center gap-2">
                  <span aria-hidden="true">⏱</span> Délai de réponse
                </h3>
                <p className="text-gray-700">
                  Nous faisons notre possible pour répondre à vos messages dans les
                  <strong> 48 heures</strong> ouvrables.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
