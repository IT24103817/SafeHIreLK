import { useEffect } from 'react'
import { TOUR_STEPS } from '../data/tourSteps.js'

/*
  The guided tour card.

  It sits at the bottom of the screen rather than covering the page, so the
  thing being described stays visible while you read about it. The highlight is
  a ring drawn on the real element, not a cut-out overlay — far less to go
  wrong, and it still works if a step's element is not on the page.
*/
export default function TourOverlay({ stepIndex, onNext, onBack, onClose }) {
  const step = TOUR_STEPS[stepIndex]
  const isFirst = stepIndex === 0
  const isLast = stepIndex === TOUR_STEPS.length - 1

  // Highlight this step's element and bring it into view. The small delay lets
  // the tab change finish rendering first, otherwise we look for an element
  // that is not on the page yet.
  useEffect(() => {
    let element = null

    const timer = setTimeout(() => {
      if (!step.target) return
      element = document.querySelector(step.target)
      if (element === null) return

      element.classList.add('tour-ring')
      element.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 160)

    return () => {
      clearTimeout(timer)
      if (element !== null) element.classList.remove('tour-ring')
    }
  }, [step])

  // Escape leaves the tour, and the arrow keys move through it.
  useEffect(() => {
    function handleKey(event) {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowRight') onNext()
      if (event.key === 'ArrowLeft' && !isFirst) onBack()
    }

    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose, onNext, onBack, isFirst])

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label="Guided tour"
      className="fixed inset-x-0 bottom-0 z-50 p-3 sm:p-5"
    >
      <div className="mx-auto w-full max-w-lg rounded-2xl border border-brand-700 bg-brand-900 p-4 text-white shadow-2xl sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-300">
            Step {stepIndex + 1} of {TOUR_STEPS.length}
          </p>
          <button
            type="button"
            onClick={onClose}
            className="-mr-1 -mt-1 rounded-lg px-2 py-1 text-xs font-semibold text-brand-200 hover:bg-white/10 hover:text-white"
          >
            Skip tour
          </button>
        </div>

        <h2 className="mt-1.5 text-base font-bold sm:text-lg">{step.title}</h2>
        <p className="mt-1.5 text-sm leading-relaxed text-brand-100">
          {step.body}
        </p>

        <div className="mt-4 flex items-center gap-3">
          {/*
            Deliberately nowrap. With wrapping, the wider active dot drops to a
            second line at 375px and the row reads as broken rather than as
            progress.
          */}
          <div
            aria-hidden="true"
            className="flex min-w-0 flex-1 flex-nowrap items-center gap-1.5 overflow-hidden"
          >
            {TOUR_STEPS.map((_, index) => (
              <span
                key={index}
                className={
                  'h-1.5 shrink-0 rounded-full transition-all ' +
                  (index === stepIndex
                    ? 'w-5 bg-white'
                    : index < stepIndex
                      ? 'w-1.5 bg-brand-300'
                      : 'w-1.5 bg-white/25')
                }
              />
            ))}
          </div>

          {!isFirst && (
            <button
              type="button"
              onClick={onBack}
              className="rounded-lg border border-white/25 px-3 py-2 text-sm font-semibold text-white hover:bg-white/10"
            >
              Back
            </button>
          )}

          <button
            type="button"
            onClick={isLast ? onClose : onNext}
            className="rounded-lg bg-white px-4 py-2 text-sm font-bold text-brand-900 hover:bg-brand-100"
          >
            {isLast ? 'Start using it' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  )
}
