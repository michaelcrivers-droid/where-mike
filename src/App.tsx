import { lazy, Suspense, useEffect, useState } from 'react'

import { currentRoute, type Route } from '@/lib/router'
import LoadingScreen from '@/components/LoadingScreen'

// The control panel is developer-only, so it is never in the first payload.
const ControlRoute = lazy(() => import('@/routes/Control'))
const ViewerRoute = lazy(() => import('@/routes/Viewer'))

export default function App() {
  const [route, setRoute] = useState<Route>(() => currentRoute())

  useEffect(() => {
    const sync = () => setRoute(currentRoute())
    window.addEventListener('hashchange', sync)
    window.addEventListener('popstate', sync)
    return () => {
      window.removeEventListener('hashchange', sync)
      window.removeEventListener('popstate', sync)
    }
  }, [])

  return (
    <Suspense fallback={<LoadingScreen />}>
      {route === 'control' ? <ControlRoute /> : <ViewerRoute />}
    </Suspense>
  )
}
