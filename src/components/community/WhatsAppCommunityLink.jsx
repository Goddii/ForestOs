import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

const WHATSAPP_GREEN = '#25D366'
// Simulated invite: never navigates. Swap for a real chat.whatsapp.com link when the group exists.
const DEMO_INVITE_URL = 'chat.whatsapp.com/ForestOS-Demo'

function WhatsAppGlyph({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2l-.5-.3Z" />
    </svg>
  )
}

/** Simulated "Join on WhatsApp" CTA: opens a mock invite sheet instead of leaving the QR story. */
export default function WhatsAppCommunityLink({ groupName, memberCount, fontClass = "font-['Inter']" }) {
  const [isOpen, setIsOpen] = useState(false)
  const [hasJoined, setHasJoined] = useState(false)

  useEffect(() => {
    if (!isOpen) return undefined
    const onKey = (event) => event.key === 'Escape' && setIsOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen])

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={`${fontClass} flex items-center justify-center gap-[8px] w-full rounded-[12px] border border-solid px-[20px] py-[14px] text-[14px] font-bold transition-[filter] hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white`}
        style={{ color: WHATSAPP_GREEN, borderColor: `${WHATSAPP_GREEN}66`, background: `${WHATSAPP_GREEN}14` }}
        data-name="whatsapp-community-link"
      >
        <WhatsAppGlyph />
        {hasJoined ? 'Open WhatsApp community' : 'Join the WhatsApp community'}
      </button>

      {isOpen && createPortal(
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-[16px]"
          onClick={() => setIsOpen(false)}
          role="presentation"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`${groupName} WhatsApp community`}
            onClick={(event) => event.stopPropagation()}
            className={`${fontClass} w-full max-w-[380px] rounded-[20px] bg-[#111b21] text-white p-[24px] flex flex-col items-center gap-[12px] text-center`}
          >
            <div className="size-[64px] rounded-full flex items-center justify-center text-white" style={{ background: WHATSAPP_GREEN }}>
              <WhatsAppGlyph size={34} />
            </div>
            <p className="text-[18px] font-bold">{groupName}</p>
            <p className="text-[12px] text-[#8696a0]">WhatsApp Community · {memberCount} members</p>
            <p className="text-[11px] text-[#8696a0] break-all">{DEMO_INVITE_URL}</p>
            <button
              type="button"
              onClick={() => setHasJoined(true)}
              disabled={hasJoined}
              className="w-full rounded-full py-[12px] text-[14px] font-bold text-[#111b21] disabled:opacity-80"
              style={{ background: WHATSAPP_GREEN }}
            >
              {hasJoined ? "You're in ✓" : 'Join community'}
            </button>
            <button type="button" onClick={() => setIsOpen(false)} className="text-[12px] text-[#8696a0] underline">
              Close
            </button>
            <p className="text-[10px] text-[#667781]">Demo preview — no message is sent.</p>
          </div>
        </div>,
        document.body,
      )}
    </>
  )
}
