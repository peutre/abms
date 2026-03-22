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
    const album = await payload.findByID({ collection: 'gallery', id })
    return { title: `${album.title} — Galerie ABMS` }
  } catch {
    return { title: 'Album photo — ABMS' }
  }
}

export default async function AlbumDetailPage({ params }: Props) {
  const { id } = await params
  let album: any = null

  try {
    const payload = await getPayload({ config })
    album = await payload.findByID({ collection: 'gallery', id })
  } catch {
    notFound()
  }

  if (!album) notFound()

  const photos = album.photos || []

  return (
    <>
      <section className="bg-foret-700 text-white py-14">
        <div className="container-main">
          <nav aria-label="Fil d'Ariane" className="mb-4">
            <ol className="flex items-center gap-2 text-sm opacity-80" role="list">
              <li><Link href="/" className="no-underline text-white hover:opacity-100">Accueil</Link></li>
              <li aria-hidden="true">/</li>
              <li><Link href="/galerie" className="no-underline text-white hover:opacity-100">Galerie</Link></li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="opacity-60 truncate max-w-xs">{album.title}</li>
            </ol>
          </nav>
          <p className="text-foret-200 mb-2">
            <time dateTime={album.date}>{formatDate(album.date)}</time>
          </p>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white">{album.title}</h1>
          {album.description && (
            <p className="text-foret-100 text-lg mt-3 max-w-2xl">{album.description}</p>
          )}
        </div>
      </section>

      <div className="container-main py-12">
        <p className="text-gray-500 mb-6">{photos.length} photo{photos.length > 1 ? 's' : ''}</p>

        {photos.length === 0 ? (
          <p className="text-gray-500">Cet album ne contient pas encore de photos.</p>
        ) : (
          <div
            className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4"
            role="list"
            aria-label="Photos de l'album"
          >
            {photos.map((item: any, idx: number) => {
              const url = item.photo?.sizes?.card?.url || item.photo?.url
              const alt = item.photo?.alt || `${album.title} — photo ${idx + 1}`

              return url ? (
                <figure key={idx} className="break-inside-avoid" role="listitem">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={url}
                    alt={alt}
                    className="w-full rounded-lg shadow-sm hover:shadow-md transition-shadow"
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
        )}

        <div className="mt-10 pt-6 border-t border-foret-100">
          <Link href="/galerie" className="text-foret-600 hover:text-foret-700 font-medium no-underline hover:underline flex items-center gap-2">
            <span aria-hidden="true">←</span> Retour à la galerie
          </Link>
        </div>
      </div>
    </>
  )
}
