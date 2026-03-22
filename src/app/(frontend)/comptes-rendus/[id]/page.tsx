import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

type Props = { params: Promise<{ id: string }> }

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  try {
    const payload = await getPayload({ config })
    const report = await payload.findByID({ collection: 'reports', id })
    return { title: `${report.title} — ABMS` }
  } catch {
    return { title: 'Compte rendu — ABMS' }
  }
}

export default async function ReportDetailPage({ params }: Props) {
  const { id } = await params
  let report: any = null

  try {
    const payload = await getPayload({ config })
    report = await payload.findByID({ collection: 'reports', id })
  } catch {
    notFound()
  }

  if (!report) notFound()

  const photos = report.photos || []
  const speciesSeen: any[] = report.species_seen || []

  return (
    <>
      <section className="bg-foret-700 text-white py-14">
        <div className="container-main">
          <nav aria-label="Fil d'Ariane" className="mb-4">
            <ol className="flex items-center gap-2 text-sm opacity-80" role="list">
              <li><Link href="/" className="no-underline text-white">Accueil</Link></li>
              <li aria-hidden="true">/</li>
              <li><Link href="/comptes-rendus" className="no-underline text-white">Comptes rendus</Link></li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="opacity-60 truncate max-w-xs">{report.title}</li>
            </ol>
          </nav>
          <time dateTime={report.date} className="text-foret-200 block mb-2">
            {formatDate(report.date)}
          </time>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white leading-tight">
            {report.title}
          </h1>
          {report.author && (
            <p className="text-foret-200 mt-2">Rédigé par {report.author}</p>
          )}
        </div>
      </section>

      <div className="container-main py-12">
        <div className="max-w-3xl">

          {/* Texte du compte rendu */}
          {report.content && (
            <section aria-labelledby="texte-cr" className="mb-10">
              <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                <p>{typeof report.content === 'string' ? report.content : 'Contenu disponible dans l\'interface d\'administration.'}</p>
              </div>
            </section>
          )}

          {/* Espèces observées */}
          {speciesSeen.length > 0 && (
            <section aria-labelledby="especes-observees" className="mb-10">
              <h2 id="especes-observees" className="text-xl font-serif font-semibold text-foret-700 mb-4">
                Espèces observées lors de cette sortie
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3" role="list">
                {speciesSeen.map((sp: any) => (
                  <article key={sp.id || sp} role="listitem">
                    <Link
                      href={`/especes/${sp.slug || sp.id}`}
                      className="card block p-3 no-underline group hover:shadow-card-hover"
                    >
                      {sp.photo_main?.sizes?.thumbnail?.url && (
                        <div className="aspect-square rounded-md overflow-hidden mb-2">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={sp.photo_main.sizes.thumbnail.url}
                            alt={sp.photo_main.alt || sp.name_common}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            loading="lazy"
                          />
                        </div>
                      )}
                      <p className="font-medium text-sm text-foret-800 group-hover:text-foret-600 leading-tight">
                        {sp.name_common || sp}
                      </p>
                      {sp.name_scientific && (
                        <p className="scientific-name text-xs mt-0.5">{sp.name_scientific}</p>
                      )}
                    </Link>
                  </article>
                ))}
              </div>
            </section>
          )}

          {/* Photos */}
          {photos.length > 0 && (
            <section aria-labelledby="photos-cr" className="mb-10">
              <h2 id="photos-cr" className="text-xl font-serif font-semibold text-foret-700 mb-4">
                Photos de la sortie
              </h2>
              <div
                className="columns-1 sm:columns-2 gap-4 space-y-4"
                role="list"
                aria-label="Photos de la sortie"
              >
                {photos.map((item: any, idx: number) => {
                  const url = item.photo?.sizes?.card?.url || item.photo?.url
                  return url ? (
                    <figure key={idx} className="break-inside-avoid" role="listitem">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={url}
                        alt={item.photo?.alt || `${report.title} — photo ${idx + 1}`}
                        className="w-full rounded-lg shadow-sm"
                        loading="lazy"
                      />
                      {item.caption && (
                        <figcaption className="text-xs text-gray-500 mt-1 px-1 italic">
                          {item.caption}
                        </figcaption>
                      )}
                    </figure>
                  ) : null
                })}
              </div>
            </section>
          )}

          {/* Navigation */}
          <div className="pt-6 border-t border-foret-100">
            <Link href="/comptes-rendus" className="text-foret-600 hover:text-foret-700 font-medium no-underline hover:underline flex items-center gap-2">
              <span aria-hidden="true">←</span> Tous les comptes rendus
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
