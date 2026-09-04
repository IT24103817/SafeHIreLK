import { formatMoney, formatDate } from '../utils/format.js'

/*
  One result from the shared candidate record, shown to agents.

  A verified record has been confirmed by the reporting agency. A pending one
  has not, and is marked clearly so an agency does not refuse someone on the
  strength of an unchecked claim.
*/
export default function CandidateCard({ record }) {
  const isVerified = record.status === 'verified'

  const badge = isVerified
    ? { label: 'Verified', classes: 'bg-safe text-white' }
    : { label: 'Under review', classes: 'bg-caution text-white' }

  const details = [
    { label: 'Destination', value: record.destination },
    { label: 'Amount involved', value: formatMoney(record.amount_lkr) },
    { label: 'Reported by', value: record.reported_by },
    { label: 'Date reported', value: formatDate(record.date) },
  ]

  return (
    <article
      className={
        'rounded-xl border p-4 sm:p-5 ' +
        (isVerified
          ? 'border-danger-line bg-white'
          : 'border-caution-line bg-caution-soft')
      }
    >
      <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-2">
        <div className="min-w-0">
          <h3 className="text-base font-bold break-words text-brand-900 sm:text-lg">
            {record.name}
          </h3>
          <p className="mt-0.5 font-mono text-xs text-slate-500">
            NIC {record.nic_masked} · {record.id}
          </p>
        </div>

        <span
          className={
            'shrink-0 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ' +
            badge.classes
          }
        >
          {badge.label}
        </span>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-3">
        {details.map((detail) => (
          <div key={detail.label}>
            <dt className="text-xs font-medium text-slate-500">
              {detail.label}
            </dt>
            <dd className="mt-0.5 text-sm font-semibold break-words text-brand-900">
              {detail.value}
            </dd>
          </div>
        ))}
      </dl>

      <p className="mt-4 rounded-lg border border-brand-100 bg-brand-50 px-3 py-2.5 text-sm text-brand-900">
        {record.note}
      </p>

      {!isVerified && (
        <p className="mt-3 text-sm font-medium text-caution">
          This report is still being checked. Do not treat it as proven.
        </p>
      )}
    </article>
  )
}
