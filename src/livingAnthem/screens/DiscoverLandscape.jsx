import { imgMapLayer } from '../assets'
import { DecryptedText } from '../fxLibrary'
import { BottomAction, ChapterIndicator, Reveal, Screen, SectionTitle, STAGGER, StatusBar } from '../chrome'

/** CH. 03 — Figma "discover-landscape" (node 3:65): the Mau Complex. */
export default function DiscoverLandscape({ onNext }) {
  return (
    <Screen name="discover-landscape">
      <Reveal delay={STAGGER.top} className="flex flex-col items-start relative shrink-0 w-full" data-name="top-content">
        <StatusBar />
        <ChapterIndicator chapter={3} />
        <SectionTitle eyebrow="THE MAU COMPLEX" lead="SACRED" accent="CANOPIES" />
      </Reveal>

      <Reveal delay={STAGGER.middle} className="flex flex-col gap-[20px] items-start px-[24px] relative shrink-0 w-full" data-name="landscape-panel">
        <div className="border border-[rgba(255,255,255,0.08)] border-solid flex h-[220px] items-start overflow-clip relative rounded-[16px] shrink-0 w-full group" data-name="map-layer">
          <img
            alt="Aerial view of the Mau Forest Complex at sunrise"
            className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[16px] size-full transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
            src={imgMapLayer}
          />
          <div className="absolute flex flex-col inset-[-1px] items-start justify-between p-[16px]" data-name="topo-lines">
            <div className="flex font-['Geist'] font-normal items-start justify-between leading-[normal] text-[#00ff87] text-[10px] w-full whitespace-nowrap">
              <p className="opacity-80"><DecryptedText text="0.0763° S" /></p>
              <p className="opacity-80"><DecryptedText text="35.7483° E" /></p>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-[8px] items-start shrink-0 w-full" data-name="discover-text">
          <h3 className="font-['Syne'] font-bold leading-[normal] text-[18px] text-white w-full">Kenya’s Beating Ecological Heart</h3>
          <p className="font-['Geist'] font-normal leading-[1.6] text-[#8a9f96] text-[14px] w-full">
            The Mau Forest acts as the massive water tower sustaining millions of lives, countless wildlife species, and the unique cultural heritage of East Africa. This is the sacred sanctuary we are restoring.
          </p>
        </div>
      </Reveal>

      <BottomAction label="LIVE VERIFICATION DATA" onNext={onNext} />
    </Screen>
  )
}
