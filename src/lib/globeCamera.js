import { Cartesian3, Math as CesiumMath, EasingFunction } from 'cesium'
import { PROOF_FLIGHT } from './mock'

const REGION_FLY_SEC = 2.5 // scroll-triggered fly-in
const FOCUS_FLY_SEC = 1.5 // chip / pin focus and drawer-close reset

const rad = (deg) => CesiumMath.toRadians(deg)

function destinationOf(view) {
  return Cartesian3.fromDegrees(view.lon, view.lat, view.height)
}

function orientationOf(view) {
  return { heading: rad(view.headingDeg ?? 0), pitch: rad(view.pitchDeg), roll: 0 }
}

/**
 * Small imperative camera controller for a #proof-style globe. Wraps a Cesium
 * Viewer with the exact moves the section needs and nothing else.
 *
 * `flight` is the `{ start, target, durationSec }` framing the section flies
 * through — `PROOF_FLIGHT` for a batch (Rift Valley → Kiptunga), `BELT_FLIGHT`
 * for the macro belt (orbit → whole belt). Focus moves take a `{ view }` and so
 * work for batch foci and belt blocks alike.
 *
 * Every move first cancels any flight already in progress, and every method
 * no-ops once the viewer is destroyed, so fast scrolling or rapid clicks cannot
 * leave a half-finished animation or a desynced camera behind. When
 * `reducedMotion` is set, animated flights collapse to instant `setView` jumps.
 */
export function createGlobeCamera(viewer, { reducedMotion = false, flight = PROOF_FLIGHT } = {}) {
  const alive = () => Boolean(viewer) && !viewer.isDestroyed()

  const move = (view, durationSec, easingFunction) => {
    if (!alive()) return
    viewer.camera.cancelFlight()
    if (reducedMotion || durationSec === 0) {
      viewer.camera.setView({ destination: destinationOf(view), orientation: orientationOf(view) })
      return
    }
    viewer.camera.flyTo({
      destination: destinationOf(view),
      orientation: orientationOf(view),
      duration: durationSec,
      easingFunction,
    })
  }

  return {
    /** Instant framing on the wide starting view — the pre-scroll resting state. */
    settleAtStart() {
      move(flight.start, 0)
    },
    /** Instant framing on the section's default target — the reduced-motion resting state. */
    settleAtOverview() {
      move(flight.target, 0)
    },
    /** Scroll-triggered fly-in: start → target, quadratic in-out. */
    flyRegion() {
      move(flight.start, 0)
      move(flight.target, flight.durationSec ?? REGION_FLY_SEC, EasingFunction.QUADRATIC_IN_OUT)
    },
    /** Chip / tab / 3D-feature focus: 1.5s to a tighter framing of one point. */
    flyFocus(focus) {
      move(focus.view, FOCUS_FLY_SEC, EasingFunction.QUADRATIC_IN_OUT)
    },
    /** Reset to the section's default overview: 1.5s. */
    flyOverview() {
      move(flight.target, FOCUS_FLY_SEC, EasingFunction.QUADRATIC_IN_OUT)
    },
    /** Stop any in-flight camera animation (called on unmount). */
    cancel() {
      if (alive()) viewer.camera.cancelFlight()
    },
  }
}
