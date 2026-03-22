import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

type Props = { params: Promise<{ id: string }> }

function formatDate(dateStr: string) {
  const date = new Date(dateStr)
  return date.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

const EVENT_TYPE_LABELS: Record<string, string> = {
  botanique: '🌿 Sortie botanique',
  mycologie: '🍄 Sortie mycologique',
  initiation: '🎓 Sortie initiation',
  conference: '📚 Conférence',
  assemblee: '🤝 Assemblée générale',
  botanique_mycologie: '🌿🍄 Botanique & Mycologie',
}

const LEVEL_LABELS: Record<string, string> = {
  debutants: '🟢 Débutants',
  perfectionnement: '🔵 Perfectionnement',
  tous_niveaux: '⚪ Tout niveau',
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  try {
    const payload = await getPayload({ config })
    const event = await payload.findByID({ collection: 'events', id })
    return {
      title: `${event.title} — ABMS`,
      description: `Sortie ABMS le ${formatDate(event.date as string)}${event.meeting_point ? ` à ${event.meeting_point}` : ''}.`,
    }
  } catch {
    return { title: 'Sortie — ABMS' }
  }
}

export default async function EventDetailPage({ params }: Props) {
  const { id } = await params
  let event: any = null

  try {
    const payload = await getPayload({ config })
    event = await payload.findByID({ collection: 'events', id })
  } catch {
    notFound()
  }

  if (!event) notFound()

  const isFuture = new Date(event.date) >= new Date()
  const isAnnule = event.status === 'annulee'

  return (
    <>
      {/* En-tête colorée selon le type */}
      <section className={`text-white py-14 ${event.event_type === 'mycologie' ? 'bg-terre-700' : 'bg-foret-700'}`}>
        <div className="container-main">
          <nav aria-label="Fil d'Ariane" className="mb-4">
            <ol className="flex items-center gap-2 text-sm opacity-80" role="list">
              <li><Link href="/" className="hover:opacity-100 no-underline text-white">Accueil</Link></li>
              <li aria-hidden="true">/</li>
              <li><Link href="/calendrier" className="hover:opacity-100 no-underline text-white">Calendrier</Link></li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="opacity-60 truncate max-w-xs">{event.title}</li>
            </ol>
          </nav>

          <p className="text-lg opacity-80 mb-2">
            {EVENT_TYPE_LABELS[event.event_type] || event.event_type}
          </p>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white leading-tight">
            {event.title}
          </h1>

          {isAnnule && (
            <div
              className="mt-4 bg-red-600 text-white px-5 py-3 rounded-lg inline-flex items-center gap-2 font-medium"
              role="alert"
            >
              <span aria-hidden="true">❌</span> Cette sortie a été annulée
            </div>
          )}
        </div>
      </section>

      <div className="container-main py-12">
        <div className="max-w-3xl">
          {/* Informations pratiques */}
          <section aria-labelledby="infos-pratiques" className="card p-8 mb-8">
            <h2 id="infos-pratiques" className="text-xl font-serif font-semibold text-foret-700 mb-6">
              Informations pratiques
            </h2>
            <dl className="space-y-4">
              <div className="flex items-start gap-4">
                <dt className="font-medium text-gray-500 w-32 flex-shrink-0">📅 Date</dt>
                <dd className="font-semibold text-gray-800">
                  <time dateTime={event.date}>{formatDate(event.date)}</time>
                </dd>
              </div>

              {event.time_start && (
                <div className="flex items-start gap-4">
                  <dt className="font-medium text-gray-500 w-32 flex-shrink-0">⏰ Heure</dt>
                  <dd className="font-semibold text-gray-800">{event.time_start}</dd>
                </div>
              )}

              {event.meeting_point && (
                <div className="flex items-start gap-4">
                  <dt className="font-medium text-gray-500 w-32 flex-shrink-0">📍 Rendez-vous</dt>
                  <dd className="font-semibold text-gray-800">{event.meeting_point}</dd>
                </div>
              )}

              <div className="flex items-start gap-4">
                <dt className="font-medium text-gray-500 w-32 flex-shrink-0">🎯 Niveau</dt>
                <dd>
                  <span className={`badge ${
                    event.level === 'debutants' ? 'badge-debutants' :
                    event.level === 'perfectionnement' ? 'badge-perfectionnement' :
                    'badge-tous-niveaux'
                  }`}>
                    {LEVEL_LABELS[event.level] || event.level}
                  </span>
                </dd>
              </div>
            </dl>
          </section>

          {/* Description */}
          {event.description && (
            <section aria-labelledby="description-sortie" className="mb-8">
              <h2 id="description-sortie" className="text-xl font-serif font-semibold text-foret-700 mb-4">
                Description
              </h2>
              <div className="prose prose-green max-w-none text-gray-700 leading-relaxed">
                {/* Le rich text Payload est serialisé — pour simplifier on affiche en texte brut */}
                <p>{typeof event.description === 'string' ? event.description : 'Voir les informations pratiques ci-dessus.'}</p>
              </div>
            </section>
          )}

          {/* Appel à l'action */}
          {isFuture && !isAnnule && (
            <div className="bg-foret-50 border border-foret-200 rounded-card p-6">
              <p className="text-gray-700 mb-4">
                Vous souhaitez participer à cette sortie ? Contactez-nous pour plus d&apos;informations.
              </p>
              <Link href="/contact" className="btn-primary">
                Contacter l&apos;association
              </Link>
            </div>
          )}

          {/* Navigation */}
          <div className="mt-10 pt-6 border-t border-foret-100">
            <Link
              href="/calendrier"
              className="text-foret-600 hover:text-foret-700 font-medium no-underline hover:underline flex items-center gap-2"
            >
              <span aria-hidden="true">←</span> Retour au calendrier
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
