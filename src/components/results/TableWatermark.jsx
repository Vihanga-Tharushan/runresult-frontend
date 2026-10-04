export const WATERMARK_TEXT = 'www.runresult.com'

export default function TableWatermark({ text = WATERMARK_TEXT }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-10 flex select-none items-center justify-center overflow-hidden"
    >
      <span
        className="whitespace-nowrap font-extrabold uppercase tracking-[0.25em] -rotate-[30deg]"
        style={{
          color: 'rgba(15, 23, 42, 0.07)',
          fontSize: 'clamp(1.5rem, 7vw, 3.75rem)',
        }}
      >
        {text}
      </span>
    </div>
  )
}