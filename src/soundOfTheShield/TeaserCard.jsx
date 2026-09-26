import { useState } from 'react'
import { Bell, BellRing, Check } from 'lucide-react'
import { imgTeaserGlow } from './assets'

/** "Coming Soon" teaser card for the Aberdare live concert, with working access/notify actions. */
export default function TeaserCard() {
  const [accessRequested, setAccessRequested] = useState(false)
  const [notifyOn, setNotifyOn] = useState(false)

  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="6:104" data-name="teaser-section">
      <div
        className="bg-[#0e1410] border border-[rgba(0,255,157,0.2)] border-solid content-stretch flex flex-col gap-[16px] items-start overflow-clip p-[20px] relative rounded-[20px] shrink-0 w-full"
        data-node-id="6:105"
        data-name="teaser-card"
      >
        <div className="absolute left-[259px] size-[160px] top-[-41px]" data-node-id="6:106" data-name="teaser-glow">
          <div className="absolute inset-[-18.75%]">
            <img alt="" className="block max-w-none size-full" src={imgTeaserGlow} />
          </div>
        </div>
        <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-node-id="6:107" data-name="teaser-top-row">
          <div className="bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)] border-solid content-stretch flex items-start px-[10px] py-[5px] relative rounded-[100px] shrink-0" data-node-id="6:108" data-name="coming-soon-badge">
            <p className="[word-break:break-word] font-['Inter'] font-bold leading-[normal] not-italic relative shrink-0 text-[#8e9f95] text-[10px] tracking-[0.01px] uppercase whitespace-nowrap">
              Coming Soon
            </p>
          </div>
          <div className="bg-[rgba(29,185,84,0.1)] border border-[rgba(29,185,84,0.2)] border-solid content-stretch flex items-start px-[10px] py-[5px] relative rounded-[100px] shrink-0" data-node-id="6:110" data-name="teaser-countdown-badge">
            <p className="[word-break:break-word] font-['Inter'] font-bold leading-[normal] not-italic relative shrink-0 text-[#1db954] text-[10px] whitespace-nowrap">
              DEC 2026
            </p>
          </div>
        </div>
        <div className="[word-break:break-word] content-stretch flex flex-col gap-[6px] items-start not-italic relative shrink-0 w-full" data-node-id="6:112" data-name="teaser-body">
          <p className="font-['Inter'] font-extrabold leading-[1.25] relative shrink-0 text-[18px] text-white w-full">
            Nyashinski Live at Aberdare
          </p>
          <p className="font-['Inter'] font-medium leading-[1.45] relative shrink-0 text-[#8e9f95] text-[13px] w-full">
            The Shield Concert 🎤🌲 December 2026
          </p>
        </div>
        <div className="bg-[rgba(255,255,255,0.06)] h-px relative shrink-0 w-full" data-node-id="6:115" data-name="teaser-divider" />
        <div className="content-stretch flex gap-[12px] items-center relative shrink-0 w-full" data-node-id="6:116" data-name="teaser-actions">
          <button
            type="button"
            onClick={() => setAccessRequested(true)}
            disabled={accessRequested}
            className={`content-stretch flex items-center justify-center gap-[6px] px-[20px] py-[12px] relative rounded-[10px] shrink-0 border border-solid transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00ff9d] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0e1410] ${
              accessRequested
                ? 'bg-[rgba(0,255,157,0.1)] border-[rgba(0,255,157,0.3)]'
                : 'bg-[rgba(0,0,0,0)] border-[#00ff9d] shadow-[0px_0px_10px_0px_rgba(0,255,157,0.13)] hover:bg-[rgba(0,255,157,0.06)]'
            }`}
            data-node-id="6:117"
            data-name="teaser-cta-btn"
          >
            {accessRequested && <Check className="size-[13px] text-[#00ff9d]" strokeWidth={2.5} aria-hidden="true" />}
            <p className="[word-break:break-word] font-['Inter'] font-bold leading-[normal] not-italic relative shrink-0 text-[#00ff9d] text-[13px] whitespace-nowrap">
              {accessRequested ? "You're on the list" : 'Get Early Access'}
            </p>
          </button>
          <button
            type="button"
            onClick={() => setNotifyOn((current) => !current)}
            aria-pressed={notifyOn}
            className="content-stretch flex gap-[4px] items-center px-[4px] py-[12px] relative shrink-0 rounded-[8px] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00ff9d] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0e1410]"
            data-node-id="6:119"
            data-name="teaser-notify-row"
          >
            {notifyOn ? (
              <BellRing className="size-[12px] text-[#00ff9d]" strokeWidth={2} aria-hidden="true" />
            ) : (
              <Bell className="size-[12px] text-[#8e9f95]" strokeWidth={2} aria-hidden="true" />
            )}
            <p
              className={`[word-break:break-word] font-['Inter'] font-medium leading-[normal] not-italic relative shrink-0 text-[12px] whitespace-nowrap ${
                notifyOn ? 'text-[#00ff9d]' : 'text-[#8e9f95]'
              }`}
            >
              {notifyOn ? 'Notified' : 'Notify Me'}
            </p>
          </button>
        </div>
      </div>
    </div>
  )
}
