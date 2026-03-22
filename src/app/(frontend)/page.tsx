import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Association Botanique et Mycologique de la Siagne — ABMS06',
  description: 'Découvrez les plantes et champignons des Alpes-Maritimes avec l\'ABMS06. Sorties botaniques et mycologiques ouvertes à tous, depuis La Roquette-sur-Siagne.',
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatDateShort(dateStr: string) {
  const d = new Date(dateStr)
  return {
    jour: d.toLocaleDateString('fr-FR', { weekday: 'long' }),
    numero: d.getDate(),
    mois: d.toLocaleDateString('fr-FR', { month: 'long' }),
    annee: d.getFullYear(),
  }
}

function getEventTypeLabel(type: string) {
  const labels: Record<string, string> = {
    botanique: 'Botanique',
    mycologie: 'Mycologie',
    initiation: 'Initiation',
    conference: 'Conférence',
    assemblee: 'Assemblée',
    botanique_mycologie: 'Botanique & Mycologie',
  }
  return labels[type] || type
}

function getLevelLabel(level: string) {
  const labels: Record<string, string> = {
    debutants: 'Débutants',
    perfectionnement: 'Perfectionnement',
    tous_niveaux: 'Tous niveaux',
  }
  return labels[level] || level
}

function getLevelColor(level: string) {
  const colors: Record<string, string> = {
    debutants: '#4d8a1a',
    perfectionnement: '#a66e14',
    tous_niveaux: '#5a6a7a',
  }
  return colors[level] || '#4d8a1a'
}

// ── SVG Botaniques décoratifs ─────────────────────────────────────────────────

function LeafSvg({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 200" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M60 190 C60 190 10 140 10 80 C10 30 60 10 60 10 C60 10 110 30 110 80 C110 140 60 190 60 190Z" fill="currentColor" fillOpacity="0.12"/>
      <path d="M60 190 L60 10" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.2"/>
      <path d="M60 80 C60 80 30 60 20 40" stroke="currentColor" strokeWidth="1" strokeOpacity="0.15"/>
      <path d="M60 80 C60 80 90 60 100 40" stroke="currentColor" strokeWidth="1" strokeOpacity="0.15"/>
      <path d="M60 120 C60 120 35 100 25 80" stroke="currentColor" strokeWidth="1" strokeOpacity="0.15"/>
      <path d="M60 120 C60 120 85 100 95 80" stroke="currentColor" strokeWidth="1" strokeOpacity="0.15"/>
    </svg>
  )
}

function MushroomSvg({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M50 55 C20 55 5 40 5 28 C5 14 24 5 50 5 C76 5 95 14 95 28 C95 40 80 55 50 55Z" fill="currentColor" fillOpacity="0.15"/>
      <path d="M35 55 L38 95 Q50 100 62 95 L65 55" fill="currentColor" fillOpacity="0.1"/>
      <ellipse cx="50" cy="96" rx="16" ry="4" fill="currentColor" fillOpacity="0.08"/>
    </svg>
  )
}

function FernSvg({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 160 240" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M80 220 L80 20" stroke="currentColor" strokeWidth="2" strokeOpacity="0.2"/>
      {[0,1,2,3,4,5,6,7].map(i => (
        <g key={i}>
          <path
            d={`M80 ${40 + i * 24} C${80 - 10 - i * 4} ${36 + i * 24} ${40 - i * 3} ${28 + i * 24} ${36 - i * 3} ${20 + i * 24}`}
            stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.18" fill="none"
          />
          <path
            d={`M80 ${40 + i * 24} C${80 + 10 + i * 4} ${36 + i * 24} ${120 + i * 3} ${28 + i * 24} ${124 + i * 3} ${20 + i * 24}`}
            stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.18" fill="none"
          />
        </g>
      ))}
    </svg>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default async function HomePage() {
  let upcomingEvents: any[] = []
  let recentSpecies: any[] = []

  try {
    const payload = await getPayload({ config })
    const now = new Date().toISOString()

    const eventsResult = await payload.find({
      collection: 'events',
      where: {
        and: [
          { date: { greater_than_equal: now } },
          { status: { not_equals: 'annulee' } },
        ],
      },
      sort: 'date',
      limit: 3,
    })
    upcomingEvents = eventsResult.docs

    const speciesResult = await payload.find({
      collection: 'species',
      sort: '-createdAt',
      limit: 4,
    })
    recentSpecies = speciesResult.docs
  } catch {
    // Affiche la page même sans BDD
  }

  return (
    <>
      {/* ── Animations CSS globales pour cette page ── */}
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-8px) rotate(1deg); }
          66% { transform: translateY(4px) rotate(-1deg); }
        }
        @keyframes drawLine {
          from { stroke-dashoffset: 600; }
          to   { stroke-dashoffset: 0; }
        }
        .anim-fade-up        { animation: fadeUp 0.8s cubic-bezier(0.16,1,0.3,1) both; }
        .anim-fade-up-d1     { animation: fadeUp 0.8s cubic-bezier(0.16,1,0.3,1) 0.12s both; }
        .anim-fade-up-d2     { animation: fadeUp 0.8s cubic-bezier(0.16,1,0.3,1) 0.24s both; }
        .anim-fade-up-d3     { animation: fadeUp 0.8s cubic-bezier(0.16,1,0.3,1) 0.36s both; }
        .anim-fade-up-d4     { animation: fadeUp 0.8s cubic-bezier(0.16,1,0.3,1) 0.48s both; }
        .anim-fade           { animation: fadeIn 1.2s ease both; }
        .anim-float          { animation: float 8s ease-in-out infinite; }
        .anim-float-slow     { animation: float 12s ease-in-out 2s infinite; }
        .event-card:hover .event-date-num { color: #2D5016; }
        .event-card:hover    { transform: translateY(-4px); }
        .species-card:hover .species-img { transform: scale(1.06); }
        .stat-item:hover .stat-num       { color: #8B6914; }
        .btn-hero-primary:hover { background: #F5F0E8; color: #2D5016; }
        .btn-hero-secondary:hover { background: rgba(255,255,255,0.15); border-color: rgba(255,255,255,0.6); }
        .link-arrow:hover span { transform: translateX(4px); }
        .link-arrow span { display: inline-block; transition: transform 0.2s ease; }
      `}</style>

      {/* ════════════════════════════════════════════════════
          HERO — Forêt Provençale
      ════════════════════════════════════════════════════ */}
      <section
        aria-labelledby="hero-title"
        style={{
          background: 'linear-gradient(160deg, #162a0a 0%, #2D5016 40%, #3a7012 70%, #4d8a1a 100%)',
          position: 'relative',
          overflow: 'hidden',
          minHeight: '92vh',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {/* Texture grain subtile */}
        <div aria-hidden="true" style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`,
          opacity: 0.5,
        }} />

        {/* Éléments botaniques flottants */}
        <div aria-hidden="true" className="anim-float" style={{
          position: 'absolute', top: '8%', right: '4%', width: 180, opacity: 0.35, color: '#8fb85a',
        }}>
          <FernSvg />
        </div>
        <div aria-hidden="true" className="anim-float-slow" style={{
          position: 'absolute', bottom: '12%', right: '18%', width: 120, opacity: 0.2, color: '#d8e6c0',
        }}>
          <LeafSvg />
        </div>
        <div aria-hidden="true" className="anim-float" style={{
          position: 'absolute', top: '55%', right: '8%', width: 90, opacity: 0.18, color: '#f8edcc',
          animationDelay: '3s',
        }}>
          <MushroomSvg />
        </div>
        <div aria-hidden="true" style={{
          position: 'absolute', bottom: '5%', left: '-2%', width: 200, opacity: 0.15, color: '#d8e6c0',
        }}>
          <LeafSvg />
        </div>

        {/* Ligne décorative SVG courbe */}
        <svg aria-hidden="true" style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, width: '100%', height: 120,
        }} viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path d="M0,80 C360,20 720,120 1080,60 C1260,30 1380,80 1440,60 L1440,120 L0,120Z"
            fill="#F5F0E8" fillOpacity="1"/>
        </svg>

        {/* Contenu */}
        <div className="container-main" style={{ position: 'relative', zIndex: 2, paddingTop: '5rem', paddingBottom: '8rem' }}>
          <p className="anim-fade-up" style={{
            color: '#8fb85a', fontFamily: 'Inter, sans-serif', fontSize: '0.8rem',
            fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase',
            marginBottom: '1.25rem',
          }}>
            La Roquette-sur-Siagne · Alpes-Maritimes · depuis 2002
          </p>

          <h1
            id="hero-title"
            className="anim-fade-up-d1"
            style={{
              fontFamily: '"Playfair Display", Georgia, serif',
              fontSize: 'clamp(2.5rem, 7vw, 5.5rem)',
              fontWeight: 700,
              color: '#FFFFFF',
              lineHeight: 1.08,
              marginBottom: '1.75rem',
              maxWidth: '14ch',
            }}
          >
            La nature,{' '}
            <em style={{ color: '#b8d190', fontStyle: 'italic' }}>
              à portée de pas
            </em>
          </h1>

          <p className="anim-fade-up-d2" style={{
            color: 'rgba(255,255,255,0.80)',
            fontFamily: 'Inter, sans-serif',
            fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
            lineHeight: 1.75,
            maxWidth: '52ch',
            marginBottom: '2.75rem',
          }}>
            Plantes sauvages, champignons, paysages méditerranéens —
            l&apos;ABMS vous invite à explorer la nature autrement,
            en bonne compagnie, à votre rythme.
          </p>

          <div className="anim-fade-up-d3" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link
              href="/calendrier"
              className="btn-hero-primary"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.6rem',
                background: '#FFFFFF', color: '#2D5016',
                fontFamily: 'Inter, sans-serif', fontWeight: 700,
                fontSize: '1rem', padding: '0.9rem 2rem',
                borderRadius: '0.75rem', textDecoration: 'none',
                transition: 'all 0.25s ease', minHeight: '52px',
                boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
              }}
            >
              Voir les prochaines sorties
              <span aria-hidden="true" style={{ fontSize: '1.1em' }}>→</span>
            </Link>
            <Link
              href="/a-propos"
              className="btn-hero-secondary"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.6rem',
                background: 'rgba(255,255,255,0.08)',
                border: '1.5px solid rgba(255,255,255,0.35)',
                color: '#FFFFFF',
                fontFamily: 'Inter, sans-serif', fontWeight: 600,
                fontSize: '1rem', padding: '0.9rem 2rem',
                borderRadius: '0.75rem', textDecoration: 'none',
                transition: 'all 0.25s ease', minHeight: '52px',
                backdropFilter: 'blur(8px)',
              }}
            >
              Notre association
            </Link>
          </div>

          {/* Indicateur scroll */}
          <div className="anim-fade" style={{
            marginTop: '4rem', display: 'flex', alignItems: 'center', gap: '0.75rem',
          }}>
            <div style={{
              width: 1, height: 48,
              background: 'linear-gradient(to bottom, rgba(255,255,255,0.4), transparent)',
            }} aria-hidden="true"/>
            <span style={{
              color: 'rgba(255,255,255,0.4)',
              fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.15em',
              textTransform: 'uppercase', fontFamily: 'Inter, sans-serif',
            }}>
              Découvrir
            </span>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          PROCHAINES SORTIES
      ════════════════════════════════════════════════════ */}
      <section aria-labelledby="sorties-title" style={{
        background: '#F5F0E8', paddingTop: '5rem', paddingBottom: '5rem',
      }}>
        <div className="container-main">

          {/* En-tête section */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '3rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <p style={{
                color: '#a66e14', fontFamily: 'Inter, sans-serif',
                fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.16em',
                textTransform: 'uppercase', marginBottom: '0.5rem',
              }}>Calendrier</p>
              <h2 id="sorties-title" style={{
                fontFamily: '"Playfair Display", Georgia, serif',
                fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
                fontWeight: 700, color: '#2D5016', margin: 0,
              }}>
                Prochaines sorties
              </h2>
            </div>
            <Link href="/calendrier" className="link-arrow" style={{
              color: '#3a7012', fontFamily: 'Inter, sans-serif', fontWeight: 600,
              fontSize: '0.95rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.4rem',
            }}>
              Tout le calendrier <span aria-hidden="true">→</span>
            </Link>
          </div>

          {upcomingEvents.length === 0 ? (
            /* État vide — élégant */
            <div style={{
              background: '#FFFFFF', borderRadius: '1.25rem', padding: '4rem 2rem',
              textAlign: 'center', border: '1px solid #e8dfc8',
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }} aria-hidden="true">🌿</div>
              <p style={{
                fontFamily: '"Playfair Display", Georgia, serif',
                fontSize: '1.3rem', color: '#2D5016', fontWeight: 600, marginBottom: '0.5rem',
              }}>
                Aucune sortie programmée pour l&apos;instant
              </p>
              <p style={{ color: '#6b6560', fontFamily: 'Inter, sans-serif', fontSize: '1rem' }}>
                Revenez bientôt ou contactez-nous pour en savoir plus.
              </p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 320px), 1fr))',
              gap: '1.5rem',
            }}>
              {upcomingEvents.map((event: any, idx: number) => {
                const dateObj = formatDateShort(event.date)
                const isMycologie = event.event_type === 'mycologie' || event.event_type === 'botanique_mycologie'
                return (
                  <article
                    key={event.id}
                    className="event-card"
                    style={{
                      background: '#FFFFFF',
                      borderRadius: '1.25rem',
                      overflow: 'hidden',
                      border: '1px solid #e8dfc8',
                      boxShadow: '0 2px 12px rgba(45,80,22,0.07)',
                      transition: 'all 0.3s cubic-bezier(0.34,1.56,0.64,1)',
                      animationDelay: `${idx * 0.1}s`,
                    }}
                  >
                    {/* Bande colorée type événement */}
                    <div style={{
                      height: 5,
                      background: isMycologie
                        ? 'linear-gradient(90deg, #8B6914, #c78a1c)'
                        : 'linear-gradient(90deg, #2D5016, #4d8a1a)',
                    }} aria-hidden="true"/>

                    <div style={{ padding: '1.75rem' }}>
                      {/* Date façon calendrier */}
                      <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                        <div style={{ textAlign: 'center', minWidth: 60 }}>
                          <div className="event-date-num" style={{
                            fontFamily: '"Playfair Display", Georgia, serif',
                            fontSize: '3rem', fontWeight: 700,
                            color: isMycologie ? '#8B6914' : '#3a7012',
                            lineHeight: 1, transition: 'color 0.2s',
                          }}>
                            {dateObj.numero}
                          </div>
                          <div style={{
                            fontFamily: 'Inter, sans-serif', fontSize: '0.75rem',
                            fontWeight: 700, color: '#a89252', textTransform: 'uppercase',
                            letterSpacing: '0.08em', marginTop: '0.1rem',
                          }}>
                            {dateObj.mois.slice(0, 3)}
                          </div>
                        </div>

                        <div style={{ flex: 1 }}>
                          {/* Type + niveau */}
                          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.6rem' }}>
                            <span style={{
                              fontFamily: 'Inter, sans-serif', fontSize: '0.7rem', fontWeight: 700,
                              letterSpacing: '0.1em', textTransform: 'uppercase',
                              color: isMycologie ? '#8B6914' : '#3a7012',
                              background: isMycologie ? '#fdf8ee' : '#f0f4e8',
                              padding: '0.2rem 0.6rem', borderRadius: '0.35rem',
                            }}>
                              {getEventTypeLabel(event.event_type)}
                            </span>
                            {event.level && (
                              <span style={{
                                fontFamily: 'Inter, sans-serif', fontSize: '0.7rem', fontWeight: 600,
                                color: getLevelColor(event.level), background: '#f5f5f5',
                                padding: '0.2rem 0.6rem', borderRadius: '0.35rem',
                              }}>
                                {getLevelLabel(event.level)}
                              </span>
                            )}
                          </div>

                          <h3 style={{
                            fontFamily: '"Playfair Display", Georgia, serif',
                            fontSize: '1.05rem', fontWeight: 600,
                            color: '#162a0a', margin: 0, lineHeight: 1.35,
                          }}>
                            {event.title}
                          </h3>
                        </div>
                      </div>

                      {/* Infos pratiques */}
                      <div style={{
                        borderTop: '1px solid #f0ebe0', paddingTop: '1rem',
                        display: 'flex', flexDirection: 'column', gap: '0.4rem',
                        marginBottom: '1.25rem',
                      }}>
                        {event.time_start && (
                          <p style={{
                            fontFamily: 'Inter, sans-serif', fontSize: '0.875rem',
                            color: '#6b6560', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem',
                          }}>
                            <span aria-hidden="true">⏰</span>
                            <span>{event.time_start}</span>
                            <span style={{ color: '#c5bca8' }}>·</span>
                            <span style={{ textTransform: 'capitalize' }}>{dateObj.jour}</span>
                          </p>
                        )}
                        {event.meeting_point && (
                          <p style={{
                            fontFamily: 'Inter, sans-serif', fontSize: '0.875rem',
                            color: '#6b6560', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem',
                          }}>
                            <span aria-hidden="true">📍</span>
                            <span>{event.meeting_point}</span>
                          </p>
                        )}
                      </div>

                      <Link
                        href={`/calendrier/${event.id}`}
                        style={{
                          display: 'block', textAlign: 'center',
                          background: isMycologie ? '#fdf8ee' : '#f0f4e8',
                          color: isMycologie ? '#8B6914' : '#2D5016',
                          fontFamily: 'Inter, sans-serif', fontWeight: 600,
                          fontSize: '0.9rem', padding: '0.7rem 1.5rem',
                          borderRadius: '0.6rem', textDecoration: 'none',
                          border: `1px solid ${isMycologie ? '#f0d898' : '#d8e6c0'}`,
                          transition: 'all 0.2s ease',
                        }}
                      >
                        Détails et infos pratiques →
                      </Link>
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          ESPÈCES — Base naturaliste
      ════════════════════════════════════════════════════ */}
      {recentSpecies.length > 0 && (
        <section aria-labelledby="especes-title" style={{
          background: '#FFFFFF',
          paddingTop: '5rem', paddingBottom: '5.5rem',
          position: 'relative', overflow: 'hidden',
        }}>
          {/* Décoration fond */}
          <div aria-hidden="true" style={{
            position: 'absolute', top: 0, right: '-5%',
            width: 320, opacity: 0.04, color: '#2D5016',
          }}>
            <FernSvg />
          </div>

          <div className="container-main" style={{ position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '3rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <p style={{
                  color: '#3a7012', fontFamily: 'Inter, sans-serif',
                  fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.16em',
                  textTransform: 'uppercase', marginBottom: '0.5rem',
                }}>Flore & Fonge</p>
                <h2 id="especes-title" style={{
                  fontFamily: '"Playfair Display", Georgia, serif',
                  fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
                  fontWeight: 700, color: '#2D5016', margin: 0,
                }}>
                  Dernières découvertes
                </h2>
              </div>
              <Link href="/especes" className="link-arrow" style={{
                color: '#3a7012', fontFamily: 'Inter, sans-serif', fontWeight: 600,
                fontSize: '0.95rem', textDecoration: 'none',
              }}>
                Explorer la base <span aria-hidden="true">→</span>
              </Link>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 200px), 1fr))',
              gap: '1.25rem',
            }}>
              {recentSpecies.map((species: any) => (
                <Link
                  key={species.id}
                  href={`/especes/${species.slug}`}
                  className="species-card"
                  style={{ textDecoration: 'none' }}
                >
                  <article style={{
                    borderRadius: '1rem', overflow: 'hidden',
                    border: '1px solid #e8dfc8',
                    boxShadow: '0 2px 10px rgba(45,80,22,0.06)',
                    transition: 'all 0.3s ease',
                    background: '#FDFCF9',
                  }}>
                    {/* Photo ou placeholder botanique */}
                    <div style={{
                      aspectRatio: '4/3', overflow: 'hidden',
                      background: species.category === 'champignon'
                        ? 'linear-gradient(135deg, #fdf8ee, #f8edcc)'
                        : 'linear-gradient(135deg, #f0f4e8, #d8e6c0)',
                      position: 'relative',
                    }}>
                      {species.photo_main?.url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={species.photo_main.url}
                          alt={species.photo_main.alt || species.name_common}
                          className="species-img"
                          style={{
                            width: '100%', height: '100%', objectFit: 'cover',
                            transition: 'transform 0.5s ease',
                          }}
                        />
                      ) : (
                        <div style={{
                          width: '100%', height: '100%',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '3rem',
                        }} aria-hidden="true">
                          {species.category === 'champignon' ? '🍄' : '🌿'}
                        </div>
                      )}
                    </div>

                    {/* Infos */}
                    <div style={{ padding: '0.875rem 1rem' }}>
                      <p style={{
                        fontFamily: '"Playfair Display", Georgia, serif',
                        fontSize: '0.975rem', fontWeight: 600,
                        color: '#162a0a', margin: '0 0 0.25rem', lineHeight: 1.3,
                      }}>
                        {species.name_common}
                      </p>
                      <p style={{
                        fontFamily: 'Inter, sans-serif',
                        fontStyle: 'italic', fontSize: '0.8rem',
                        color: '#a89252', margin: 0,
                      }}>
                        {species.name_scientific}
                      </p>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ════════════════════════════════════════════════════
          QUI SOMMES-NOUS — Histoire & Chiffres
      ════════════════════════════════════════════════════ */}
      <section aria-labelledby="qui-title" style={{
        background: 'linear-gradient(175deg, #F5F0E8 0%, #fdfcf9 100%)',
        paddingTop: '5.5rem', paddingBottom: '5.5rem',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Décoration */}
        <div aria-hidden="true" style={{
          position: 'absolute', bottom: '-5%', left: '-4%',
          width: 280, opacity: 0.07, color: '#2D5016',
          transform: 'rotate(-15deg)',
        }}>
          <LeafSvg />
        </div>

        <div className="container-main">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 420px), 1fr))',
            gap: '4rem', alignItems: 'center',
          }}>

            {/* Texte */}
            <div>
              <p style={{
                color: '#c78a1c', fontFamily: 'Inter, sans-serif',
                fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.16em',
                textTransform: 'uppercase', marginBottom: '0.75rem',
              }}>Notre histoire</p>
              <h2 id="qui-title" style={{
                fontFamily: '"Playfair Display", Georgia, serif',
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                fontWeight: 700, color: '#2D5016',
                lineHeight: 1.15, marginBottom: '1.75rem',
              }}>
                Une passion partagée,<br/>
                <em style={{ fontStyle: 'italic', color: '#4d8a1a' }}>depuis plus de 20 ans</em>
              </h2>
              <div style={{
                fontFamily: 'Inter, sans-serif', color: '#4a4038',
                fontSize: '1.05rem', lineHeight: 1.8,
                display: 'flex', flexDirection: 'column', gap: '1rem',
              }}>
                <p style={{ margin: 0 }}>
                  L&apos;Association Botanique et Mycologique de la Siagne rassemble des passionnés
                  de la flore et de la fonge dans un cadre méditerranéen d&apos;exception —
                  entre garrigue parfumée, forêts de pins et vallons ombragés.
                </p>
                <p style={{ margin: 0 }}>
                  Nos sorties sont avant tout des moments de <strong style={{ color: '#2D5016' }}>découverte partagée</strong> :
                  botanistes confirmés et curieux débutants cheminent ensemble, échangent, apprennent,
                  s&apos;émerveilleront.
                </p>
                <p style={{ margin: 0 }}>
                  Que vous cherchiez à identifier un champignon mystérieux, comprendre la flore
                  locale ou simplement marcher en bonne compagnie —
                  <strong style={{ color: '#2D5016' }}> vous êtes les bienvenus</strong>.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '2.25rem', flexWrap: 'wrap' }}>
                <Link href="/a-propos" style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                  background: '#2D5016', color: '#FFFFFF',
                  fontFamily: 'Inter, sans-serif', fontWeight: 700,
                  fontSize: '0.95rem', padding: '0.85rem 1.75rem',
                  borderRadius: '0.75rem', textDecoration: 'none',
                  minHeight: '50px', transition: 'all 0.2s ease',
                  boxShadow: '0 2px 12px rgba(45,80,22,0.25)',
                }}>
                  En savoir plus
                </Link>
                <Link href="/contact" style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                  background: 'transparent', color: '#2D5016',
                  border: '1.5px solid #d8e6c0',
                  fontFamily: 'Inter, sans-serif', fontWeight: 600,
                  fontSize: '0.95rem', padding: '0.85rem 1.75rem',
                  borderRadius: '0.75rem', textDecoration: 'none',
                  minHeight: '50px', transition: 'all 0.2s ease',
                }}>
                  Nous contacter
                </Link>
              </div>
            </div>

            {/* Chiffres clés */}
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr',
              gap: '1rem',
            }}>
              {[
                { num: '20+', label: 'années d\'activité', icon: '🗓️', accent: '#2D5016' },
                { num: '50+', label: 'sorties chaque année', icon: '🥾', accent: '#3a7012' },
                { num: '500+', label: 'espèces documentées', icon: '🌿', accent: '#4d8a1a' },
                { num: '100+', label: 'membres passionnés', icon: '👥', accent: '#8B6914' },
              ].map((stat, i) => (
                <div
                  key={stat.label}
                  className="stat-item"
                  style={{
                    background: '#FFFFFF',
                    borderRadius: '1.25rem',
                    padding: '1.75rem 1.5rem',
                    border: '1px solid #e8dfc8',
                    boxShadow: '0 2px 12px rgba(45,80,22,0.06)',
                    textAlign: 'center',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    animationDelay: `${i * 0.1}s`,
                  }}
                >
                  <div style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }} aria-hidden="true">
                    {stat.icon}
                  </div>
                  <div className="stat-num" style={{
                    fontFamily: '"Playfair Display", Georgia, serif',
                    fontSize: '2.25rem', fontWeight: 700,
                    color: stat.accent, lineHeight: 1,
                    transition: 'color 0.3s ease',
                  }}>
                    {stat.num}
                  </div>
                  <div style={{
                    fontFamily: 'Inter, sans-serif', fontSize: '0.825rem',
                    color: '#6b6560', marginTop: '0.5rem', lineHeight: 1.4,
                  }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          CITATION — Immersion
      ════════════════════════════════════════════════════ */}
      <section aria-label="Citation botanique" style={{
        background: 'linear-gradient(135deg, #2D5016 0%, #162a0a 100%)',
        padding: '5rem 0',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Feuilles décoratives */}
        <div aria-hidden="true" style={{
          position: 'absolute', right: '-3%', top: '-10%',
          width: 300, opacity: 0.12, color: '#8fb85a',
        }}>
          <LeafSvg />
        </div>
        <div aria-hidden="true" style={{
          position: 'absolute', left: '-2%', bottom: '-10%',
          width: 220, opacity: 0.1, color: '#b8d190',
          transform: 'rotate(180deg)',
        }}>
          <LeafSvg />
        </div>

        <div className="container-main" style={{ position: 'relative', textAlign: 'center' }}>
          <p aria-hidden="true" style={{
            fontFamily: '"Playfair Display", Georgia, serif',
            fontSize: '5rem', color: '#4d8a1a', opacity: 0.4,
            lineHeight: 0.5, marginBottom: '1rem', display: 'block',
          }}>"</p>
          <blockquote style={{
            fontFamily: '"Playfair Display", Georgia, serif',
            fontSize: 'clamp(1.4rem, 3.5vw, 2.25rem)',
            fontStyle: 'italic', fontWeight: 400,
            color: 'rgba(255,255,255,0.92)',
            lineHeight: 1.55, maxWidth: '22ch', margin: '0 auto 1.5rem',
          }}>
            Regardez profondément dans la nature et alors vous comprendrez tout beaucoup mieux.
          </blockquote>
          <p style={{
            fontFamily: 'Inter, sans-serif', fontSize: '0.825rem',
            fontWeight: 600, letterSpacing: '0.12em',
            textTransform: 'uppercase', color: '#8fb85a',
          }}>
            — Albert Einstein
          </p>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          CTA FINAL — Rejoindre
      ════════════════════════════════════════════════════ */}
      <section aria-labelledby="cta-title" style={{
        background: '#F5F0E8',
        paddingTop: '5rem', paddingBottom: '5.5rem',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Champignon décoratif */}
        <div aria-hidden="true" style={{
          position: 'absolute', right: '5%', bottom: '0',
          width: 180, opacity: 0.06, color: '#8B6914',
        }}>
          <MushroomSvg />
        </div>

        <div className="container-main" style={{ position: 'relative', textAlign: 'center', maxWidth: '680px' }}>

          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            background: '#f0f4e8', border: '1px solid #d8e6c0',
            borderRadius: '2rem', padding: '0.4rem 1rem',
            marginBottom: '2rem',
          }}>
            <span aria-hidden="true" style={{ fontSize: '0.9rem' }}>🌿</span>
            <span style={{
              fontFamily: 'Inter, sans-serif', fontSize: '0.75rem',
              fontWeight: 700, letterSpacing: '0.1em',
              textTransform: 'uppercase', color: '#3a7012',
            }}>
              Sorties ouvertes à tous
            </span>
          </div>

          <h2 id="cta-title" style={{
            fontFamily: '"Playfair Display", Georgia, serif',
            fontSize: 'clamp(2rem, 5vw, 3.25rem)',
            fontWeight: 700, color: '#2D5016',
            lineHeight: 1.15, marginBottom: '1.25rem',
          }}>
            Prêt à partir en balade<br/>
            <em style={{ fontStyle: 'italic', color: '#4d8a1a' }}>avec nous&nbsp;?</em>
          </h2>

          <p style={{
            fontFamily: 'Inter, sans-serif', color: '#4a4038',
            fontSize: '1.05rem', lineHeight: 1.75,
            marginBottom: '2.5rem', maxWidth: '52ch', margin: '0 auto 2.5rem',
          }}>
            Nos sorties sont accessibles à toutes et à tous — membres ou non.
            Venez nous rencontrer lors d&apos;une prochaine sortie,
            sans engagement, juste pour le plaisir de la découverte.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/calendrier" style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.6rem',
              background: '#2D5016', color: '#FFFFFF',
              fontFamily: 'Inter, sans-serif', fontWeight: 700,
              fontSize: '1rem', padding: '1rem 2.25rem',
              borderRadius: '0.875rem', textDecoration: 'none',
              minHeight: '54px', transition: 'all 0.2s ease',
              boxShadow: '0 4px 20px rgba(45,80,22,0.3)',
            }}>
              <span aria-hidden="true">📅</span>
              Voir les prochaines sorties
            </Link>
            <Link href="/contact" style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.6rem',
              background: '#FFFFFF', color: '#2D5016',
              border: '1.5px solid #d8e6c0',
              fontFamily: 'Inter, sans-serif', fontWeight: 600,
              fontSize: '1rem', padding: '1rem 2.25rem',
              borderRadius: '0.875rem', textDecoration: 'none',
              minHeight: '54px', transition: 'all 0.2s ease',
              boxShadow: '0 2px 8px rgba(45,80,22,0.08)',
            }}>
              <span aria-hidden="true">✉️</span>
              Nous écrire
            </Link>
          </div>

          {/* Mention rassurante */}
          <p style={{
            fontFamily: 'Inter, sans-serif', fontSize: '0.825rem',
            color: '#a89252', marginTop: '1.75rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
          }}>
            <span aria-hidden="true">✓</span>
            Ouvert à tous · Aucune inscription préalable · Gratuit pour la découverte
          </p>
        </div>
      </section>
    </>
  )
}
