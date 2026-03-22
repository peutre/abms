import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Plantes & Champignons — ABMS',
  description: 'Base d\'espèces botaniques et mycologiques observées par l\'ABMS06. Fiches détaillées avec photos et descriptions.',
}

const EDIBILITY_CONFIG: Record<string, { label: string; badgeClass: string }> = {
  comestible:     { label: '✅ Comestible',     badgeClass: 'badge badge-comestible' },
  non_comestible: { label: '⚠️ Non comestible', badgeClass: 'badge badge-non-comestible' },
  toxique:        { label: '🔶 Toxique',         badgeClass: 'badge badge-toxique' },
  mortel:         { label: '☠️ Mortel',           badgeClass: 'badge badge-mortel' },
}

const SEASON_LABELS: Record<string, string> = {
  printemps: '🌸 Printemps',
  ete: '☀️ Été',
  automne: '🍂 Automne',
  hiver: '❄️ Hiver',
}

export default async function EspecesPage({
  searchParams,
}: {
  searchParams: Promise<{ categorie?: string; search?: string }>
}) {
  const { categorie, search } = await searchParams
  let species: any[] = []
  let totalDocs = 0

  try {
    const payload = await getPayload({ config })

    const where: any = {}
    if (categorie && categorie !== 'tous') {
      where.category = { equals: categorie }
    }
    if (search) {
      where.or = [
        { name_common: { like: search } },
        { name_scientific: { like: search } },
      ]
    }

    const result = await payload.find({
      collection: 'species',
      where: Object.keys(where).length > 0 ? where : undefined,
      sort: 'name_common',
      limit: 100,
    })
    species = result.docs
    totalDocs = result.totalDocs
  } catch {
    // Affichage vide en développement
  }

  return (
    <>
      {/* En-tête */}
      <section className="bg-foret-700 text-white py-14">
        <div className="container-main">
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white">
            Plantes &amp; Champignons
          </h1>
          <p className="text-foret-100 text-lg mt-3">
            Base de données des espèces observées lors de nos sorties.
            {totalDocs > 0 && <span> <strong className="text-white">{totalDocs} espèces</strong> répertoriées.</span>}
          </p>
        </div>
      </section>

      <div className="container-main py-10">

        {/* Filtres */}
        <form method="GET" action="/especes" className="mb-10 flex flex-col sm:flex-row gap-4">
          {/* Recherche */}
          <div className="flex-1">
            <label htmlFor="search" className="sr-only">Rechercher une espèce</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" aria-hidden="true">🔍</span>
              <input
                id="search"
                name="search"
                type="search"
                defaultValue={search}
                placeholder="Rechercher par nom (ex: Cèpe, Boletus...)"
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg text-base
                           focus:border-foret-500 focus:outline-none focus:ring-2 focus:ring-foret-200"
              />
            </div>
          </div>

          {/* Filtre catégorie */}
          <div>
            <label htmlFor="categorie" className="sr-only">Filtrer par catégorie</label>
            <select
              id="categorie"
              name="categorie"
              defaultValue={categorie || 'tous'}
              className="w-full sm:w-auto px-4 py-3 border-2 border-gray-200 rounded-lg text-base
                         focus:border-foret-500 focus:outline-none bg-white min-h-[48px]"
            >
              <option value="tous">Toutes les espèces</option>
              <option value="plante">🌿 Plantes</option>
              <option value="champignon">🍄 Champignons</option>
              <option value="lichen">Lichens</option>
            </select>
          </div>

          <button type="submit" className="btn-primary whitespace-nowrap">
            Filtrer
          </button>

          {(search || categorie) && (
            <Link href="/especes" className="btn-secondary whitespace-nowrap">
              Effacer les filtres
            </Link>
          )}
        </form>

        {/* Grille d'espèces */}
        {species.length === 0 ? (
          <div className="card p-10 text-center text-gray-500">
            <div className="text-5xl mb-4" aria-hidden="true">🌿</div>
            <p className="text-xl">
              {search || categorie
                ? 'Aucune espèce ne correspond à votre recherche.'
                : 'La base d\'espèces est en cours de construction.'}
            </p>
            {(search || categorie) && (
              <Link href="/especes" className="btn-secondary mt-4 inline-flex">
                Voir toutes les espèces
              </Link>
            )}
          </div>
        ) : (
          <div
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
            role="list"
            aria-label={`${species.length} espèces affichées`}
          >
            {species.map((sp: any) => {
              const edibility = sp.edibility ? EDIBILITY_CONFIG[sp.edibility] : null

              return (
                <article key={sp.id} role="listitem">
                  <Link
                    href={`/especes/${sp.slug}`}
                    className="block card overflow-hidden group h-full no-underline"
                    aria-label={`${sp.name_common} — ${sp.name_scientific}`}
                  >
                    {/* Photo */}
                    <div className="aspect-square bg-foret-50 relative overflow-hidden">
                      {sp.photo_main?.sizes?.thumbnail?.url || sp.photo_main?.url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={sp.photo_main.sizes?.thumbnail?.url || sp.photo_main.url}
                          alt={sp.photo_main.alt || sp.name_common}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                      ) : (
                        <div
                          className="w-full h-full flex items-center justify-center text-5xl"
                          aria-hidden="true"
                        >
                          {sp.category === 'champignon' ? '🍄' : '🌿'}
                        </div>
                      )}

                      {/* Badge catégorie */}
                      <div className="absolute top-2 left-2">
                        <span className="bg-white/90 text-xs font-medium px-2 py-0.5 rounded-full text-gray-700">
                          {sp.category === 'champignon' ? '🍄' : sp.category === 'plante' ? '🌿' : '🌾'}
                        </span>
                      </div>
                    </div>

                    {/* Infos */}
                    <div className="p-3">
                      <p className="font-semibold text-foret-800 text-sm leading-tight group-hover:text-foret-600 transition-colors">
                        {sp.name_common}
                      </p>
                      <p className="scientific-name text-xs mt-0.5 truncate">
                        {sp.name_scientific}
                      </p>
                      {edibility && sp.category === 'champignon' && (
                        <div className="mt-2">
                          <span className={`${edibility.badgeClass} text-xs`}>
                            {edibility.label}
                          </span>
                        </div>
                      )}
                      {sp.season && sp.season.length > 0 && (
                        <p className="text-xs text-gray-400 mt-1">
                          {sp.season.map((s: string) => SEASON_LABELS[s] || s).join(' · ')}
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
