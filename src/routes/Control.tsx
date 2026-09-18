/**
 * The control room.
 *
 * A developer-only surface, lazily loaded and never linked from the viewer.
 * Everything it touches is the same `ControlOverrides` object the public page
 * reads, which lives in this browser's localStorage and nowhere else — there
 * is no server to write to.
 *
 * Two conventions run through the whole page:
 *
 *   - Nullable overrides always have a visible way to say "no override".
 *     A control that can only pin a value is a one-way door.
 *   - The *draw* (which city a date resolves to) and the *viewer* (what the
 *     map is currently showing) are shown separately, because a forced city
 *     or an accelerated clock makes them disagree on purpose.
 */

import { useCallback, useEffect, useId, useMemo, useState } from 'react'
import type { MouseEvent } from 'react'

import type { ControlOverrides, MovementMode } from '@/types'
import { useOverrides } from '@/hooks/useOverrides'
import { useViewerState } from '@/hooks/useViewerState'
import {
  APP_NAME, CONTROL_ROUTE, DAY_BOUNDARY, DEFAULT_MOVEMENT_MODE, DISPLAY_NAME,
  ROAMING_RADIUS_SCALE, SECRET_SEED,
} from '@/config'
import {
  addDays, formatMinuteOfDay, hoursAheadOfViewer, isValidDateKey, localDateKey,
  timeOfDayLabel, utcDateKey, utcOffsetLabel,
} from '@/lib/timeUtils'
import { clearItineraryCache } from '@/lib/dailyDestination'
import { clearPlanCache, datasetSummary } from '@/lib/simulation'
import { roamArea } from '@/lib/geoUtils'
import { getDestinationById } from '@/data/destinations'
import DestinationCards from '@/components/control/DestinationCards'
import ItineraryPreview, { useItinerary } from '@/components/control/ItineraryPreview'
import CityPicker from '@/components/control/CityPicker'
import PlanTimeline from '@/components/control/PlanTimeline'
import {
  Badge, Button, Field, INPUT, INSET, LABEL, MUTED, Panel, Segmented, Slider, Stat, Switch,
  flagEmoji, placeLine,
} from '@/components/control/ui'
import '@/components/control/control.css'

/** How many days of itinerary the preview shows. */
const PREVIEW_DAYS = 14

/** Sentinel for "no mode override" inside the segmented control. */
const AUTO = '__auto'

const MODE_OPTIONS = [
  { value: AUTO, label: 'Auto', title: `Use the configured default (${DEFAULT_MOVEMENT_MODE})` },
  { value: 'stationary', label: 'Stationary' },
  { value: 'walking', label: 'Walking' },
  { value: 'tourist', label: 'Tourist' },
  { value: 'driving', label: 'Driving' },
]

const TIME_PRESETS: Array<{ minute: number; label: string }> = [
  { minute: 8 * 60, label: '08:00' },
  { minute: 12 * 60, label: '12:00' },
  { minute: 18 * 60, label: '18:00' },
  { minute: 22 * 60, label: '22:00' },
]

const ACCELERATED_PRESETS = [1, 2, 5]

/* -------------------------------------------------------------------------- */
/* navigation + links                                                          */
/* -------------------------------------------------------------------------- */

const CONTROL_TARGET = CONTROL_ROUTE.replace(/\/+$/, '')

/** The public route's path, derived from wherever this page is being served. */
function viewerPath(): string {
  if (typeof location === 'undefined') return '/'
  let path = location.pathname.replace(/\/+$/, '')
  if (path.endsWith(CONTROL_TARGET)) path = path.slice(0, path.length - CONTROL_TARGET.length)
  return path === '' ? '/' : path
}

/** True when this page was reached via `#/control` rather than a real path. */
function usingHashRoute(): boolean {
  if (typeof location === 'undefined') return false
  return location.hash.replace(/^#\/?/, '/').replace(/\/+$/, '') === CONTROL_TARGET
}

/**
 * The shareable link.
 *
 * Only overrides that are actually set become parameters, so a link built
 * with nothing pinned is just the plain viewer URL rather than a snapshot of
 * the defaults. `speed` is the multiplier form the query parser expects:
 * a one-minute day is 1440x.
 */
function buildShareUrl(o: ControlOverrides): string {
  const params = new URLSearchParams()
  if (o.dateOverride) params.set('date', o.dateOverride)
  if (o.seedOverride) params.set('seed', o.seedOverride)
  if (o.destinationIdOverride) params.set('city', o.destinationIdOverride)
  if (o.modeOverride) params.set('mode', o.modeOverride)
  if (o.timeOfDayOverride !== null) params.set('time', String(Math.round(o.timeOfDayOverride)))
  if (o.radiusMultiplier !== 1) params.set('radius', String(Number(o.radiusMultiplier.toFixed(2))))
  if (o.acceleratedDayMinutes > 0) {
    params.set('speed', String(Math.max(2, Math.round(1440 / o.acceleratedDayMinutes))))
  }
  if (o.planVariant > 0) params.set('variant', String(o.planVariant))
  if (o.displayNameOverride) params.set('name', o.displayNameOverride)
  if (o.debug) params.set('debug', '1')

  const query = params.toString()
  const origin = typeof location === 'undefined' ? '' : location.origin
  const hash = usingHashRoute() ? '#/' : ''
  return `${origin}${viewerPath()}${query ? `?${query}` : ''}${hash}`
}

/**
 * Query parameters the app reads.
 *
 * `readOverrides` layers the URL *on top of* localStorage, so a panel opened
 * at `/control?date=…` cannot move that setting — the URL keeps winning. That
 * is a genuinely confusing five minutes, so the page calls it out.
 */
const URL_OVERRIDE_KEYS = [
  'date', 'seed', 'city', 'mode', 'time', 'radius', 'speed', 'dayMinutes', 'variant', 'debug', 'name',
]

function urlOverrideKeys(): string[] {
  if (typeof location === 'undefined' || !location.search) return []
  const params = new URLSearchParams(location.search)
  return URL_OVERRIDE_KEYS.filter((key) => params.has(key))
}

/* -------------------------------------------------------------------------- */
/* override summary                                                            */
/* -------------------------------------------------------------------------- */

/** Human-readable list of what is currently pinned, for the header chip row. */
function activeSummary(o: ControlOverrides): string[] {
  const out: string[] = []
  if (o.dateOverride) out.push(`date ${o.dateOverride}`)
  if (o.seedOverride) out.push('seed')
  if (o.destinationIdOverride) out.push(`city ${o.destinationIdOverride}`)
  if (o.modeOverride) out.push(`mode ${o.modeOverride}`)
  if (o.timeOfDayOverride !== null) out.push(`time ${formatMinuteOfDay(o.timeOfDayOverride, false)}`)
  if (o.radiusMultiplier !== 1) out.push(`radius ${o.radiusMultiplier}x`)
  if (o.acceleratedDayMinutes > 0) out.push(`${o.acceleratedDayMinutes}m day`)
  if (o.planVariant > 0) out.push(`variant ${o.planVariant}`)
  if (o.debug) out.push('debug')
  if (o.displayNameOverride) out.push(`name ${o.displayNameOverride}`)
  return out
}

/* -------------------------------------------------------------------------- */
/* page                                                                        */
/* -------------------------------------------------------------------------- */

export default function Control() {
  const { overrides, setOverrides, reset } = useOverrides()
  const state = useViewerState(overrides)

  const dateInputId = useId()
  const seedInputId = useId()
  const timeInputId = useId()
  const radiusInputId = useId()
  const nameInputId = useId()

  /* ---- derived ---------------------------------------------------------- */

  // The real calendar day, fixed for the life of the page. Re-mounting is the
  // realistic way a dev tool crosses midnight.
  const realToday = useMemo(
    () => (DAY_BOUNDARY === 'utc' ? utcDateKey(new Date()) : localDateKey(new Date())),
    [],
  )

  // Browsing anchor. Deliberately *not* `state.dateKey`: under accelerated
  // playback that marches forward every few seconds, which would make the
  // itinerary table unreadable.
  const anchorDate = overrides.dateOverride ?? realToday
  const datePinned = overrides.dateOverride !== null

  const effectiveSeed = overrides.seedOverride?.trim() || SECRET_SEED
  const seedPinned = overrides.seedOverride !== null

  const itinerary = useItinerary(anchorDate, PREVIEW_DAYS, effectiveSeed)
  const baseline = useItinerary(anchorDate, PREVIEW_DAYS, SECRET_SEED)
  const differingDays = useMemo(
    () =>
      itinerary.reduce(
        (count, row, index) =>
          count + (baseline[index]?.destination.id === row.destination.id ? 0 : 1),
        0,
      ),
    [itinerary, baseline],
  )

  const forced = overrides.destinationIdOverride
    ? (getDestinationById(overrides.destinationIdOverride) ?? null)
    : null
  const forcedMissing = overrides.destinationIdOverride !== null && forced === null

  const timePinned = overrides.timeOfDayOverride !== null
  const timeMinute = Math.min(
    1439,
    Math.max(0, Math.round(overrides.timeOfDayOverride ?? state.live.localMinuteOfDay)),
  )

  const area = useMemo(
    () => roamArea(state.destination, ROAMING_RADIUS_SCALE * overrides.radiusMultiplier),
    [state.destination, overrides.radiusMultiplier],
  )

  const dataset = useMemo(() => datasetSummary(), [])
  const lockedByUrl = useMemo(() => urlOverrideKeys(), [])
  const summary = activeSummary(overrides)

  const clockContext = useMemo(() => {
    const now = new Date()
    return {
      offset: utcOffsetLabel(now, state.destination.timezone),
      ahead: hoursAheadOfViewer(now, state.destination.timezone),
    }
  }, [state.destination.timezone])

  /* ---- drafts ----------------------------------------------------------- */

  const [seedDraft, setSeedDraft] = useState(() => overrides.seedOverride ?? '')
  useEffect(() => {
    setSeedDraft(overrides.seedOverride ?? '')
  }, [overrides.seedOverride])

  const [nameDraft, setNameDraft] = useState(() => overrides.displayNameOverride ?? '')
  useEffect(() => {
    setNameDraft(overrides.displayNameOverride ?? '')
  }, [overrides.displayNameOverride])

  /**
   * Seeds are committed rather than typed live: swapping one rebuilds a
   * 1,319-entry permutation plus its repair pass, which is far too much work
   * to do on every keystroke.
   */
  const commitSeed = useCallback(
    (raw: string) => {
      const next = raw.trim() ? raw.trim() : null
      if (next === (overrides.seedOverride ?? null)) return
      // Both caches are keyed by seed, but the memoised orders for the old
      // seed are dead weight and the plan cache is small — drop them so the
      // new sequence is genuinely recomputed.
      clearItineraryCache()
      clearPlanCache()
      setOverrides({ seedOverride: next })
    },
    [overrides.seedOverride, setOverrides],
  )

  /* ---- share link -------------------------------------------------------- */

  const [share, setShare] = useState<{ url: string; status: 'idle' | 'copied' | 'manual' }>({
    url: '',
    status: 'idle',
  })

  useEffect(() => {
    if (share.status !== 'copied') return
    const id = window.setTimeout(
      () => setShare((current) => (current.status === 'copied' ? { ...current, status: 'idle' } : current)),
      2400,
    )
    return () => window.clearTimeout(id)
  }, [share.status])

  const copyShareLink = useCallback(() => {
    const url = buildShareUrl(overrides)
    // Clipboard access is blocked on insecure origins and inside some
    // embedded webviews; falling back to a selectable field beats a dead
    // button with no explanation.
    const write = navigator.clipboard?.writeText(url)
    if (!write) {
      setShare({ url, status: 'manual' })
      return
    }
    write.then(
      () => setShare({ url, status: 'copied' }),
      () => setShare({ url, status: 'manual' }),
    )
  }, [overrides])

  /* ---- navigation -------------------------------------------------------- */

  const goToViewer = useCallback((event: MouseEvent<HTMLAnchorElement>) => {
    if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return
    }
    event.preventDefault()
    if (usingHashRoute()) {
      history.pushState(null, '', `${location.pathname}${location.search}#/`)
      window.dispatchEvent(new Event('hashchange'))
    } else {
      history.pushState(null, '', `${viewerPath()}${location.search}`)
      window.dispatchEvent(new Event('popstate'))
    }
  }, [])

  const viewerHref = usingHashRoute() ? `${viewerPath()}#/` : viewerPath()

  /* ---- render ------------------------------------------------------------ */

  return (
    <div className="min-h-full bg-slate-100 pl-[var(--safe-left)] pr-[var(--safe-right)] text-slate-900 dark:bg-[#0b0d10] dark:text-slate-100">
      {/* ---- header --------------------------------------------------------- */}
      <header className="sticky top-0 z-30 border-b border-black/[0.06] bg-slate-100/85 backdrop-blur-xl dark:border-white/[0.07] dark:bg-[#0b0d10]/85">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center gap-x-4 gap-y-2 px-4 pb-3 pt-[calc(var(--safe-top)+0.75rem)] sm:px-6">
          <div className="flex min-w-0 items-center gap-2.5">
            <span
              aria-hidden="true"
              className="grid h-7 w-7 place-items-center rounded-lg bg-slate-900 text-[11px] font-bold text-white dark:bg-white dark:text-slate-900"
            >
              WM
            </span>
            <div className="min-w-0">
              <h1 className="truncate text-[14px] font-semibold tracking-tight">
                {APP_NAME} <span className={MUTED}>control</span>
              </h1>
              <p className={`truncate text-[11px] ${MUTED}`}>Local developer tool · not public</p>
            </div>
          </div>

          <div className="ml-auto flex flex-wrap items-center gap-2">
            <a
              href={viewerHref}
              onClick={goToViewer}
              className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-[12.5px] font-medium text-slate-700 ring-1 ring-black/10 transition-colors hover:bg-slate-50 dark:bg-white/[0.06] dark:text-slate-200 dark:ring-white/10 dark:hover:bg-white/[0.1]"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 16 16"
                className="h-3.5 w-3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9.5 3.5 5 8l4.5 4.5" />
              </svg>
              Back to viewer
            </a>
            <Button tone="danger" onClick={reset} title="Clear every local override">
              Reset all overrides
            </Button>
          </div>
        </div>

        {summary.length > 0 ? (
          <div className="mx-auto flex max-w-[1400px] flex-wrap items-center gap-1.5 px-4 pb-2.5 sm:px-6">
            <span className={LABEL}>Active</span>
            {summary.map((item) => (
              <span
                key={item}
                className="rounded-full bg-sky-500/15 px-2 py-0.5 font-mono text-[10.5px] tabular-nums text-sky-800 dark:text-sky-300"
              >
                {item}
              </span>
            ))}
          </div>
        ) : null}
      </header>

      <div className="mx-auto max-w-[1400px] space-y-4 px-4 py-4 pb-[calc(var(--safe-bottom)+3rem)] sm:px-6">
        {/* ---- banners ------------------------------------------------------ */}
        {state.accelerated ? (
          <div className="rounded-2xl bg-amber-500/15 p-4 ring-1 ring-amber-500/30">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <Badge tone="warn">Accelerated day</Badge>
              <span className="text-[13px] font-semibold text-amber-900 dark:text-amber-100">
                Simulating {state.dateKey} — {state.destination.city}
              </span>
            </div>
            <p className="mt-1.5 text-[12px] leading-snug text-amber-900/80 dark:text-amber-100/80">
              A whole simulated day passes every {overrides.acceleratedDayMinutes} real minute
              {overrides.acceleratedDayMinutes === 1 ? '' : 's'}, so the date rolls over and the
              city changes while you watch. This is not production behaviour — turn it off before
              you judge how the viewer feels.
            </p>
          </div>
        ) : null}

        {lockedByUrl.length > 0 ? (
          <div className="rounded-2xl bg-sky-500/10 p-4 text-[12.5px] leading-snug text-sky-900 ring-1 ring-sky-500/25 dark:text-sky-100">
            <strong className="font-semibold">This URL carries override parameters</strong> (
            {lockedByUrl.map((key, index) => (
              <span key={key}>
                {index > 0 ? ', ' : ''}
                <code className="font-mono">{key}</code>
              </span>
            ))}
            ). Query parameters are applied on top of anything saved here, so those particular
            controls will not appear to move. Open <code className="font-mono">{CONTROL_ROUTE}</code>{' '}
            without a query string to edit them.
          </div>
        ) : null}

        {forcedMissing ? (
          <div className="rounded-2xl bg-rose-500/15 p-4 text-[12.5px] leading-snug text-rose-900 ring-1 ring-rose-500/30 dark:text-rose-100">
            <strong className="font-semibold">Unknown destination id</strong>{' '}
            <code className="font-mono">{overrides.destinationIdOverride}</code> — the draw is
            running normally. Pick a city below or clear the force.
          </div>
        ) : null}

        {/* ---- live readout -------------------------------------------------- */}
        <section className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <Stat
            label="Viewer is showing"
            value={
              <span className="flex items-center gap-1.5">
                <span aria-hidden="true">{flagEmoji(state.destination.countryCode)}</span>
                <span className="truncate font-sans font-semibold">{state.destination.city}</span>
              </span>
            }
            sub={placeLine(state.destination.region, state.destination.country)}
          />
          <Stat
            label="Local time there"
            value={formatMinuteOfDay(state.live.localMinuteOfDay)}
            sub={`${timeOfDayLabel(state.live.localMinuteOfDay)} · ${clockContext.offset} · ${
              clockContext.ahead === 0
                ? 'same as you'
                : `${Math.abs(clockContext.ahead)}h ${clockContext.ahead > 0 ? 'ahead' : 'behind'}`
            }`}
          />
          <Stat
            label="Position"
            value={`${state.live.latitude.toFixed(4)}, ${state.live.longitude.toFixed(4)}`}
            sub={`±${Math.round(state.live.accuracyMeters)} m · heading ${
              state.live.heading === null ? '—' : `${Math.round(state.live.heading)}°`
            }`}
          />
          <Stat
            label="Status"
            value={state.live.moving ? `${state.live.speedKmh.toFixed(1)} km/h` : 'Stopped'}
            sub={`${state.displayName} · ${state.plan.mode} · day ${state.dateKey}`}
          />
        </section>

        <div className="grid gap-4 lg:grid-cols-12">
          {/* ================= main column ================================== */}
          <main className="space-y-4 lg:col-span-8">
            <Panel
              title="Date and draw"
              hint="Pick any calendar date to see what the generator resolves it to. Pinning a date also pins the viewer."
              aside={
                datePinned ? <Badge tone="pinned">Pinned</Badge> : <Badge tone="live">Live date</Badge>
              }
            >
              <div className="space-y-3">
                <div className="flex flex-wrap items-end gap-2">
                  <div className="min-w-[10rem] flex-1 space-y-1.5">
                    <label htmlFor={dateInputId} className={LABEL}>
                      Calendar date
                    </label>
                    <input
                      id={dateInputId}
                      type="date"
                      value={anchorDate}
                      onChange={(event) => {
                        const next = event.target.value
                        setOverrides({
                          dateOverride: next && isValidDateKey(next) ? next : null,
                        })
                      }}
                      className={INPUT}
                    />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Button
                      ariaLabel="Previous day"
                      title="Previous day"
                      onClick={() => setOverrides({ dateOverride: addDays(anchorDate, -1) })}
                    >
                      <svg aria-hidden="true" viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9.5 3.5 5 8l4.5 4.5" />
                      </svg>
                    </Button>
                    <Button
                      ariaLabel="Next day"
                      title="Next day"
                      onClick={() => setOverrides({ dateOverride: addDays(anchorDate, 1) })}
                    >
                      <svg aria-hidden="true" viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6.5 3.5 11 8l-4.5 4.5" />
                      </svg>
                    </Button>
                    <Button
                      tone={datePinned ? 'primary' : 'neutral'}
                      onClick={() => setOverrides({ dateOverride: null })}
                      disabled={!datePinned}
                      title="Clear the date override and follow the real calendar"
                    >
                      Today (live)
                    </Button>
                  </div>
                </div>

                <DestinationCards
                  anchorDate={anchorDate}
                  today={realToday}
                  seed={effectiveSeed}
                  forced={forced}
                  onPickDate={(dateKey) =>
                    setOverrides({ dateOverride: dateKey === realToday ? null : dateKey })
                  }
                />
              </div>
            </Panel>

            <Panel
              title={`Itinerary preview · next ${PREVIEW_DAYS} days`}
              hint={
                seedPinned ? (
                  <>
                    <span className="font-semibold text-slate-700 dark:text-slate-200">
                      {differingDays} of the next {PREVIEW_DAYS} days differ
                    </span>{' '}
                    from the built-in seed. Click a date to pin it.
                  </>
                ) : (
                  <>Running on the built-in seed. Click a date to pin it.</>
                )
              }
              aside={<Badge tone={seedPinned ? 'pinned' : 'neutral'}>{seedPinned ? 'custom seed' : 'default seed'}</Badge>}
            >
              <ItineraryPreview
                rows={itinerary}
                baseline={seedPinned ? baseline : null}
                anchorDate={anchorDate}
                onPickDate={(dateKey) =>
                  setOverrides({ dateOverride: dateKey === realToday ? null : dateKey })
                }
              />
            </Panel>

            <Panel
              title="Movement plan"
              hint={
                <>
                  {state.plan.dateKey} · {state.destination.city} · {state.plan.mode} profile ·
                  variant {overrides.planVariant}
                </>
              }
              aside={
                <Button
                  onClick={() => setOverrides({ planVariant: overrides.planVariant + 1 })}
                  title="Regenerate the day's waypoints without changing the date"
                >
                  <svg aria-hidden="true" viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M13 8a5 5 0 1 1-1.6-3.7" />
                    <path d="M13 2v3h-3" />
                  </svg>
                  Reroll plan
                </Button>
              }
            >
              <PlanTimeline
                plan={state.plan}
                nowMinute={state.live.localMinuteOfDay}
                pinned={timePinned}
              />
            </Panel>

            <Panel
              title="Force a destination"
              hint="Overrides the daily draw entirely. The itinerary above keeps showing what the generator would have picked."
              aside={
                <span className={`font-mono text-[11px] tabular-nums ${MUTED}`}>
                  {dataset.count} places · {dataset.countries} countries
                </span>
              }
            >
              <div className="space-y-3">
                <CityPicker
                  value={overrides.destinationIdOverride}
                  onChange={(id) => setOverrides({ destinationIdOverride: id })}
                />
                <div className={`${INSET} flex flex-wrap gap-x-4 gap-y-1 px-3 py-2 text-[11.5px] ${MUTED}`}>
                  {Object.entries(dataset.continents)
                    .sort((a, b) => b[1] - a[1])
                    .map(([continent, count]) => (
                      <span key={continent}>
                        {continent}{' '}
                        <span className="font-mono tabular-nums text-slate-700 dark:text-slate-300">
                          {count}
                        </span>
                      </span>
                    ))}
                </div>
              </div>
            </Panel>
          </main>

          {/* ================= sidebar ====================================== */}
          <aside className="space-y-4 lg:col-span-4">
            <Panel
              title="Seed"
              hint="Changing the seed reshuffles every past and future day. Cleared caches are rebuilt on commit, which takes a moment."
              aside={seedPinned ? <Badge tone="pinned">override</Badge> : <Badge tone="live">built-in</Badge>}
            >
              <form
                className="space-y-2"
                onSubmit={(event) => {
                  event.preventDefault()
                  commitSeed(seedDraft)
                }}
              >
                <Field label="Preview seed" htmlFor={seedInputId}>
                  <input
                    id={seedInputId}
                    type="text"
                    value={seedDraft}
                    spellCheck={false}
                    autoComplete="off"
                    placeholder={SECRET_SEED}
                    onChange={(event) => setSeedDraft(event.target.value)}
                    onBlur={(event) => commitSeed(event.target.value)}
                    className={`${INPUT} font-mono`}
                  />
                </Field>
                <div className="flex flex-wrap items-center gap-2">
                  <Button tone="primary" onClick={() => commitSeed(seedDraft)}>
                    Apply seed
                  </Button>
                  <Button
                    onClick={() => {
                      setSeedDraft('')
                      commitSeed('')
                    }}
                    disabled={!seedPinned}
                    title="Go back to the built-in seed"
                  >
                    Use built-in
                  </Button>
                </div>
                <p className={`text-[11.5px] leading-snug ${MUTED}`}>
                  {seedPinned
                    ? `${differingDays} of the next ${PREVIEW_DAYS} days differ from the built-in seed.`
                    : 'No override — every viewer sees this sequence.'}
                </p>
              </form>
            </Panel>

            <Panel title="Movement mode" hint="The walking/driving profile the day's plan is built from.">
              <Segmented
                label="Movement mode"
                value={overrides.modeOverride ?? AUTO}
                options={MODE_OPTIONS}
                onChange={(value) =>
                  setOverrides({ modeOverride: value === AUTO ? null : (value as MovementMode) })
                }
              />
              <p className={`mt-2 text-[11.5px] leading-snug ${MUTED}`}>
                Auto uses <span className="font-mono">{DEFAULT_MOVEMENT_MODE}</span>. Currently
                rendering <span className="font-mono">{state.plan.mode}</span>.
              </p>
            </Panel>

            <Panel
              title="Time of day"
              hint="Scrub through the destination's own local day without waiting for it."
              aside={timePinned ? <Badge tone="pinned">Pinned</Badge> : <Badge tone="live">Real time</Badge>}
            >
              <div className="space-y-3">
                <Field
                  label="Local minute"
                  htmlFor={timeInputId}
                  value={`${formatMinuteOfDay(timeMinute)} · ${timeOfDayLabel(timeMinute)}`}
                >
                  <Slider
                    id={timeInputId}
                    min={0}
                    max={1439}
                    step={1}
                    value={timeMinute}
                    onChange={(minute) => setOverrides({ timeOfDayOverride: minute })}
                  />
                </Field>
                <div className="flex flex-wrap gap-1.5">
                  {TIME_PRESETS.map((preset) => (
                    <Button
                      key={preset.minute}
                      compact
                      tone={timePinned && timeMinute === preset.minute ? 'primary' : 'neutral'}
                      onClick={() => setOverrides({ timeOfDayOverride: preset.minute })}
                    >
                      {preset.label}
                    </Button>
                  ))}
                  <Button
                    compact
                    tone={timePinned ? 'neutral' : 'primary'}
                    onClick={() => setOverrides({ timeOfDayOverride: null })}
                    disabled={!timePinned}
                    title="Clear the pin and track the destination's real clock"
                  >
                    Follow real time
                  </Button>
                </div>
              </div>
            </Panel>

            <Panel
              title="Roaming radius"
              hint="Multiplies the dataset radius. Wider is not always better — the land mask still confines the wander."
            >
              <Field
                label="Multiplier"
                htmlFor={radiusInputId}
                value={`${overrides.radiusMultiplier.toFixed(2)}x · ${area.radiusKm.toFixed(1)} km`}
              >
                <Slider
                  id={radiusInputId}
                  min={0.25}
                  max={3}
                  step={0.05}
                  value={Math.min(3, Math.max(0.25, overrides.radiusMultiplier))}
                  onChange={(value) => setOverrides({ radiusMultiplier: value })}
                />
              </Field>
              <div className="mt-2 flex items-center justify-between gap-2">
                <span className={`text-[11.5px] ${MUTED}`}>
                  Dataset value for {state.destination.city}:{' '}
                  <span className="font-mono tabular-nums">
                    {state.destination.safeRoamingRadiusKm} km
                  </span>
                </span>
                <Button
                  compact
                  onClick={() => setOverrides({ radiusMultiplier: 1 })}
                  disabled={overrides.radiusMultiplier === 1}
                >
                  Reset to 1x
                </Button>
              </div>
            </Panel>

            <Panel
              title="Accelerated day"
              hint="Compresses an entire simulated day — movement and the midnight city change — into this many real minutes."
              aside={
                overrides.acceleratedDayMinutes > 0 ? (
                  <Badge tone="warn">{overrides.acceleratedDayMinutes}m / day</Badge>
                ) : (
                  <Badge tone="neutral">off</Badge>
                )
              }
            >
              <div className="flex flex-wrap gap-1.5">
                {ACCELERATED_PRESETS.map((minutes) => (
                  <Button
                    key={minutes}
                    compact
                    tone={overrides.acceleratedDayMinutes === minutes ? 'primary' : 'neutral'}
                    onClick={() => setOverrides({ acceleratedDayMinutes: minutes })}
                  >
                    {minutes} min day
                  </Button>
                ))}
                <Button
                  compact
                  tone={overrides.acceleratedDayMinutes === 0 ? 'primary' : 'neutral'}
                  onClick={() => setOverrides({ acceleratedDayMinutes: 0 })}
                  disabled={overrides.acceleratedDayMinutes === 0}
                >
                  Off
                </Button>
              </div>
              {overrides.acceleratedDayMinutes > 0 && datePinned ? (
                <p className="mt-2 rounded-lg bg-amber-500/15 px-2 py-1.5 text-[11.5px] leading-snug text-amber-800 dark:text-amber-200">
                  A pinned date wins over accelerated playback — clear the date pin to see it run.
                </p>
              ) : null}
            </Panel>

            <Panel title="Viewer options" hint="Cosmetic and diagnostic switches for the public page.">
              <div className="space-y-3">
                <Switch
                  checked={overrides.debug}
                  onChange={(next) => setOverrides({ debug: next })}
                  hint="Shows the diagnostic overlay on the viewer."
                >
                  Debug overlay
                </Switch>

                <Field label="Display name" htmlFor={nameInputId} hint={`Blank uses the configured name (${DISPLAY_NAME}). Trimmed to 32 characters.`}>
                  <div className="flex gap-2">
                    <input
                      id={nameInputId}
                      type="text"
                      value={nameDraft}
                      maxLength={32}
                      autoComplete="off"
                      placeholder={DISPLAY_NAME}
                      onChange={(event) => setNameDraft(event.target.value)}
                      onBlur={(event) =>
                        setOverrides({ displayNameOverride: event.target.value.trim() || null })
                      }
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') event.currentTarget.blur()
                      }}
                      className={INPUT}
                    />
                    <Button
                      onClick={() => {
                        setNameDraft('')
                        setOverrides({ displayNameOverride: null })
                      }}
                      disabled={overrides.displayNameOverride === null}
                      title="Use the configured display name"
                    >
                      Clear
                    </Button>
                  </div>
                </Field>
              </div>
            </Panel>

            <Panel
              title="Share and reset"
              hint="Overrides live only in this browser's localStorage. Nothing here reaches a server, and no other visitor is affected."
            >
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  <Button tone="primary" onClick={copyShareLink}>
                    {share.status === 'copied' ? 'Copied' : 'Copy debug link'}
                  </Button>
                  <Button tone="danger" onClick={reset}>
                    Reset all local overrides
                  </Button>
                </div>

                {share.status === 'manual' ? (
                  <div className="space-y-1.5">
                    <p className={`text-[11.5px] leading-snug ${MUTED}`}>
                      The clipboard was unavailable — copy this by hand:
                    </p>
                    <input
                      readOnly
                      value={share.url}
                      aria-label="Shareable debug link"
                      onFocus={(event) => event.currentTarget.select()}
                      className={`${INPUT} font-mono text-[11px]`}
                    />
                  </div>
                ) : (
                  <p className={`break-all font-mono text-[11px] leading-snug ${MUTED}`}>
                    {buildShareUrl(overrides)}
                  </p>
                )}
              </div>
            </Panel>
          </aside>
        </div>
      </div>
    </div>
  )
}
