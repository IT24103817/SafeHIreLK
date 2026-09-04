import { getVerdict } from '../utils/search.js'

/*
  One result from the registry.

  All the thinking happens in getVerdict() in utils/search.js. This file only
  chooses a colour and some words for the verdict it is given, so the same
  three colours always mean the same three things across the whole app.
*/

const TONES = {
  safe: {
    card: 'border-safe-line bg-safe-soft',
    pill: 'bg-safe text-white',
    message: 'border-safe-line bg-white text-safe',
  },
  caution: {
    card: 'border-caution-line bg-caution-soft',
    pill: 'bg-caution text-white',
    message: 'border-caution-line bg-white text-caution',
  },
  danger: {
    card: 'border-danger-line bg-danger-soft',
    pill: 'bg-danger text-white',
    message: 'border-danger-line bg-white text-danger',
  },
}

/*
  Turn a verdict into the label, colour and sentence shown on the card.
  Written as a function rather than an object because three of the five
  states need the parent agency's name in the sentence.
*/
function describeVerdict(record, verdict) {
  if (verdict.state === 'licensed') {
    return {
      tone: 'safe',
      label: 'Licensed',
      message: 'This licence is active in the SLBFE registry sample.',
    }
  }

  if (verdict.state === 'expired') {
    return {
      tone: 'caution',
      label: 'Licence expired',
      message: 'This licence has expired. Do not pay this agency.',
    }
  }

  if (verdict.state === 'sub_agent_verified') {
    return {
      tone: 'safe',
      label: 'Sub-agent verified',
      message:
        'Operating under licence ' +
        verdict.parent.licence_no +
        ' — ' +
        verdict.parent.name +
        ' (active).',
    }
  }

  if (verdict.state === 'sub_agent_parent_expired') {
    return {
      tone: 'caution',
      label: 'Parent licence expired',
      message:
        'This sub-agent is listed under licence ' +
        verdict.parent.licence_no +
        ' — ' +
        verdict.parent.name +
        ', which has expired. Do not pay this sub-agent.',
    }
  }

  // sub_agent_unverified
  return {
    tone: 'danger',
    label: 'Sub-agent unverified',
    message:
      'This sub-agent claims licence ' +
      record.parent_licence +
      ', which does not exist in the registry.',
  }
}

export default function VerdictCard({ record, registry }) {
  const verdict = getVerdict(record, registry)
  const description = describeVerdict(record, verdict)
  const tone = TONES[description.tone]

  const details = [
    { label: 'Licence number', value: record.licence_no },
    { label: 'District', value: record.district },
    { label: 'Contact', value: record.phone },
  ]

  return (
    <article className={'rounded-xl border p-4 sm:p-5 ' + tone.card}>
      <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-2">
        <div className="min-w-0">
          <h3 className="text-base font-bold break-words text-brand-900 sm:text-lg">
            {record.name}
          </h3>
          <p className="mt-0.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
            {record.type === 'agency' ? 'Recruitment agency' : 'Sub-agent'}
          </p>
        </div>

        <span
          className={
            'shrink-0 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ' +
            tone.pill
          }
        >
          {description.label}
        </span>
      </div>

      <dl className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
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

      <p
        className={
          'mt-4 rounded-lg border px-3 py-2.5 text-sm font-medium ' +
          tone.message
        }
      >
        {description.message}
      </p>
    </article>
  )
}
