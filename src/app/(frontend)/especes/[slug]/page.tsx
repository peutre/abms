import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

type Props = { params: Promise<{ slug: string }> }

const EDIBILITY_CONFIG: Record<string, { label: string; badgeClass: string; description: string }> = {
  comestible:     { label: '✅ Comestible',     badgeClass: 'badge badge-comestible', description: 'Cette espèce est comestible.' },
  non_comestible: { label: '⚠️ Non comestible', badgeClass: 'badge badge-non-comestible', description: 'Cette espèce n\'est pas comestible mais n\'est pas dangereuse.' },
  toxique:        { label: '🔶 Toxique',         badgeClass: 'badge badge-toxique', description: 'ATTENTION : cette espèce est toxique. Ne pas consommer.' },
  mortel:         { label: '☠️ Mortel',           badgeClass: 'badge badge-mortel', description: 'DANGER MORTEL : cette espèce peut être fatale si ingérée.' },
}

const SEASON_LABELS: Record<string, string> = {
  printemps: '🌸 Printemps',
  ete: '☀️ Été',
  automne: '🍂 Automne',
  hiver: '❄️ Hiver',
}

const CATEGORY_LABELS: Record<string, string> = {
  plante: '🌿 Plante',
  champignon: '🍄 Champignon',
  lichen: 'Lichen',
  autre: 'Autre',
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  try {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'species',
      where: { slug: { equals: slug } },
      limit: 1,
    })
    const sp = result.docs[0]
    if (!sp) return { title: 'Espèce — ABMS' }
    return {
      title: `${sp.name_common} (${sp.name_scientific}) — ABMS`,
      description: `Fiche de ${sp.name_common} (${sp.name_scientific}) — ${sp.habitat || 'Espèce observée par l\'ABMS06.'}`,
    }
  } catch {
    return { title: 'Espèce — ABMS' }
  }
}

export default async function SpeciesDetailPage({ params }: Props) {
  const { slug } = await params
  let sp: any = null

  try {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'species',
      where: { slug: { equals: slug } },
      limit: 1,
    })
    sp = result.docs[0]
  } catch {
    notFound()
  }

  if (!sp) notFound()

  const edibility = sp.edibility ? EDIBILITY_CONFIG[sp.edibility] : null
  const isChampignon = sp.category === 'champignon'

  return (
    <>
      {/* En-tête */}
      <section className={`text-white py-14 ${isChampignon ? 'bg-terre-700' : 'bg-foret-700'}`}>
        <div className="container-main">
          {/* Fil d'Ariane */}
          <nav aria-label="Fil d'Ariane" className="mb-4">
            <ol className="flex items-center gap-2 text-sm opacity-80" role="list">
              <li><Link href="/" className="hover:opacity-100 no-underline text-white">Accueil</Link></li>
              <li aria-hidden="true">/</li>
              <li><Link href="/especes" className="hover:opacity-100 no-underline text-white">Espèces</Link></li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="opacity-60">{sp.name_common}</li>
            </ol>
          </nav>

          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl" aria-hidden="true">
              {isChampignon ? '🍄' : '🌿'}
            </span>
            <span className="text-foret-200 font-medium">
              {CATEGORY_LABELS[sp.category] || sp.category}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white leading-tight">
            {sp.name_common}
          </h1>
          <p className="text-foret-200 text-xl mt-2 italic">
            {sp.name_scientific}
          </p>
        </div>
      </section>

      <div className="container-main py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-8">

            {/* Photo principale */}
            {sp.photo_main && (
              <figure>
                <div className="rounded-card overflow-hidden bg-foret-50 aspect-video">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={sp.photo_main.sizes?.full?.url || sp.photo_main.url}
                    alt={sp.photo_main.alt || `${sp.name_common} — photo principale`}
                    className="w-full h-full object-cover"
                  />
                </div>
                {sp.photo_main.caption && (
                  <figcaption className="text-sm text-gray-500 mt-2 text-center italic">
                    {sp.photo_main.caption}
                  </figcaption>
                )}
              </figure>
            )}

            {/* Alerte comestibilité pour les champignons */}
            {isChampignon && edibility && (
              <div
                className={`p-5 rounded-card border-2 ${
                  sp.edibility === 'mortel'   ? 'bg-red-950 border-red-800 text-white' :
                  sp.edibility === 'toxique'  ? 'bg-red-50 border-red-300 text-red-900' :
                  sp.edibility === 'non_comestible' ? 'bg-orange-50 border-orange-300 text-orange-900' :
                  'bg-green-50 border-green-300 text-green-900'
                }`}
                role={sp.edibility === 'mortel' || sp.edibility === 'toxique' ? 'alert' : 'note'}
              >
                <p className="font-semibold text-lg flex items-center gap-2 mb-1">
                  {edibility.label}
                </p>
                <p>{edibility.description}</p>
                {(sp.edibility === 'mortel' || sp.edibility === 'toxique') && (
                  <p className="mt-2 font-medium">
                    En cas de doute sur un champignon, ne jamais le consommer sans avis d&apos;un expert.
                    En cas d&apos;ingestion accidentelle, appelez le SAMU (15) ou les Urgences (15).
                  </p>
                )}
              </div>
            )}

            {/* Description */}
            {sp.description && (
              <section aria-labelledby="description-espece">
                <h2 id="description-espece" className="text-xl font-serif font-semibold text-foret-700 mb-4">
                  Description
                </h2>
                <div className="text-gray-700 leading-relaxed text-lg">
                  {typeof sp.description === 'string' ? (
                    <p>{sp.description}</p>
                  ) : (
                    <p>Description disponible dans l&apos;interface d&apos;administration.</p>
                  )}
                </div>
              </section>
            )}

            {/* Galerie de photos supplémentaires */}
            {sp.photos_gallery && sp.photos_gallery.length > 0 && (
              <section aria-labelledby="galerie-espece">
                <h2 id="galerie-espece" className="text-xl font-serif font-semibold text-foret-700 mb-4">
                  Photos
                </h2>
                <div
                  className="grid grid-cols-2 sm:grid-cols-3 gap-3"
                  role="list"
                  aria-label="Galerie de photos de l'espèce"
                >
                  {sp.photos_gallery.map((item: any, idx: number) => (
                    <figure key={idx} role="listitem" className="rounded-lg overflow-hidden bg-foret-50">
                      {item.photo?.url && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.photo.sizes?.card?.url || item.photo.url}
                          alt={item.photo.alt || `${sp.name_common} — photo ${idx + 2}`}
                          className="w-full aspect-square object-cover"
                          loading="lazy"
                        />
                      )}
                      {item.caption && (
                        <figcaption className="p-2 text-xs text-gray-500 italic">
                          {item.caption}
                        </figcaption>
                      )}
                    </figure>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Colonne latérale — informations */}
          <aside>
            <div className="card p-6 sticky top-24">
              <h2 className="text-lg font-serif font-semibold text-foret-700 mb-5">
                Informations
              </h2>
              <dl className="space-y-4 text-sm">
                <div>
                  <dt className="font-medium text-gray-500 mb-1">Nom scientifique</dt>
                  <dd className="italic text-gray-700">{sp.name_scientific}</dd>
                </div>

                <div>
                  <dt className="font-medium text-gray-500 mb-1">Catégorie</dt>
                  <dd>{CATEGORY_LABELS[sp.category] || sp.category}</dd>
                </div>

                {sp.season && sp.season.length > 0 && (
                  <div>
                    <dt className="font-medium text-gray-500 mb-1">Saison d&apos;observation</dt>
                    <dd className="flex flex-wrap gap-1">
                      {sp.season.map((s: string) => (
                        <span key={s} className="bg-foret-50 text-foret-700 px-2 py-0.5 rounded-full text-xs">
                          {SEASON_LABELS[s] || s}
                        </span>
                      ))}
                    </dd>
                  </div>
                )}

                {sp.habitat && (
                  <div>
                    <dt className="font-medium text-gray-500 mb-1">Habitat</dt>
                    <dd className="text-gray-700">{sp.habitat}</dd>
                  </div>
                )}

                {sp.region && (
                  <div>
                    <dt className="font-medium text-gray-500 mb-1">Région</dt>
                    <dd className="text-gray-700">{sp.region}</dd>
                  </div>
                )}

                {isChampignon && edibility && (
                  <div>
                    <dt className="font-medium text-gray-500 mb-1">Comestibilité</dt>
                    <dd>
                      <span className={edibility.badgeClass}>{edibility.label}</span>
                    </dd>
                  </div>
                )}

                {sp.tags && sp.tags.length > 0 && (
                  <div>
                    <dt className="font-medium text-gray-500 mb-1">Mots-clés</dt>
                    <dd className="flex flex-wrap gap-1">
                      {sp.tags.map((t: any, i: number) => (
                        <span key={i} className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                          {t.tag || t}
                        </span>
                      ))}
                    </dd>
                  </div>
                )}
              </dl>

              <div className="mt-6 pt-5 border-t border-foret-100">
                <Link href="/especes" className="text-foret-600 hover:text-foret-700 text-sm no-underline hover:underline flex items-center gap-1">
                  <span aria-hidden="true">←</span> Toutes les espèces
                </Link>
              </div>
            </div>
          </aside>

        </div>
      </div>
    </>
  )
}
