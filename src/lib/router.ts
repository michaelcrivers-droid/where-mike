/**
 * A two-route router, hand-rolled.
 *
 * Pulling in a routing library for one hidden developer page would be more
 * bytes than the page itself. Both a real path (`/control`) and a hash
 * (`#/control`) are accepted, because static hosts differ on whether they
 * will serve index.html for an unknown path — the hash form always works.
 */

import { CONTROL_ROUTE } from '@/config'

export type Route = 'viewer' | 'control'

export function routeFrom(pathname: string, hash: string): Route {
  const normalisedPath = pathname.replace(/\/+$/, '')
  const normalisedHash = hash.replace(/^#\/?/, '/').replace(/\/+$/, '')
  const target = CONTROL_ROUTE.replace(/\/+$/, '')
  return normalisedPath.endsWith(target) || normalisedHash === target ? 'control' : 'viewer'
}

export function currentRoute(): Route {
  if (typeof location === 'undefined') return 'viewer'
  return routeFrom(location.pathname, location.hash)
}
