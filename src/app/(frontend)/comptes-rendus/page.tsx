import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Comptes rendus — ABMS',
  description: 'Comptes rendus des sorties botaniques et mycologiques de l\'ABMS06.',
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

export default async function ComptesRendusPage() {
  let reports: any[] = []

  try {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'reports',
      sort: '-date',
      limit: 30,
    })
    reports = result.docs
  } catch {
    // Affichage vide en développement
  }

  return (
    <>
      <section className="bg-foret-700 text-white py-14">
        <div className="container-main">
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white">
            Comptes rendus
          </h1>
          <p className="text-foret-100 text-lg mt-3">
            Récits et photos de nos sorties passées.
          </p>
        </div>
      </section>

      <div className="container-main py-12">
        {reports.length === 0 ? (
          <div className="card p-10 text-center text-gray-500">
            <div className="text-5xl mb-4" aria-hidden="true">📖</div>
            <p className="text-xl">Aucun compte rendu disponible pour l&apos;instant.</p>
          </div>
        ) : (
          <div className="space-y-4" role="list">
            {reports.map((report: any) => {
              const photoCount = report.photos?.length || 0
              const speciesCount = report.species_seen?.length || 0

              return (
                <article key={report.id} role="listitem">
                  <Link
                    href={`/comptes-rendus/${report.id}`}
                    className="card block p-6 no-underline group hover:shadow-card-hover transition-shadow"
                    aria-label={`${report.title} — ${formatDate(report.date)}`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <time dateTime={report.date} className="text-sm text-gray-500">
                          {formatDate(report.date)}
                        </time>
                        <h2 className="font-serif font-semibold text-foret-800 text-lg mt-1 group-hover:text-foret-600 transition-colors">
                          {report.title}
                        </h2>
                        {report.author && (
                          <p className="text-sm text-gray-500 mt-1">Par {report.author}</p>
                        )}
                        <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                          {photoCount > 0 && (
                            <span aria-label={`${photoCount} photos`}>
                              📷 {photoCount} photo{photoCount > 1 ? 's' : ''}
                            </span>
                          )}
                          {speciesCount > 0 && (
                            <span aria-label={`${speciesCount} espèces observées`}>
                              🌿 {speciesCount} espèce{speciesCount > 1 ? 's' : ''}
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="text-foret-400 text-xl group-hover:text-foret-600 transition-colors flex-shrink-0" aria-hidden="true">
                        →
                      </span>
                    </div>
                  </Link>
                </article>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}
