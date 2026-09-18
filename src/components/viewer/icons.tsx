/**
 * Hand-rolled inline icons. No icon library, and nothing borrowed from a
 * platform icon set — these are plain geometry on a 20px grid, drawn with a
 * 1.7px stroke so they sit at the same optical weight as the 13px UI text.
 */

import type { ReactNode } from 'react'

interface IconProps {
  className?: string
}

function Svg({ className, children }: IconProps & { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 20 20"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {children}
    </svg>
  )
}

export function PlusIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M10 4.6v10.8M4.6 10h10.8" />
    </Svg>
  )
}

export function MinusIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M4.6 10h10.8" />
    </Svg>
  )
}

/** Recenter: a reticle, deliberately not a compass needle or an arrow. */
export function RecenterIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <circle cx="10" cy="10" r="4.4" />
      <circle cx="10" cy="10" r="1.15" fill="currentColor" stroke="none" />
      <path d="M10 1.9v2.3M10 15.8v2.3M18.1 10h-2.3M4.2 10H1.9" />
    </Svg>
  )
}

export function InfoIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <circle cx="10" cy="10" r="7.4" />
      <path d="M10 9.1v4.4" />
      <circle cx="10" cy="6.5" r="0.95" fill="currentColor" stroke="none" />
    </Svg>
  )
}

export function CloseIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M5.6 5.6l8.8 8.8M14.4 5.6l-8.8 8.8" />
    </Svg>
  )
}
