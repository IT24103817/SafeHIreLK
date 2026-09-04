import { useRef, useState } from 'react'
import { scoreAdvert } from '../utils/riskEngine.js'
import { explainAdvert } from '../utils/aiExplain.js'
import { SAMPLE_ADVERT } from '../data/sampleAdvert.js'
import PageHeading from '../components/PageHeading.jsx'
import RiskScore from '../components/RiskScore.jsx'
import FlagList from '../components/FlagList.jsx'
import PassedChecks from '../components/PassedChecks.jsx'
import AiAnalysis from '../components/AiAnalysis.jsx'

// Owner: B — rules engine and risk score UI.

const MIN_ADVERT_LENGTH = 30

export default function ScanPage() {
  const [advert, setAdvert] = useState('')
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)

  /*
    The optional AI layer.

    'idle'    the button is offered
    'loading' waiting on the request
    'done'    an analysis came back and is shown
    'hidden'  something failed, so the whole AI section disappears

    The rules result above is never touched by any of these.
  */
  const [aiState, setAiState] = useState('idle')
  const [aiAnalysis, setAiAnalysis] = useState(null)

  /*
    Counts AI requests so a slow one cannot land on a newer scan.

    Without it: ask for an explanation, then paste a different advert and
    check it while the first request is still in flight. The old reply
    arrives afterwards and gets shown underneath the new advert's score.
  */
  const aiRequestCount = useRef(0)

  async function handleExplain() {
    const thisRequest = aiRequestCount.current + 1
    aiRequestCount.current = thisRequest

    setAiState('loading')

    const analysis = await explainAdvert(
      advert,
      result.flags.map((flag) => flag.label)
    )

    // A newer scan started while we were waiting, so this reply is stale.
    if (thisRequest !== aiRequestCount.current) return

    if (analysis === null) {
      // No dialog, no error message. The section simply is not there.
      setAiState('hidden')
      return
    }

    setAiAnalysis(analysis)
    setAiState('done')
  }

  const typedLength = advert.trim().length

  // Any new scan starts the AI section again from nothing, and abandons the
  // result of any request still in flight.
  function resetAi() {
    aiRequestCount.current = aiRequestCount.current + 1
    setAiState('idle')
    setAiAnalysis(null)
  }

  function handleCheck() {
    resetAi()

    if (typedLength === 0) {
      setError(
        'Please paste the job advertisement into the box first, then press Check this advert.'
      )
      setResult(null)
      return
    }

    if (typedLength < MIN_ADVERT_LENGTH) {
      const remaining = MIN_ADVERT_LENGTH - typedLength
      setError(
        'Please paste a bit more of the advert. We need at least ' +
          MIN_ADVERT_LENGTH +
          ' characters to check it properly — that is about ' +
          remaining +
          ' more.'
      )
      setResult(null)
      return
    }

    setError('')
    setResult(scoreAdvert(advert))
  }

  function handleSample() {
    setAdvert(SAMPLE_ADVERT)
    setError('')
    setResult(null)
    resetAi()
  }

  function handleClear() {
    setAdvert('')
    setError('')
    setResult(null)
    resetAi()
  }

  return (
    <div>
      <PageHeading
        title="Scan a job advert"
        intro="Paste an overseas job post from Facebook or WhatsApp to get a risk score out of 100, with the exact phrases that raised each warning."
      />

      <label
        htmlFor="advert-text"
        className="block text-sm font-semibold text-brand-900"
      >
        The job advertisement
      </label>

      <textarea
        id="advert-text"
        value={advert}
        onChange={(event) => {
          setAdvert(event.target.value)
          if (error !== '') setError('')
        }}
        rows={10}
        placeholder="Paste the job advertisement here"
        aria-invalid={error !== ''}
        aria-describedby={error !== '' ? 'advert-error' : undefined}
        className={
          'mt-2 w-full rounded-xl border bg-white p-4 text-base text-brand-900 shadow-sm placeholder:text-slate-400 focus:outline-none ' +
          (error !== ''
            ? 'border-danger focus:border-danger'
            : 'border-brand-200 focus:border-brand-600')
        }
      />

      <div className="mt-1 flex justify-between text-xs text-slate-500">
        <span>
          {typedLength === 0
            ? 'Copy the whole post, including the phone number.'
            : typedLength + ' characters'}
        </span>
        {advert !== '' && (
          <button
            type="button"
            onClick={handleClear}
            className="font-semibold text-brand-600 hover:text-brand-800"
          >
            Clear
          </button>
        )}
      </div>

      {error !== '' && (
        <p
          id="advert-error"
          role="alert"
          className="mt-3 rounded-lg border border-danger-line bg-danger-soft px-3 py-2.5 text-sm font-medium text-danger"
        >
          {error}
        </p>
      )}

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={handleCheck}
          className="rounded-xl bg-brand-800 px-5 py-3 text-sm font-bold text-white hover:bg-brand-900"
        >
          Check this advert
        </button>

        <button
          type="button"
          onClick={handleSample}
          className="rounded-xl border border-brand-300 bg-white px-5 py-3 text-sm font-bold text-brand-800 hover:border-brand-500 hover:bg-brand-50"
        >
          Try a sample advert
        </button>
      </div>

      {result !== null && (
        <div className="mt-6 space-y-5">
          <RiskScore
            score={result.score}
            band={result.band}
            flagCount={result.flags.length}
          />
          <FlagList flags={result.flags} />
          <PassedChecks passed={result.passed} />

          {/*
            Everything above this line is the rules engine and is already on
            the screen before any network request is made. The AI section is
            an extra the user has to ask for, and it removes itself if
            anything goes wrong.
          */}
          {aiState === 'idle' && (
            <button
              type="button"
              onClick={handleExplain}
              className="w-full rounded-xl border border-brand-300 bg-white px-5 py-3 text-sm font-bold text-brand-800 hover:border-brand-500 hover:bg-brand-50 sm:w-auto"
            >
              Explain this advert
            </button>
          )}

          {aiState === 'loading' && (
            <div
              role="status"
              className="flex items-center gap-3 rounded-xl border border-brand-200 bg-white px-4 py-3.5"
            >
              <span
                aria-hidden="true"
                className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-brand-200 border-t-brand-700"
              />
              <span className="text-sm font-medium text-brand-900">
                Reading the advert…
              </span>
            </div>
          )}

          {aiState === 'done' && <AiAnalysis analysis={aiAnalysis} />}

          <p className="text-xs leading-relaxed text-slate-500">
            This score comes from eight fixed checks applied to the text you
            pasted. It is a warning tool, not a legal ruling. Always confirm
            the agency licence on the Verify tab or by calling 1989.
          </p>
        </div>
      )}
    </div>
  )
}
