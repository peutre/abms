import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { Metadata } from 'next'

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

  try {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'gallery',
      sort: '-date',
      limit: 50,
    })
    albums = result.docs
  } catch {
    // Affichage vide en développement
  }

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
        {albums.length === 0 ? (
          <div className="card p-10 text-center text-gray-500">
            <div className="text-5xl mb-4" aria-hidden="true">📷</div>
            <p className="text-xl">La galerie photos est en cours de construction.</p>
            <p className="mt-2">Les albums seront ajoutés prochainement.</p>
          </div>
        ) : (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            role="list"
            aria-label={`${albums.length} albums photo`}
          >
            {albums.map((album: any) => {
              const coverUrl = album.cover_photo?.sizes?.card?.url || album.cover_photo?.url
              const photoCount = album.photos?.length || 0

              return (
                <article key={album.id} role="listitem">
                  <Link
                    href={`/galerie/${album.id}`}
                    className="block card overflow-hidden group no-underline"
                    aria-label={`Album : ${album.title} — ${formatDate(album.date)}`}
                  >
                    {/* Image de couverture */}
                    <div className="aspect-video bg-foret-50 overflow-hidden">
                      {coverUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={coverUrl}
                          alt={album.cover_photo?.alt || `Couverture de l'album : ${album.title}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-6xl" aria-hidden="true">
                          📷
                        </div>
                      )}
                      {/* Overlay avec nombre de photos */}
                      <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                        {photoCount} photo{photoCount > 1 ? 's' : ''}
                      </div>
                    </div>

                    <div className="p-5">
                      <time dateTime={album.date} className="text-sm text-gray-500">
                        {formatDate(album.date)}
                      </time>
                      <h2 className="font-serif font-semibold text-foret-800 mt-1 group-hover:text-foret-600 transition-colors">
                        {album.title}
                      </h2>
                      {album.description && (
                        <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                          {album.description}
                        </p>
                      )}
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
