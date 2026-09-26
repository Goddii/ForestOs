import { imgSplashBg } from './assets'

const OTHER_ROWS = [
  { rank: 2, name: 'Safaricom', trees: '11,203 Trees Planted', barWidth: 35 },
  { rank: 3, name: 'Equity Bank', trees: '9,456 Trees Planted', barWidth: 29 },
  { rank: 4, name: 'Sauti Sol', trees: '7,891 Trees Planted', barWidth: 24 },
  { rank: 5, name: 'EABL (Tusker)', trees: '6,234 Trees Planted', barWidth: 19 },
  { rank: 6, name: 'Bien-Aimé', trees: '4,567 Trees Planted', barWidth: 14 },
]

/** "Conservation Champions" leaderboard: highlighted #1 row + ranked list. */
export default function Leaderboard() {
  return (
    <div
      className="content-stretch flex flex-col gap-[14px] items-start relative shrink-0 w-full"
      data-node-id="6:18"
      data-name="leaderboard-section"
    >
      <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-node-id="6:19" data-name="leaderboard-header-row">
        <p className="[word-break:break-word] font-['Inter'] font-extrabold leading-[normal] not-italic relative shrink-0 text-[17px] text-white whitespace-nowrap">
          Conservation Champions 🌿
        </p>
        <div className="bg-[rgba(29,185,84,0.1)] border border-[rgba(29,185,84,0.2)] border-solid content-stretch flex items-start px-[8px] py-[4px] relative rounded-[100px] shrink-0" data-node-id="6:21" data-name="leaderboard-season-badge">
          <p className="[word-break:break-word] font-['Inter'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#1db954] text-[10px] whitespace-nowrap">
            COP32 Season
          </p>
        </div>
      </div>

      <div
        className="backdrop-blur-[8px] bg-gradient-to-r border border-[rgba(0,255,157,0.27)] border-solid content-stretch flex from-[rgba(0,255,157,0.13)] gap-[12px] items-center p-[14px] relative rounded-[14px] shadow-[0px_0px_16px_0px_rgba(0,255,157,0.13)] shrink-0 to-[rgba(29,185,84,0.08)] w-full"
        data-node-id="6:23"
        data-name="leaderboard-row-1"
      >
        <div className="bg-[#00ff9d] content-stretch flex flex-col items-center justify-center relative rounded-[14px] shrink-0 size-[28px]" data-node-id="6:24" data-name="rank-badge-1">
          <p className="[word-break:break-word] font-['Inter'] font-black leading-[normal] not-italic relative shrink-0 text-[#070a08] text-[12px] whitespace-nowrap">1</p>
        </div>
        <div className="border-2 border-[#00ff9d] border-solid relative rounded-[18px] shrink-0 size-[36px]" data-node-id="6:26" data-name="row-1-avatar">
          <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[18px] size-full" src={imgSplashBg} />
        </div>
        <div className="content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start min-w-px relative" data-node-id="6:27" data-name="row-1-info">
          <div className="content-stretch flex gap-[6px] items-center relative shrink-0" data-node-id="6:28" data-name="row-1-name-row">
            <p className="[word-break:break-word] font-['Inter'] font-extrabold leading-[normal] not-italic relative shrink-0 text-[14px] text-white whitespace-nowrap">
              Nyashinski
            </p>
            <div className="bg-[rgba(0,255,157,0.13)] content-stretch flex flex-col items-center justify-center relative rounded-[8px] shrink-0 size-[16px]" data-node-id="6:30" data-name="row-1-crown">
              <p className="[word-break:break-word] font-['Inter'] font-normal leading-[normal] not-italic relative shrink-0 text-[9px] text-black whitespace-nowrap">👑</p>
            </div>
          </div>
          <p className="[word-break:break-word] font-['Inter'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#00ff9d] text-[11px] whitespace-nowrap">
            12,847 Trees Planted
          </p>
        </div>
        <div className="content-stretch flex flex-col gap-[3px] items-end relative shrink-0 w-[48px]" data-node-id="6:33" data-name="row-1-bar-wrap">
          <div className="bg-[rgba(255,255,255,0.08)] content-stretch flex h-[4px] items-start overflow-clip relative rounded-[2px] shrink-0 w-[48px]" data-node-id="6:34" data-name="row-1-bar-track">
            <div className="bg-[#00ff9d] h-[4px] relative shrink-0 w-[48px]" data-node-id="6:35" data-name="row-1-bar-fill" />
          </div>
          <p className="[word-break:break-word] font-['Inter'] font-semibold leading-[normal] not-italic relative shrink-0 text-[9px] text-[rgba(0,255,157,0.4)] whitespace-nowrap">
            100%
          </p>
        </div>
      </div>

      <div
        className="backdrop-blur-[8px] bg-[rgba(18,26,21,0.4)] border border-[rgba(255,255,255,0.1)] border-solid content-stretch flex flex-col items-start overflow-clip relative rounded-[14px] shrink-0 w-full"
        data-node-id="6:37"
        data-name="leaderboard-others-card"
      >
        {OTHER_ROWS.map((row, index) => (
          <div
            key={row.rank}
            className={`content-stretch flex gap-[12px] items-center px-[14px] py-[12px] relative shrink-0 w-full${
              index < OTHER_ROWS.length - 1 ? ' border-[rgba(255,255,255,0.05)] border-b border-solid' : ''
            }`}
            data-name={`leaderboard-row-${row.rank}`}
          >
            <div className="bg-[rgba(255,255,255,0.08)] content-stretch flex flex-col items-center justify-center relative rounded-[12px] shrink-0 size-[24px]" data-name={`rank-badge-${row.rank}`}>
              <p className="[word-break:break-word] font-['Inter'] font-bold leading-[normal] not-italic relative shrink-0 text-[#8e9f95] text-[11px] whitespace-nowrap">
                {row.rank}
              </p>
            </div>
            <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-px items-start leading-[normal] min-w-px not-italic relative whitespace-nowrap" data-name={`row-${row.rank}-info`}>
              <p className="font-['Inter'] font-bold relative shrink-0 text-[#e5e7eb] text-[13px]">{row.name}</p>
              <p className="font-['Inter'] font-normal relative shrink-0 text-[#8e9f95] text-[11px]">{row.trees}</p>
            </div>
            <div className="content-stretch flex flex-col items-end relative shrink-0 w-[40px]" data-name={`row-${row.rank}-bar-wrap`}>
              <div className="bg-[rgba(255,255,255,0.08)] content-stretch flex h-[3px] items-start overflow-clip relative rounded-[2px] shrink-0 w-[40px]" data-name={`row-${row.rank}-bar-track`}>
                <div className="bg-[#1db954] h-[3px] relative shrink-0" style={{ width: `${row.barWidth}px` }} data-name={`row-${row.rank}-bar-fill`} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
