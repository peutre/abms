import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Calendrier des sorties — ABMS',
  description: 'Toutes les sorties botaniques et mycologiques de l\'ABMS06. Agenda des prochaines activités.',
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr)
  return date.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function formatDateShort(dateStr: string) {
  const date = new Date(dateStr)
  return {
    jour: date.toLocaleDateString('fr-FR', { weekday: 'short' }),
    numero: date.getDate(),
    mois: date.toLocaleDateString('fr-FR', { month: 'short' }),
    annee: date.getFullYear(),
  }
}

const EVENT_TYPE_LABELS: Record<string, string> = {
  botanique: '🌿 Botanique',
  mycologie: '🍄 Mycologie',
  initiation: '🎓 Initiation',
  conference: '📚 Conférence',
  assemblee: '🤝 Assemblée',
  botanique_mycologie: '🌿🍄 Bot. & Myco.',
}

const LEVEL_CLASSES: Record<string, string> = {
  debutants: 'badge badge-debutants',
  perfectionnement: 'badge badge-perfectionnement',
  tous_niveaux: 'badge badge-tous-niveaux',
}

const LEVEL_LABELS: Record<string, string> = {
  debutants: 'Débutants',
  perfectionnement: 'Perfectionnement',
  tous_niveaux: 'Tout niveau',
}

const STATUS_LABELS: Record<string, { label: string; class: string }> = {
  planifiee:     { label: 'Planifiée', class: 'text-blue-600' },
  confirmee:     { label: 'Confirmée ✓', class: 'text-green-600' },
  annulee:       { label: '❌ Annulée', class: 'text-red-600' },
  terminee:      { label: 'Terminée', class: 'text-gray-500' },
}

export default async function CalendrierPage() {
  let upcomingEvents: any[] = []
  let pastEvents: any[] = []
  let errorMessage: string | null = null

  try {
    const payload = await getPayload({ config })
    const now = new Date().toISOString()

    const upcoming = await payload.find({
      collection: 'events',
      where: { date: { greater_than_equal: now } },
      sort: 'date',
      limit: 50,
    })
    upcomingEvents = upcoming.docs

    const past = await payload.find({
      collection: 'events',
      where: { date: { less_than: now } },
      sort: '-date',
      limit: 20,
    })
    pastEvents = past.docs
  } catch (err) {
    errorMessage = err instanceof Error ? err.message : 'Erreur inconnue'
    console.error('[Calendrier] Erreur de chargement :', err)
  }

  return (
    <>
      {/* En-tête */}
      <section className="bg-foret-700 text-white py-14">
        <div className="container-main">
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white">
            Calendrier des sorties
          </h1>
          <p className="text-foret-100 text-lg mt-3">
            Nos prochaines sorties botaniques, mycologiques et activités.
          </p>
        </div>
      </section>

      <div className="container-main py-12">

        {/* Prochaines sorties */}
        <section aria-labelledby="prochaines-sorties">
          <h2 id="prochaines-sorties" className="text-2xl font-serif font-semibold text-foret-700 mb-8">
            Prochaines sorties
          </h2>

          {errorMessage ? (
            <div className="card p-10 text-center text-red-600">
              <div className="text-5xl mb-4" aria-hidden="true">⚠️</div>
              <p className="text-xl font-semibold">Impossible de charger les sorties.</p>
              <p className="mt-2 text-sm text-gray-500 font-mono">{errorMessage}</p>
            </div>
          ) : upcomingEvents.length === 0 ? (
            <div className="card p-10 text-center text-gray-500">
              <div className="text-5xl mb-4" aria-hidden="true">📅</div>
              <p className="text-xl">Aucune sortie prévue pour l&apos;instant.</p>
              <p className="mt-2">Le calendrier sera mis à jour prochainement.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingEvents.map((event: any) => {
                const d = formatDateShort(event.date)
                const status = STATUS_LABELS[event.status] || STATUS_LABELS.planifiee

                return (
                  <article key={event.id} className="card overflow-hidden">
                    <div className="flex flex-col sm:flex-row">
                      {/* Bloc date (mini-calendrier) */}
                      <div className={`flex-shrink-0 w-full sm:w-24 flex flex-row sm:flex-col items-center
                                       justify-center gap-0 text-white text-center
                                       ${event.event_type === 'mycologie' ? 'bg-terre-600' : 'bg-foret-600'}`}>
                        {/* Jour de la semaine — bandeau discret en haut */}
                        <div className="hidden sm:flex w-full justify-center bg-black/15 py-1.5">
                          <span className="text-[10px] font-semibold uppercase tracking-[0.15em] opacity-90">
                            {d.jour}
                          </span>
                        </div>

                        {/* Version mobile : tout inline */}
                        <div className="flex sm:hidden items-baseline gap-2 px-4 py-3">
                          <span className="text-[11px] font-semibold uppercase tracking-wider opacity-80">{d.jour}.</span>
                          <span className="text-2xl font-serif font-bold">{d.numero}</span>
                          <span className="text-[11px] font-semibold uppercase tracking-wider opacity-80">{d.mois} {d.annee}</span>
                        </div>

                        {/* Version desktop : empilé */}
                        <div className="hidden sm:flex flex-col items-center py-4 gap-0.5">
                          <span className="text-4xl font-serif font-bold leading-none">
                            {d.numero}
                          </span>
                          <span className="text-[11px] font-semibold uppercase tracking-[0.12em] mt-2 opacity-90">
                            {d.mois}
                          </span>
                          <span className="text-[11px] font-medium opacity-60">
                            {d.annee}
                          </span>
                        </div>
                      </div>

                      {/* Contenu */}
                      <div className="flex-1 p-5 sm:p-6 flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span className="text-sm text-gray-500 font-medium">
                              {EVENT_TYPE_LABELS[event.event_type] || event.event_type}
                            </span>
                            <span className={LEVEL_CLASSES[event.level] || 'badge'}>
                              {LEVEL_LABELS[event.level] || event.level}
                            </span>
                            <span className={`text-sm font-medium ${status.class}`}>
                              {status.label}
                            </span>
                          </div>

                          <h3 className="font-serif font-semibold text-foret-800 text-lg mb-2">
                            {event.title}
                          </h3>

                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-sm text-gray-600">
                            {event.time_start && (
                              <span className="flex items-center gap-1">
                                <span aria-hidden="true">⏰</span>
                                {event.time_start}
                              </span>
                            )}
                            {event.meeting_point && (
                              <span className="flex items-center gap-1">
                                <span aria-hidden="true">📍</span>
                                {event.meeting_point}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Bouton détail */}
                        <div className="flex sm:items-center">
                          <Link
                            href={`/calendrier/${event.id}`}
                            className="btn-secondary text-sm !py-2 !px-5 whitespace-nowrap no-underline"
                            aria-label={`Voir les détails de : ${event.title} — ${formatDate(event.date)}`}
                          >
                            Voir les détails
                          </Link>
                        </div>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </section>

        {/* Sorties passées */}
        {pastEvents.length > 0 && (
          <section className="mt-16" aria-labelledby="sorties-passees">
            <h2 id="sorties-passees" className="text-xl font-serif font-semibold text-gray-500 mb-6">
              Sorties passées
            </h2>
            <div className="space-y-2">
              {pastEvents.map((event: any) => (
                <Link
                  key={event.id}
                  href={`/calendrier/${event.id}`}
                  className="block card p-4 flex items-center gap-4 opacity-70 hover:opacity-100 transition-opacity no-underline"
                  aria-label={`${event.title} — ${formatDate(event.date)}`}
                >
                  <span className="text-sm text-gray-500 font-medium w-32 flex-shrink-0">
                    {formatDate(event.date)}
                  </span>
                  <span className="text-gray-700 font-medium">{event.title}</span>
                  <span className="ml-auto text-xs text-gray-400">
                    {EVENT_TYPE_LABELS[event.event_type] || ''}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  )
}
