import { formatMoney, formatDate } from '../utils/format.js'

/*
  One report on the board.

  The same card serves both kinds of report and both audiences. Admin buttons
  only appear when the moderator has unlocked admin mode.
*/

const BADGES = {
  verified: {
    label: 'Verified',
    badge: 'bg-safe text-white',
    card: 'border-safe-line bg-white',
  },
  pending: {
    label: 'Unverified — under review',
    badge: 'bg-caution text-white',
    card: 'border-caution-line bg-caution-soft',
  },
  rejected: {
    label: 'Rejected',
    badge: 'bg-danger text-white',
    card: 'border-danger-line bg-danger-soft',
  },
}

export default function ReportCard({ report, isAdmin, onStatusChange }) {
  const style = BADGES[report.status] || BADGES.pending

  const details = [
    { label: 'Destination', value: report.destination },
    { label: 'Amount', value: formatMoney(report.amount_lkr) },
    { label: 'Reported by', value: report.reported_by },
    { label: 'Date', value: formatDate(report.date) },
  ]

  // Only shown when they exist, because a submitted report has no district
  // or contact method.
  if (report.district) {
    details.push({ label: 'District', value: report.district })
  }
  if (report.contact_method) {
    details.push({ label: 'Contacted by', value: report.contact_method })
  }

  return (
    <article className={'rounded-xl border p-4 shadow-sm sm:p-5 ' + style.card}>
      <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-2">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {report.type === 'candidate'
              ? 'Candidate reported by an agency'
              : 'Agent reported by a job seeker'}
          </p>
          <h3 className="mt-0.5 text-base font-bold break-words text-brand-900 sm:text-lg">
            {report.subject_name}
          </h3>
          {(report.subject_phone || report.subject_nic) && (
            <p className="mt-0.5 font-mono text-xs text-slate-500">
              {report.subject_phone
                ? report.subject_phone
                : 'NIC ' + report.subject_nic}
              {' · '}
              {report.id}
            </p>
          )}
        </div>

        <span
          className={
            'shrink-0 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ' +
            style.badge
          }
        >
          {style.label}
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

      <p className="mt-4 rounded-lg border border-brand-100 bg-brand-50 px-3 py-2.5 text-sm leading-relaxed text-brand-900">
        {report.description}
      </p>

      {isAdmin && report.status !== 'verified' && (
        <div className="mt-4 flex flex-wrap gap-2 border-t border-brand-100 pt-4">
          <button
            type="button"
            onClick={() => onStatusChange(report, 'verified')}
            className="rounded-lg bg-safe px-4 py-2.5 text-sm font-bold text-white hover:bg-green-800"
          >
            Approve
          </button>

          {report.status === 'pending' ? (
            <button
              type="button"
              onClick={() => onStatusChange(report, 'rejected')}
              className="rounded-lg border border-danger-line bg-white px-4 py-2.5 text-sm font-bold text-danger hover:bg-danger-soft"
            >
              Reject
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onStatusChange(report, 'pending')}
              className="rounded-lg border border-brand-300 bg-white px-4 py-2.5 text-sm font-bold text-brand-800 hover:bg-brand-50"
            >
              Move back to review
            </button>
          )}
        </div>
      )}

      {isAdmin && report.status === 'verified' && (
        <div className="mt-4 border-t border-brand-100 pt-4">
          <button
            type="button"
            onClick={() => onStatusChange(report, 'pending')}
            className="rounded-lg border border-brand-300 bg-white px-4 py-2.5 text-sm font-bold text-brand-800 hover:bg-brand-50"
          >
            Move back to review
          </button>
        </div>
      )}
    </article>
  )
}
