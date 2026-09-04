import { useEffect, useState } from 'react'
import { DESTINATIONS } from '../data/destinations.js'
import { validateReport, cleanPhone, cleanAmount } from '../utils/validation.js'
import { saveReport } from '../utils/storage.js'
import FormField from './FormField.jsx'

/*
  Owner: C — the report form.

  One component, two modes. A job seeker reports an agent, an agency reports a
  candidate. The fields differ but the validation, the layout and the saving
  are the same code, so there is one form to fix and one form to explain.
*/

const EMPTY_VALUES = {
  subjectName: '',
  subjectPhone: '',
  subjectNic: '',
  destination: '',
  amount: '',
  description: '',
  reportedBy: '',
}

const INPUT_BASE =
  'w-full rounded-xl border bg-white px-3.5 py-3 text-base text-brand-900 shadow-sm placeholder:text-slate-400 focus:outline-none'

function inputClasses(hasError) {
  return (
    INPUT_BASE +
    ' ' +
    (hasError
      ? 'border-danger focus:border-danger'
      : 'border-brand-200 focus:border-brand-600')
  )
}

// Turn what was typed into the shape the board and localStorage expect.
function buildReport(role, values) {
  const isAgent = role === 'agent'

  return {
    type: isAgent ? 'candidate' : 'agent',
    reported_by_role: isAgent ? 'agent' : 'seeker',
    subject_name: values.subjectName.trim(),
    subject_phone: isAgent ? null : cleanPhone(values.subjectPhone),
    subject_nic: isAgent ? values.subjectNic.trim().toUpperCase() : null,
    destination: values.destination,
    district: null,
    amount_lkr: Number(cleanAmount(values.amount)),
    contact_method: null,
    description: values.description.trim(),
    reported_by: isAgent
      ? values.reportedBy.trim()
      : 'Job seeker (name withheld)',
  }
}

export default function ReportForm({ role, onSubmitted }) {
  const [values, setValues] = useState(EMPTY_VALUES)
  const [touched, setTouched] = useState({})
  const [wasSubmitted, setWasSubmitted] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const isAgent = role === 'agent'
  const errors = validateReport(role, values)

  // Switching role changes which fields exist, so start the form again rather
  // than leaving half-filled values from the other mode behind.
  useEffect(() => {
    setValues(EMPTY_VALUES)
    setTouched({})
    setWasSubmitted(false)
  }, [role])

  // An error is only shown once the user has left that field, or once they
  // have tried to submit. Nobody wants to be told they are wrong while still
  // typing the first letter.
  function errorFor(field) {
    if (wasSubmitted || touched[field]) return errors[field]
    return undefined
  }

  function setValue(field, value) {
    setValues((current) => ({ ...current, [field]: value }))
  }

  function markTouched(field) {
    setTouched((current) => ({ ...current, [field]: true }))
  }

  function handleSubmit(event) {
    event.preventDefault()

    // Guards against a fast double click or a double tap on a phone saving
    // the same report twice.
    if (isSaving) return

    setWasSubmitted(true)

    if (Object.keys(errors).length > 0) {
      // Put the focus on the first field that needs fixing.
      const firstBadField = Object.keys(errors)[0]
      const element = document.getElementById(firstBadField)
      if (element) element.focus()
      return
    }

    setIsSaving(true)
    const outcome = saveReport(buildReport(role, values))

    setValues(EMPTY_VALUES)
    setTouched({})
    setWasSubmitted(false)
    setIsSaving(false)
    onSubmitted(outcome)
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <FormField
        id="subjectName"
        label={isAgent ? 'Candidate initials and surname' : 'Agent or agency name'}
        hint={
          isAgent
            ? 'Initials and surname only. Do not enter a full name.'
            : 'Write it exactly as they gave it to you.'
        }
        error={errorFor('subjectName')}
      >
        <input
          id="subjectName"
          type="text"
          value={values.subjectName}
          onChange={(event) => setValue('subjectName', event.target.value)}
          onBlur={() => markTouched('subjectName')}
          placeholder={isAgent ? 'K. Perera' : 'Gulf Star Manpower Services'}
          aria-invalid={errorFor('subjectName') !== undefined}
          aria-describedby={
            errorFor('subjectName') !== undefined ? 'subjectName-error' : undefined
          }
          className={inputClasses(errorFor('subjectName') !== undefined)}
        />
      </FormField>

      {isAgent ? (
        <FormField
          id="subjectNic"
          label="Masked NIC number"
          hint="Hide the middle digits before sharing, for example 9XXXXXXXXV."
          error={errorFor('subjectNic')}
        >
          <input
            id="subjectNic"
            type="text"
            value={values.subjectNic}
            onChange={(event) => setValue('subjectNic', event.target.value)}
            onBlur={() => markTouched('subjectNic')}
            placeholder="9XXXXXXXXV"
            aria-invalid={errorFor('subjectNic') !== undefined}
            aria-describedby={
              errorFor('subjectNic') !== undefined ? 'subjectNic-error' : undefined
            }
            className={inputClasses(errorFor('subjectNic') !== undefined)}
          />
        </FormField>
      ) : (
        <FormField
          id="subjectPhone"
          label="Contact number they used"
          hint="The mobile or landline the agent contacted you on."
          error={errorFor('subjectPhone')}
        >
          <input
            id="subjectPhone"
            type="tel"
            inputMode="tel"
            value={values.subjectPhone}
            onChange={(event) => setValue('subjectPhone', event.target.value)}
            onBlur={() => markTouched('subjectPhone')}
            placeholder="0771234567"
            aria-invalid={errorFor('subjectPhone') !== undefined}
            aria-describedby={
              errorFor('subjectPhone') !== undefined
                ? 'subjectPhone-error'
                : undefined
            }
            className={inputClasses(errorFor('subjectPhone') !== undefined)}
          />
        </FormField>
      )}

      <FormField
        id="destination"
        label="Destination country"
        error={errorFor('destination')}
      >
        <select
          id="destination"
          value={values.destination}
          onChange={(event) => setValue('destination', event.target.value)}
          onBlur={() => markTouched('destination')}
          aria-invalid={errorFor('destination') !== undefined}
          aria-describedby={
            errorFor('destination') !== undefined ? 'destination-error' : undefined
          }
          className={inputClasses(errorFor('destination') !== undefined)}
        >
          <option value="">Choose a country</option>
          {DESTINATIONS.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>
      </FormField>

      <FormField
        id="amount"
        label={isAgent ? 'Amount lost (LKR)' : 'Amount asked for (LKR)'}
        hint="Numbers only, no rupee sign."
        error={errorFor('amount')}
      >
        <input
          id="amount"
          type="text"
          inputMode="numeric"
          value={values.amount}
          onChange={(event) => setValue('amount', event.target.value)}
          onBlur={() => markTouched('amount')}
          placeholder="150000"
          aria-invalid={errorFor('amount') !== undefined}
          aria-describedby={
            errorFor('amount') !== undefined ? 'amount-error' : undefined
          }
          className={inputClasses(errorFor('amount') !== undefined)}
        />
      </FormField>

      {isAgent && (
        <FormField
          id="reportedBy"
          label="Your agency name"
          hint="Shown on the report so other agencies know who filed it."
          error={errorFor('reportedBy')}
        >
          <input
            id="reportedBy"
            type="text"
            value={values.reportedBy}
            onChange={(event) => setValue('reportedBy', event.target.value)}
            onBlur={() => markTouched('reportedBy')}
            placeholder="Al-Falah Manpower (Pvt) Ltd"
            aria-invalid={errorFor('reportedBy') !== undefined}
            aria-describedby={
              errorFor('reportedBy') !== undefined ? 'reportedBy-error' : undefined
            }
            className={inputClasses(errorFor('reportedBy') !== undefined)}
          />
        </FormField>
      )}

      <FormField
        id="description"
        label="What happened"
        error={errorFor('description')}
      >
        <textarea
          id="description"
          rows={5}
          value={values.description}
          onChange={(event) => setValue('description', event.target.value)}
          onBlur={() => markTouched('description')}
          placeholder={
            isAgent
              ? 'Describe what the candidate agreed to and what happened afterwards.'
              : 'Describe what you were offered, what you were asked to pay and what happened.'
          }
          aria-invalid={errorFor('description') !== undefined}
          aria-describedby={
            errorFor('description') !== undefined ? 'description-error' : undefined
          }
          className={inputClasses(errorFor('description') !== undefined)}
        />
        <p className="mt-1 text-xs text-slate-500">
          {values.description.trim().length} of 20 characters minimum
        </p>
      </FormField>

      <button
        type="submit"
        disabled={isSaving}
        aria-busy={isSaving}
        className="w-full rounded-xl bg-brand-800 px-5 py-3.5 text-sm font-bold text-white hover:bg-brand-900 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {isSaving ? 'Saving your report…' : 'Submit report'}
      </button>

      <p className="text-xs leading-relaxed text-slate-500">
        Your report is saved on this device and goes to a moderator first. It
        only appears on the public board once it has been checked.
      </p>
    </form>
  )
}
