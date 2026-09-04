/*
  The headline result: the score out of 100, the band, and a bar showing where
  the score sits across the three bands.

  A bar rather than a circular dial, because it can show the band boundaries
  at 30 and 60 as well as the score, and it stays readable at 375px.
*/

const BANDS = {
  low: {
    title: 'Low risk',
    bar: 'bg-safe',
    panel: 'border-safe-line bg-safe-soft',
    text: 'text-safe',
    summary:
      'Nothing in this advert matched our warning signs. Still verify the licence before you pay anything.',
  },
  caution: {
    title: 'Caution',
    bar: 'bg-caution',
    panel: 'border-caution-line bg-caution-soft',
    text: 'text-caution',
    summary:
      'Parts of this advert match how fraudulent offers are written. Verify the agency before you go any further.',
  },
  high: {
    title: 'High risk',
    bar: 'bg-danger',
    panel: 'border-danger-line bg-danger-soft',
    text: 'text-danger',
    summary:
      'This advert matches the pattern of a fraudulent offer. Do not pay any money and do not hand over your passport.',
  },
}

export default function RiskScore({ score, band, flagCount }) {
  const style = BANDS[band]

  return (
    <section className={'rounded-xl border-2 p-5 sm:p-6 ' + style.panel}>
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Risk score
          </p>
          <p className={'mt-1 text-5xl font-bold leading-none ' + style.text}>
            {score}
            <span className="text-2xl font-semibold text-slate-400">/100</span>
          </p>
        </div>

        <div className="text-right">
          <p className={'text-xl font-bold ' + style.text}>{style.title}</p>
          <p className="mt-0.5 text-xs text-slate-500">
            {flagCount === 1 ? '1 warning sign' : flagCount + ' warning signs'}
          </p>
        </div>
      </div>

      <div className="mt-4">
        <div className="h-3 w-full overflow-hidden rounded-full bg-white">
          <div
            className={'h-full rounded-full ' + style.bar}
            style={{ width: score + '%' }}
          />
        </div>
        <div className="mt-1.5 flex justify-between text-xs text-slate-500">
          <span>0 · Low</span>
          <span>30 · Caution</span>
          <span>60 · High</span>
        </div>
      </div>

      <p className="mt-4 text-sm font-medium text-brand-900">{style.summary}</p>
    </section>
  )
}
