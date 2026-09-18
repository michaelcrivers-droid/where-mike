/**
 * First paint. Deliberately quiet: a soft field, a pulsing ring where the
 * marker is about to appear, and nothing that flashes.
 */
export default function LoadingScreen({ label = 'Locating…' }: { label?: string }) {
  return (
    <div
      className="fixed inset-0 grid place-items-center bg-[#e9ecef] dark:bg-[#0b0d10]"
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-col items-center gap-5">
        <span className="relative grid h-16 w-16 place-items-center">
          <span className="absolute inset-0 animate-ping rounded-full bg-sky-500/20" />
          <span className="absolute inset-2 rounded-full bg-sky-500/25" />
          <span className="relative h-4 w-4 rounded-full bg-sky-500 shadow-lg shadow-sky-500/40" />
        </span>
        <span className="text-[13px] font-medium tracking-wide text-black/45 dark:text-white/45">
          {label}
        </span>
      </div>
    </div>
  )
}
