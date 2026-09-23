import { useEffect, useRef, useState } from 'react'
import Hook from '../majaniNyashinski/Hook'
import MusicMoment from '../majaniNyashinski/MusicMoment'
import TeaReveal from '../majaniNyashinski/TeaReveal'
import OriginProof from '../majaniNyashinski/OriginProof'
import ClimateStory from '../majaniNyashinski/ClimateStory'
import GuardianReveal from '../majaniNyashinski/GuardianReveal'
import CommunitySection from '../majaniNyashinski/CommunitySection'
import Finale from '../majaniNyashinski/Finale'
import { experienceData, COPY } from '../majaniNyashinski/data'
import { trackEvent, EVENTS } from '../majaniNyashinski/analytics'

/**
 * `/majani/nyashinski` — a premium, isolated cultural-campaign experience
 * for the Nyashinski × Majani Guardian Edition collaboration. Narrative
 * order: hook → music → tea origin → ForestOS proof → climate/COP32 →
 * Guardian identity → community → final reveal + CTAs.
 *
 * Fully isolated from the other three systems already covering related
 * ground in this repo (`/qr-experience`, `/nyashinski-forest`, the real
 * `/passport/majani/:batchId` tenant passport) — its own route, its own
 * `src/majaniNyashinski/` folder, no shared component or data-file edits.
 */
export default function MajaniNyashinski() {
  const [acted, setActed] = useState(false)
  const sectionRefs = useRef({})

  useEffect(() => {
    document.title = 'Nyashinski × Majani — The Guardian Edition | ForestOS'
    trackEvent(EVENTS.QR_SCAN)
    trackEvent(EVENTS.ENTER_EXPERIENCE)
  }, [])

  function scrollTo(key) {
    sectionRefs.current[key]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function registerRef(key) {
    return (node) => {
      sectionRefs.current[key] = node
    }
  }

  return (
    <div className="bg-bone">
      <Hook onEnter={() => scrollTo('music')} />

      <div ref={registerRef('music')}>
        <MusicMoment
          spotifyUrl={experienceData.artist.spotifyUrl}
          messageLabel={experienceData.artist.messageLabel}
          onSpotifyClick={() => trackEvent(EVENTS.SPOTIFY_CLICK, { from: 'music_moment' })}
        />
      </div>

      <div ref={registerRef('tea')}>
        <TeaReveal
          product={experienceData.track.product}
          landmark={experienceData.origin.landmark}
          region={experienceData.origin.region}
          onContinue={() => {
            trackEvent(EVENTS.VIEW_ORIGIN)
            scrollTo('proof')
          }}
        />
      </div>

      <div ref={registerRef('proof')}>
        <OriginProof
          standard={experienceData.verification.standard}
          status={experienceData.verification.status}
          reference={experienceData.verification.reference}
          verifiedAt={experienceData.verification.verifiedAt}
          collectionCentre={experienceData.origin.collectionCentre}
          farmersRepresented={experienceData.origin.farmersRepresented}
          proofUrl={experienceData.verification.proofUrl}
          onViewOrigin={() => {
            trackEvent(EVENTS.VIEW_CONSERVATION)
            scrollTo('climate')
          }}
        />
      </div>

      <div ref={registerRef('climate')}>
        <ClimateStory
          host={experienceData.climate.host}
          dateLabel={experienceData.climate.dateLabel}
          treesFundedSoFar={experienceData.climate.treesFundedSoFar}
          disclaimer={COPY.climateDisclaimer}
          onContinue={() => scrollTo('guardian')}
        />
      </div>

      <div ref={registerRef('guardian')}>
        <GuardianReveal
          editionName={experienceData.guardian.editionName}
          onContinue={() => scrollTo('community')}
        />
      </div>

      <div ref={registerRef('community')}>
        <CommunitySection
          covenantHa={experienceData.conservation.covenantHa}
          demoScans={experienceData.community.demoScans}
          demoGuardians={experienceData.community.demoGuardians}
          demoConservationActions={experienceData.community.demoConservationActions}
          demoTopGuardianRegions={experienceData.community.demoTopGuardianRegions}
          onJoin={() => {
            trackEvent(EVENTS.JOIN_COMMUNITY)
            scrollTo('finale')
          }}
        />
      </div>

      <div ref={registerRef('finale')}>
        <Finale
          spotifyUrl={experienceData.artist.spotifyUrl}
          discoverUrl={experienceData.verification.proofUrl}
          onSpotifyClick={() => trackEvent(EVENTS.SPOTIFY_CLICK, { from: 'finale' })}
          onDiscoverClick={() => trackEvent(EVENTS.FORESTOS_CLICK, { from: 'finale_discover' })}
          onActClick={() => {
            trackEvent(EVENTS.FORESTOS_CLICK, { from: 'finale_act' })
            setActed(true)
          }}
        />
      </div>

      {acted && (
        <div
          role="status"
          className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-sm rounded-2xl border border-line bg-card px-5 py-4 text-center shadow-[0_18px_50px_-12px_rgba(0,0,0,0.35)] sm:inset-x-auto sm:right-6"
        >
          <p className="font-sans text-sm font-semibold text-ink">You're on the list, Guardian.</p>
          <p className="mt-1 text-[12px] text-ink-muted">
            The full Guardian community isn't open yet — we'll reach out when it is.
          </p>
          <button
            type="button"
            onClick={() => setActed(false)}
            className="mt-3 rounded font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-800/50"
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  )
}
