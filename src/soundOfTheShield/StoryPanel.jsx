import { useState } from 'react'
import { imgArrowUpRight, imgCardHeaderImage, imgChartNetwork, imgShieldCheck } from './assets'

const LEDGER_ENTRIES = [
  { id: 'COP-8902-X', event: 'Batch harvested & GPS-logged', timestamp: '06:15 AM, 22 Sep 2026' },
  { id: 'COP-8902-Y', event: 'Sentinel-2 satellite pass verified', timestamp: '11:40 AM, 22 Sep 2026' },
  { id: 'COP-8902-Z', event: 'Field audit signed off', timestamp: '02:05 PM, 22 Sep 2026' },
  { id: 'COP-8902-W', event: 'Farmer payment settled', timestamp: '04:30 PM, 22 Sep 2026' },
]

const TAB_BUTTON_BASE =
  'flex-[1_0_0] min-w-px px-[16px] py-[10px] relative rounded-[100px] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00ff9d] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0e1410]'

/** Tab triggers (Story / COP32 Ledger) + the matching content card, both real and switchable. */
export default function StoryPanel() {
  const [activeTab, setActiveTab] = useState('story')

  return (
    <div
      className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full"
      data-node-id="2:47"
      data-name="story-verification-section"
    >
      <div
        role="tablist"
        aria-label="Batch verification detail"
        className="bg-[#0e1410] border border-[rgba(255,255,255,0.1)] border-solid content-stretch flex items-start p-[4px] relative rounded-[100px] shrink-0 w-full"
        data-node-id="2:48"
        data-name="tab-triggers"
      >
        <button
          type="button"
          id="tab-story"
          role="tab"
          aria-selected={activeTab === 'story'}
          aria-controls="tabpanel-story"
          onClick={() => setActiveTab('story')}
          className={`${TAB_BUTTON_BASE} ${
            activeTab === 'story' ? 'bg-[rgba(29,185,84,0.1)] border border-[#1db954] border-solid' : ''
          }`}
          data-node-id="2:49"
          data-name="tab-story"
        >
          <p
            className={`[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[13px] whitespace-nowrap ${
              activeTab === 'story' ? 'text-white' : 'text-[#8e9f95]'
            }`}
          >
            The Shield Story
          </p>
        </button>
        <button
          type="button"
          id="tab-ledger"
          role="tab"
          aria-selected={activeTab === 'ledger'}
          aria-controls="tabpanel-ledger"
          onClick={() => setActiveTab('ledger')}
          className={`${TAB_BUTTON_BASE} ${
            activeTab === 'ledger' ? 'bg-[rgba(29,185,84,0.1)] border border-[#1db954] border-solid' : ''
          }`}
          data-node-id="2:51"
          data-name="tab-ledger"
        >
          <p
            className={`[word-break:break-word] font-['Inter:Medium'] font-medium leading-[normal] not-italic relative shrink-0 text-[13px] whitespace-nowrap ${
              activeTab === 'ledger' ? 'text-white' : 'text-[#8e9f95]'
            }`}
          >
            COP32 Ledger
          </p>
        </button>
      </div>

      {activeTab === 'story' ? (
        <div
          id="tabpanel-story"
          role="tabpanel"
          aria-labelledby="tab-story"
          className="backdrop-blur-[12px] bg-[rgba(18,26,21,0.4)] border border-[rgba(255,255,255,0.1)] border-solid content-stretch flex flex-col items-start overflow-clip relative rounded-[20px] shrink-0 w-full"
          data-node-id="2:53"
          data-name="story-panel-card"
        >
          <div className="h-[120px] relative shrink-0 w-full" data-node-id="2:54" data-name="card-header-image">
            <div aria-hidden className="absolute inset-0 pointer-events-none">
              <img alt="" className="absolute max-w-none object-cover size-full" src={imgCardHeaderImage} />
              <div className="absolute bg-[rgba(7,10,8,0.4)] inset-0" />
            </div>
          </div>
          <div className="content-stretch flex flex-col gap-[14px] items-start p-[20px] relative shrink-0 w-full" data-node-id="2:55" data-name="card-body-content">
            <p className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[18px] text-white w-full">
              Protecting Mt. Kenya&apos;s Buffer Zone
            </p>
            <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[1.5] not-italic relative shrink-0 text-[#8e9f95] text-[13px] w-full">
              Nyayo Tea Zones acts as a continuous, dense green belt shielding vulnerable indigenous forests from
              agricultural encroachment. For every harvest batch tracked, the physical protection perimeter of Mt.
              Kenya and the Aberdares is dynamically logged.
            </p>
            <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[1.5] not-italic relative shrink-0 text-[#8e9f95] text-[13px] w-full">
              By scanning this batch, you activate Nyashinski&apos;s sonic soundscape—recorded directly within these
              canopy buffers—bridging local Kenyan tea preservation with global COP32 ecological transparency
              covenants.
            </p>
            <div className="content-stretch flex items-center justify-between pt-[8px] relative shrink-0 w-full" data-node-id="2:59" data-name="verification-link-row">
              <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-node-id="2:60" data-name="Frame">
                <div className="content-stretch flex flex-col items-center justify-center relative shrink-0 size-[16px]" data-node-id="2:61" data-name="icon-blockchain">
                  <div className="relative shrink-0 size-[16px]" data-node-id="2:101" data-name="chart-network">
                    <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgChartNetwork} />
                  </div>
                </div>
                <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#00ff9d] text-[11px] whitespace-nowrap">
                  BLOCKID #COP-8902-X
                </p>
              </div>
              <div className="content-stretch flex flex-col items-center justify-center relative shrink-0 size-[14px]" data-node-id="2:64" data-name="icon-arrow-right-up">
                <div className="relative shrink-0 size-[14px]" data-node-id="2:107" data-name="arrow-up-right">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgArrowUpRight} />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div
          id="tabpanel-ledger"
          role="tabpanel"
          aria-labelledby="tab-ledger"
          className="backdrop-blur-[12px] bg-[rgba(18,26,21,0.4)] border border-[rgba(255,255,255,0.1)] border-solid content-stretch flex flex-col items-start overflow-clip relative rounded-[20px] shrink-0 w-full"
          data-name="ledger-panel-card"
        >
          <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
            {LEDGER_ENTRIES.map((entry, index) => (
              <div
                key={entry.id}
                className={`content-stretch flex gap-[10px] items-start p-[16px] relative shrink-0 w-full${
                  index < LEDGER_ENTRIES.length - 1 ? ' border-[rgba(255,255,255,0.05)] border-b border-solid' : ''
                }`}
              >
                <div className="relative shrink-0 size-[16px] mt-[2px]">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgShieldCheck} />
                </div>
                <div className="content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start min-w-px relative">
                  <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic relative shrink-0 text-[13px] text-white w-full">
                    {entry.event}
                  </p>
                  <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#8e9f95] text-[11px] w-full">
                    {entry.timestamp}
                  </p>
                  <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#00ff9d] text-[10px] tracking-[0.0055px] uppercase w-full">
                    BLOCKID #{entry.id}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
