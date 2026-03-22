import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Galerie photos — ABMS',
  description: 'Albums photos des sorties botaniques et mycologiques de l\'ABMS06.',
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default async function GaleriePage() {
  let albums: any[] = []
  let photos: any[] = []

  try {
    const payload = await getPayload({ config })

    const albumsResult = await payload.find({
      collection: 'gallery',
      sort: '-date',
      limit: 50,
    })
    albums = albumsResult.docs

    const photosResult = await payload.find({
      collection: 'media',
      sort: '-createdAt',
      limit: 100,
    })
    photos = photosResult.docs
  } catch (err) {
    console.error('[Galerie] Erreur de chargement :', err)
  }

  const hasContent = albums.length > 0 || photos.length > 0

  return (
    <>
      <section className="bg-foret-700 text-white py-14">
        <div className="container-main">
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white">
            Galerie photos
          </h1>
          <p className="text-foret-100 text-lg mt-3">
            Retrouvez les photos de nos sorties botaniques et mycologiques.
          </p>
        </div>
      </section>

      <div className="container-main py-12">
        {!hasContent ? (
          <div className="card p-10 text-center text-gray-500">
            <div className="text-5xl mb-4" aria-hidden="true">📷</div>
            <p className="text-xl">La galerie photos est en cours de construction.</p>
            <p className="mt-2">Les albums seront ajoutés prochainement.</p>
          </div>
        ) : (
          <div className="space-y-16">

            {/* Albums de sorties */}
            {albums.length > 0 && (
              <section aria-labelledby="albums-titre">
                <h2 id="albums-titre" className="text-2xl font-serif font-semibold text-foret-700 mb-8">
                  Albums de sorties
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {albums.map((album: any) => {
                    const coverUrl = album.cover_photo?.sizes?.card?.url || album.cover_photo?.url
                    const photoCount = album.photos?.length || 0
                    return (
                      <article key={album.id}>
                        <Link
                          href={`/galerie/${album.id}`}
                          className="block card overflow-hidden group no-underline"
                          aria-label={`Album : ${album.title} — ${formatDate(album.date)}`}
                        >
                          <div className="relative aspect-video bg-foret-50 overflow-hidden">
                            {coverUrl ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={coverUrl}
                                alt={album.cover_photo?.alt || `Couverture de l'album : ${album.title}`}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                loading="lazy"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-6xl" aria-hidden="true">📷</div>
                            )}
                            <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                              {photoCount} photo{photoCount > 1 ? 's' : ''}
                            </div>
                          </div>
                          <div className="p-5">
                            <time dateTime={album.date} className="text-sm text-gray-500">{formatDate(album.date)}</time>
                            <h3 className="font-serif font-semibold text-foret-800 mt-1 group-hover:text-foret-600 transition-colors">
                              {album.title}
                            </h3>
                          </div>
                        </Link>
                      </article>
                    )
                  })}
                </div>
              </section>
            )}

            {/* Toutes les photos */}
            {photos.length > 0 && (
              <section aria-labelledby="photos-titre">
                <h2 id="photos-titre" className="text-2xl font-serif font-semibold text-foret-700 mb-8">
                  Photos
                  <span className="ml-3 text-base font-sans font-normal text-gray-400">
                    {photos.length} photo{photos.length > 1 ? 's' : ''}
                  </span>
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {photos.map((photo: any) => {
                    const thumbUrl = photo.sizes?.card?.url || photo.sizes?.thumbnail?.url || photo.url
                    if (!thumbUrl) return null
                    return (
                      <figure key={photo.id} className="group">
                        <div className="aspect-square overflow-hidden rounded-xl bg-foret-50">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={thumbUrl}
                            alt={photo.alt || 'Photo ABMS'}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                        </div>
                        {photo.caption && (
                          <figcaption className="text-xs text-gray-500 mt-2 px-1 line-clamp-2">
                            {photo.caption}
                          </figcaption>
                        )}
                      </figure>
                    )
                  })}
                </div>
              </section>
            )}

          </div>
        )}
      </div>
    </>
  )
}
