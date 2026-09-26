import { useState } from 'react'
import { imgLeaf1 } from './assets'
import WhatsAppCommunityLink from '../components/community/WhatsAppCommunityLink'

const STATS = [
  { key: 'members', value: '24.5K', label: 'Members', tint: 'green' },
  { key: 'trees', value: '89K', label: 'Trees', tint: 'lime' },
  { key: 'counties', value: '12', label: 'Counties', tint: 'green' },
]

const TINT_CLASSES = {
  green: 'bg-[rgba(0,255,157,0.05)] border-[rgba(0,255,157,0.13)] text-[#00ff9d]',
  lime: 'bg-[rgba(29,185,84,0.05)] border-[rgba(29,185,84,0.13)] text-[#1db954]',
}

/** "Join the Shield Community" card: stat row + a working join CTA. */
export default function CommunityCard() {
  const [joined, setJoined] = useState(false)

  return (
    <div className="content-stretch flex flex-col items-start pt-[4px] relative shrink-0 w-full" data-node-id="6:83" data-name="community-section">
      <div
        className="backdrop-blur-[12px] bg-[rgba(18,26,21,0.4)] border border-[rgba(255,255,255,0.1)] border-solid content-stretch flex flex-col gap-[20px] items-start overflow-clip p-[24px] relative rounded-[20px] shrink-0 w-full"
        data-node-id="6:84"
        data-name="community-card"
      >
        <div className="bg-gradient-to-r from-[rgba(0,0,0,0)] h-px relative shrink-0 to-[rgba(0,0,0,0)] via-1/2 via-[rgba(0,255,157,0.4)] w-full" data-node-id="6:85" data-name="community-accent-line" />
        <div className="content-stretch flex flex-col gap-[8px] items-center relative shrink-0 w-full" data-node-id="6:86" data-name="community-header">
          <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-node-id="6:87" data-name="community-icon-row">
            <div className="relative shrink-0 size-[18px]" data-node-id="6:126" data-name="leaf">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgLeaf1} />
            </div>
            <p className="[word-break:break-word] font-['Inter'] font-extrabold leading-[normal] not-italic relative shrink-0 text-[22px] text-white whitespace-nowrap">
              Join the Shield Community
            </p>
          </div>
          <p className="[word-break:break-word] font-['Inter'] font-normal leading-[1.5] min-w-full not-italic relative shrink-0 text-[#8e9f95] text-[13px] text-center w-[min-content]">
            Be part of Kenya&apos;s largest music-powered conservation movement.
          </p>
        </div>
        <div className="[word-break:break-word] content-stretch flex gap-[8px] items-start justify-center leading-[normal] not-italic relative shrink-0 w-full whitespace-nowrap" data-node-id="6:91" data-name="community-stats-row">
          {STATS.map((stat) => (
            <div
              key={stat.key}
              className={`content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-center min-w-px px-[8px] py-[12px] relative rounded-[12px] border border-solid ${TINT_CLASSES[stat.tint]}`}
              data-name={`stat-${stat.key}`}
            >
              <p className="font-['Inter'] font-extrabold relative shrink-0 text-[16px]">{stat.value}</p>
              <p className="font-['Inter'] font-medium relative shrink-0 text-[#8e9f95] text-[10px]">{stat.label}</p>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setJoined(true)}
          disabled={joined}
          className="bg-[#00ff9d] content-stretch drop-shadow-[0px_4px_10px_rgba(0,255,157,0.33)] flex items-center justify-center px-[24px] py-[16px] relative rounded-[14px] shrink-0 w-full transition-transform duration-150 hover:scale-[1.01] active:scale-[0.99] disabled:hover:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0e1410]"
          data-node-id="6:101"
          data-name="community-cta-btn"
        >
          <p className="[word-break:break-word] font-['Inter'] font-extrabold leading-[normal] not-italic relative shrink-0 text-[#070a08] text-[15px] whitespace-nowrap">
            {joined ? 'Welcome to the Shield 🌿' : 'Join Now — Plant Your First Tree 🌱'}
          </p>
        </button>
        <p className="[word-break:break-word] font-['Inter'] font-normal leading-[normal] not-italic relative shrink-0 text-[10px] text-[rgba(255,255,255,0.27)] text-center w-full">
          {joined ? "You're in — check your email for next steps" : 'Free to join • No commitment required'}
        </p>
        <WhatsAppCommunityLink groupName="Shield Community" memberCount="24.5K" />
      </div>
    </div>
  )
}
