// Served from /public/media (copied in during project setup).
const FOREST_VIDEO = '/media/forest1.webm'

/**
 * Fixed, full-viewport cinematic background. The hero drives its playback head
 * and zoom via useCanopyDive; later (opaque) sections scroll over it and cover it.
 */
export default function BackgroundVideo({ videoRef }) {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-forest-950">
      <video
        ref={videoRef}
        className="h-full w-full object-cover"
        src={FOREST_VIDEO}
        muted
        playsInline
        preload="auto"
        fetchPriority="high"
        disablePictureInPicture
        aria-hidden="true"
        tabIndex={-1}
      />
      {/* Static base grade so the fixed frame always anchors type at the edges */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 90% at 50% 0%, transparent 40%, rgba(8,20,14,0.55) 100%),' +
            'linear-gradient(to bottom, rgba(8,20,14,0.35) 0%, transparent 22%, transparent 55%, rgba(8,20,14,0.9) 100%)',
        }}
      />
    </div>
  )
}
