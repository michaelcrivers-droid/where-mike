/**
 * Instrument-panel primitives.
 *
 * The control room is the one surface in WhereMike that is allowed to look
 * like a tool: dense, monospaced where numbers matter, and grouped into
 * labelled panels. Everything here is deliberately small and unopinionated so
 * the individual sections stay readable.
 */

import type { ReactNode } from 'react'

/* -------------------------------------------------------------------------- */
/* tokens                                                                      */
/* -------------------------------------------------------------------------- */

export const SURFACE =
  'rounded-2xl bg-white ring-1 ring-black/[0.06] dark:bg-white/[0.035] dark:ring-white/[0.08]'

export const INSET =
  'rounded-xl bg-slate-100/80 ring-1 ring-black/[0.04] dark:bg-black/25 dark:ring-white/[0.06]'

export const MUTED = 'text-slate-500 dark:text-slate-400'

export const LABEL =
  'text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500 dark:text-slate-400'

export const INPUT =
  'w-full rounded-lg border-0 bg-white px-3 py-2 text-sm text-slate-900 ring-1 ring-black/10 ' +
  'placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 ' +
  'dark:bg-black/30 dark:text-slate-100 dark:ring-white/10 dark:placeholder:text-slate-500'

/* -------------------------------------------------------------------------- */
/* layout                                                                      */
/* -------------------------------------------------------------------------- */

/** A titled card. `hint` sits under the title; `aside` floats top-right. */
export function Panel({
  title,
  hint,
  aside,
  children,
  className = '',
}: {
  title: string
  hint?: ReactNode
  aside?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <section className={`${SURFACE} p-4 sm:p-5 ${className}`}>
      <header className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-[13px] font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            {title}
          </h2>
          {hint ? <p className={`mt-1 text-[12px] leading-snug ${MUTED}`}>{hint}</p> : null}
        </div>
        {aside ? <div className="shrink-0">{aside}</div> : null}
      </header>
      {children}
    </section>
  )
}

/** A labelled control. Pass `htmlFor` whenever the child is a single input. */
export function Field({
  label,
  htmlFor,
  hint,
  value,
  children,
}: {
  label: string
  htmlFor?: string
  hint?: ReactNode
  /** Right-aligned readout beside the label, e.g. the live value. */
  value?: ReactNode
  children: ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between gap-3">
        {htmlFor ? (
          <label htmlFor={htmlFor} className={LABEL}>
            {label}
          </label>
        ) : (
          <span className={LABEL}>{label}</span>
        )}
        {value ? (
          <span className="font-mono text-[12px] tabular-nums text-slate-700 dark:text-slate-300">
            {value}
          </span>
        ) : null}
      </div>
      {children}
      {hint ? <p className={`text-[11.5px] leading-snug ${MUTED}`}>{hint}</p> : null}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* controls                                                                    */
/* -------------------------------------------------------------------------- */

type Tone = 'neutral' | 'primary' | 'danger' | 'ghost'

const TONES: Record<Tone, string> = {
  neutral:
    'bg-white text-slate-700 ring-1 ring-black/10 hover:bg-slate-50 ' +
    'dark:bg-white/[0.06] dark:text-slate-200 dark:ring-white/10 dark:hover:bg-white/[0.1]',
  primary:
    'bg-sky-600 text-white ring-1 ring-sky-700/30 hover:bg-sky-500 ' +
    'dark:bg-sky-500 dark:ring-white/10 dark:hover:bg-sky-400',
  danger:
    'bg-rose-600 text-white ring-1 ring-rose-700/30 hover:bg-rose-500 ' +
    'dark:bg-rose-600 dark:ring-white/10 dark:hover:bg-rose-500',
  ghost:
    'bg-transparent text-slate-600 ring-1 ring-transparent hover:bg-black/5 ' +
    'dark:text-slate-300 dark:hover:bg-white/10',
}

export function Button({
  children,
  onClick,
  tone = 'neutral',
  compact = false,
  disabled = false,
  title,
  ariaLabel,
  className = '',
}: {
  children: ReactNode
  onClick?: () => void
  tone?: Tone
  compact?: boolean
  disabled?: boolean
  title?: string
  ariaLabel?: string
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={ariaLabel}
      className={
        'inline-flex items-center justify-center gap-1.5 rounded-lg font-medium transition-colors ' +
        'disabled:cursor-not-allowed disabled:opacity-40 ' +
        (compact ? 'px-2 py-1 text-[12px] ' : 'px-3 py-1.5 text-[12.5px] ') +
        TONES[tone] +
        ' ' +
        className
      }
    >
      {children}
    </button>
  )
}

export interface SegmentedOption {
  value: string
  label: string
  title?: string
}

/**
 * A pill-shaped radio group built from real buttons.
 *
 * Nullable overrides are expressed by giving the caller a sentinel option
 * (usually "Auto") and mapping it back to `null` on the way out — a control
 * with no way to say "no override" would be a trap.
 */
export function Segmented({
  label,
  value,
  options,
  onChange,
  className = '',
}: {
  label: string
  value: string
  options: SegmentedOption[]
  onChange: (value: string) => void
  className?: string
}) {
  return (
    <div
      role="group"
      aria-label={label}
      className={`inline-flex w-full flex-wrap gap-1 rounded-xl bg-slate-100 p-1 ring-1 ring-black/[0.04] dark:bg-black/30 dark:ring-white/[0.06] ${className}`}
    >
      {options.map((option) => {
        const active = option.value === value
        return (
          <button
            key={option.value}
            type="button"
            title={option.title}
            aria-pressed={active}
            onClick={() => onChange(option.value)}
            className={
              'flex-1 whitespace-nowrap rounded-lg px-2.5 py-1.5 text-[12.5px] font-medium transition-colors ' +
              (active
                ? 'bg-white text-slate-900 shadow-sm ring-1 ring-black/[0.06] dark:bg-white/[0.14] dark:text-white dark:ring-white/10'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100')
            }
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}

/** A real switch, labelled by its own visible text. */
export function Switch({
  checked,
  onChange,
  children,
  hint,
}: {
  checked: boolean
  onChange: (next: boolean) => void
  children: ReactNode
  hint?: ReactNode
}) {
  return (
    <div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className="flex w-full items-center gap-3 rounded-xl px-1 py-1.5 text-left transition-colors hover:bg-black/[0.03] dark:hover:bg-white/[0.04]"
      >
        <span
          aria-hidden="true"
          className={
            'relative inline-block h-5 w-9 shrink-0 rounded-full transition-colors ' +
            (checked ? 'bg-sky-600 dark:bg-sky-500' : 'bg-slate-300 dark:bg-white/20')
          }
        >
          <span
            className={
              'absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-[left] ' +
              (checked ? 'left-[1.125rem]' : 'left-0.5')
            }
          />
        </span>
        <span className="text-[13px] font-medium text-slate-800 dark:text-slate-100">
          {children}
        </span>
      </button>
      {hint ? <p className={`mt-0.5 pl-12 text-[11.5px] leading-snug ${MUTED}`}>{hint}</p> : null}
    </div>
  )
}

export function Slider({
  id,
  min,
  max,
  step,
  value,
  onChange,
  ariaLabel,
}: {
  id: string
  min: number
  max: number
  step: number
  value: number
  onChange: (value: number) => void
  ariaLabel?: string
}) {
  return (
    <input
      id={id}
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      aria-label={ariaLabel}
      onChange={(event) => onChange(Number(event.target.value))}
      className="w-full cursor-pointer accent-sky-600 dark:accent-sky-400"
    />
  )
}

/* -------------------------------------------------------------------------- */
/* readouts                                                                    */
/* -------------------------------------------------------------------------- */

export function Stat({ label, value, sub }: { label: string; value: ReactNode; sub?: ReactNode }) {
  return (
    <div className={`${INSET} px-3 py-2.5`}>
      <div className={LABEL}>{label}</div>
      <div className="mt-1 font-mono text-[15px] tabular-nums leading-none text-slate-900 dark:text-slate-100">
        {value}
      </div>
      {sub ? <div className={`mt-1 text-[11px] leading-snug ${MUTED}`}>{sub}</div> : null}
    </div>
  )
}

type BadgeTone = 'neutral' | 'live' | 'pinned' | 'warn'

const BADGE_TONES: Record<BadgeTone, string> = {
  neutral: 'bg-slate-200 text-slate-700 dark:bg-white/10 dark:text-slate-300',
  live: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300',
  pinned: 'bg-sky-500/15 text-sky-700 dark:text-sky-300',
  warn: 'bg-amber-500/20 text-amber-800 dark:text-amber-200',
}

export function Badge({ tone = 'neutral', children }: { tone?: BadgeTone; children: ReactNode }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10.5px] font-semibold uppercase tracking-[0.06em] ${BADGE_TONES[tone]}`}
    >
      {children}
    </span>
  )
}

/* -------------------------------------------------------------------------- */
/* misc                                                                        */
/* -------------------------------------------------------------------------- */

/**
 * Regional-indicator flag for an ISO 3166-1 alpha-2 code. Returns an empty
 * string for anything that is not two plain letters, so a malformed row in
 * the dataset cannot emit garbage code points.
 */
export function flagEmoji(countryCode: string): string {
  const code = countryCode.trim().toUpperCase()
  if (!/^[A-Z]{2}$/.test(code)) return ''
  return String.fromCodePoint(
    0x1f1e6 + (code.charCodeAt(0) - 65),
    0x1f1e6 + (code.charCodeAt(1) - 65),
  )
}

/** "Paris · Île-de-France, France" with the empty-region case handled. */
export function placeLine(region: string, country: string): string {
  return region ? `${region}, ${country}` : country
}
