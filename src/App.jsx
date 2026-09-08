import { Suspense, lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

// Route-level code splitting: the home and batch views both drag in GSAP +
// Cesium for the cinematic dive; the dashboard is its own app shell. Keeping
// each behind its own chunk keeps the initial handoff tiny.
const Home = lazy(() => import('./routes/Home'))
const BatchView = lazy(() => import('./routes/BatchView'))
const B2BDashboard = lazy(() => import('./routes/B2BDashboard'))

const RouteFallback = (
  <div className="grid min-h-svh place-items-center bg-forest-950">
    <span className="font-mono text-xs uppercase tracking-[0.24em] text-sage-500">
      Loading…
    </span>
  </div>
)

export default function App() {
  return (
    <Suspense fallback={RouteFallback}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/batch/:batchId" element={<BatchView />} />
        <Route path="/dashboard/*" element={<B2BDashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}
