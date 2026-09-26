import { imgActiveDot, imgShieldCheck } from './assets'

/** Sticky-feeling top bar: brand badge + COP32 verification chip. */
export default function HeaderBar() {
  return (
    <div
      className="border-[rgba(255,255,255,0.1)] border-b border-solid content-stretch flex items-center justify-between pb-[16px] pt-[20px] px-[16px] relative shrink-0 w-full"
      data-node-id="2:7"
      data-name="header-bar"
    >
      <div
        className="bg-[#141e18] border border-[rgba(255,255,255,0.1)] border-solid content-stretch flex gap-[6px] items-center px-[10px] py-[6px] relative rounded-[100px] shrink-0"
        data-node-id="2:8"
        data-name="branding-badge"
      >
        <div className="relative shrink-0 size-[6px]" data-node-id="2:9" data-name="active-dot">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgActiveDot} />
        </div>
        <p className="[word-break:break-word] font-['Inter'] font-semibold leading-[normal] not-italic relative shrink-0 text-[11px] text-white tracking-[0.0055px] whitespace-nowrap">
          NYAYO × NYASHINSKI
        </p>
      </div>
      <div
        className="bg-[rgba(0,255,157,0.08)] border border-[#00ff9d] border-solid content-stretch flex gap-[6px] items-center px-[10px] py-[6px] relative rounded-[100px] shadow-[0px_0px_8px_0px_#00ff9d] shrink-0"
        data-node-id="2:11"
        data-name="verified-chip"
      >
        <div
          className="content-stretch flex flex-col items-center justify-center relative shrink-0 size-[12px]"
          data-node-id="2:12"
          data-name="icon-shield-checkmark"
        >
          <div className="relative shrink-0 size-[12px]" data-node-id="2:98" data-name="shield-check">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgShieldCheck} />
          </div>
        </div>
        <p className="[word-break:break-word] font-['Inter'] font-bold leading-[normal] not-italic relative shrink-0 text-[#00ff9d] text-[11px] tracking-[0.0055px] whitespace-nowrap">
          COP32 VERIFIED
        </p>
      </div>
    </div>
  )
}
