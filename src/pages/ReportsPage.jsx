import { useEffect, useMemo, useState } from 'react'
import { loadReports, updateStatus, reportKey } from '../utils/storage.js'
import {
  fetchSharedReports,
  shareReport,
  shareStatus,
} from '../utils/reportsSync.js'
import { DEMO_PASSCODE } from '../config.js'
import PageHeading from '../components/PageHeading.jsx'
import ReportForm from '../components/ReportForm.jsx'
import ReportCard from '../components/ReportCard.jsx'
import ReportFilters from '../components/ReportFilters.jsx'

/*
  Owners: C — report form and validation. D — moderation boards.

  The role prop decides which form is shown: job seekers report a suspicious
  agent or offer, agents report a candidate. Both go into the same queue and
  onto the same two boards.
*/

// Does this report match what was typed in the search box?
function matchesSearch(report, search) {
  const query = search.trim().toLowerCase()
  if (query === '') return true

  const haystack = [
    report.subject_name,
    report.description,
    report.reported_by,
    report.destination,
  ]
    .join(' ')
    .toLowerCase()

  return haystack.includes(query)
}

export default function ReportsPage({ role, isAdmin }) {
  const [reports, setReports] = useState(loadReports)
  const [boardTab, setBoardTab] = useState('verified')
  const [search, setSearch] = useState('')
  const [destination, setDestination] = useState('')
  const [submitted, setSubmitted] = useState(null)

  // Whatever the shared database returned, or null when it is unavailable.
  // Everything on this page works the same either way.
  const [shared, setShared] = useState(null)
  const [isShared, setIsShared] = useState(false)

  const isAgent = role === 'agent'

  /*
    Clear the success panel when the role changes.

    Without this: submit a report as a job seeker, then switch to the agent
    side, and the confirmation for the seeker's report is still sitting above
    a form that now asks for completely different fields.
  */
  useEffect(() => {
    setSubmitted(null)
  }, [role])

  /*
    Ask the shared database for reports from other devices, once, on arrival.

    The board has already rendered from localStorage by the time this runs, so
    a slow or missing database delays nothing. If it answers, the extra reports
    are merged in; if it does not, nobody notices.
  */
  useEffect(() => {
    let stillMounted = true

    fetchSharedReports().then((payload) => {
      if (!stillMounted || payload === null) return
      setShared(payload)
      setIsShared(true)
      setReports(loadReports(payload))
    })

    return () => {
      stillMounted = false
    }
  }, [])

  function handleSubmitted(outcome) {
    setSubmitted(outcome)
    setReports(loadReports(shared))
    setBoardTab('pending')

    // Not awaited. The success panel is already on screen; this catches up in
    // the background and is allowed to fail.
    shareReport(outcome.report)
  }

  function handleStatusChange(report, status) {
    const key = reportKey(report)
    updateStatus(key, status)
    setReports(loadReports(shared))
    shareStatus(key, status, DEMO_PASSCODE)
  }

  // Verified is the public board. Awaiting review holds pending reports, plus
  // rejected ones while a moderator is signed in, so a reject can be seen and
  // undone rather than silently vanishing.
  const inTab = useMemo(() => {
    if (boardTab === 'verified') {
      return reports.filter((report) => report.status === 'verified')
    }
    return reports.filter(
      (report) =>
        report.status === 'pending' || (isAdmin && report.status === 'rejected')
    )
  }, [reports, boardTab, isAdmin])

  const visible = useMemo(
    () =>
      inTab.filter(
        (report) =>
          matchesSearch(report, search) &&
          (destination === '' || report.destination === destination)
      ),
    [inTab, search, destination]
  )

  const destinations = useMemo(() => {
    const found = new Set(reports.map((report) => report.destination))
    return [...found].sort()
  }, [reports])

  const verifiedCount = reports.filter((r) => r.status === 'verified').length
  const pendingCount = reports.filter(
    (r) => r.status === 'pending' || (isAdmin && r.status === 'rejected')
  ).length

  const isFiltered = search.trim() !== '' || destination !== ''

  function clearFilters() {
    setSearch('')
    setDestination('')
  }

  return (
    <div>
      <PageHeading
        title="Reports"
        intro={
          isAgent
            ? 'Report a candidate who absconded or defaulted, and see reports submitted by other licensed agencies.'
            : 'Report a suspicious agent or job offer, and see reports already submitted by other job seekers.'
        }
      />

      {/* ---------- Report an incident ---------- */}
      <section className="rounded-xl border border-brand-100 bg-white p-4 shadow-sm sm:p-5">
        <h3 className="text-base font-bold text-brand-900">
          {isAgent ? 'Report a candidate' : 'Report an agent or offer'}
        </h3>

        {submitted === null ? (
          <div className="mt-4">
            <ReportForm role={role} onSubmitted={handleSubmitted} />
          </div>
        ) : (
          <div className="mt-4 rounded-xl border border-safe-line bg-safe-soft p-4 sm:p-5">
            <div className="flex items-start gap-3">
              <span aria-hidden="true" className="mt-0.5 shrink-0 text-safe">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6"
                >
                  <circle cx="12" cy="12" r="9" />
                  <path d="m8.5 12.5 2.5 2.5 4.5-5" />
                </svg>
              </span>
              <div className="min-w-0">
                <h4 className="text-base font-bold text-safe">
                  Thank you. Your report has been received.
                </h4>
                <p className="mt-1 text-sm text-brand-900">
                  It is saved as report {submitted.report.id} and is now in the
                  Awaiting review list below. A moderator checks every report
                  before it appears on the public Verified board, so it is not
                  public yet.
                </p>
              </div>
            </div>

            {!submitted.saved && (
              <p className="mt-3 rounded-lg border border-caution-line bg-white px-3 py-2.5 text-sm font-medium text-caution">
                We could not save this report on your device, so it may
                disappear when you close this page. This usually happens in
                private browsing.
              </p>
            )}

            <button
              type="button"
              onClick={() => setSubmitted(null)}
              className="mt-4 w-full rounded-xl border border-brand-300 bg-white px-4 py-3 text-sm font-bold text-brand-800 hover:border-brand-500 hover:bg-brand-50 sm:w-auto"
            >
              Submit another report
            </button>
          </div>
        )}
      </section>

      {/* ---------- The boards ---------- */}
      <section className="mt-8" data-tour="boards">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <h3 className="text-base font-bold text-brand-900">
            Reports from the community
          </h3>
          {isShared && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-safe-soft px-2.5 py-1 text-xs font-semibold text-safe">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-safe" />
              Synced across devices
            </span>
          )}
        </div>

        {isAdmin && (
          <p className="mt-3 rounded-lg border border-brand-200 bg-brand-50 px-3 py-2.5 text-sm font-medium text-brand-800">
            Moderator mode is on. Approve or reject the reports awaiting
            review.
          </p>
        )}

        <div
          role="tablist"
          aria-label="Report status"
          className="mt-3 grid grid-cols-2 gap-1 rounded-xl bg-brand-100 p-1"
        >
          <button
            type="button"
            role="tab"
            aria-selected={boardTab === 'verified'}
            onClick={() => setBoardTab('verified')}
            className={
              'rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors ' +
              (boardTab === 'verified'
                ? 'bg-white text-brand-900 shadow-sm'
                : 'text-brand-700 hover:bg-white/60')
            }
          >
            Verified reports ({verifiedCount})
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={boardTab === 'pending'}
            onClick={() => setBoardTab('pending')}
            className={
              'rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors ' +
              (boardTab === 'pending'
                ? 'bg-white text-brand-900 shadow-sm'
                : 'text-brand-700 hover:bg-white/60')
            }
          >
            Awaiting review ({pendingCount})
          </button>
        </div>

        <p className="mt-3 text-sm leading-relaxed text-slate-600">
          {boardTab === 'verified'
            ? 'These reports have been checked by a moderator.'
            : 'These reports have not been checked yet. Treat them as claims, not as proven facts.'}
        </p>

        <div className="mt-4">
          <ReportFilters
            search={search}
            onSearchChange={setSearch}
            destination={destination}
            onDestinationChange={setDestination}
            destinations={destinations}
          />
        </div>

        <div className="mt-5 space-y-4">
          {visible.length > 0 ? (
            <>
              <p className="text-sm text-slate-600">
                Showing {visible.length} of {inTab.length}{' '}
                {inTab.length === 1 ? 'report' : 'reports'}
              </p>

              {visible.map((report) => (
                <ReportCard
                  key={reportKey(report)}
                  report={report}
                  isAdmin={isAdmin}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </>
          ) : (
            <div className="rounded-xl border border-brand-100 bg-white p-6 text-center">
              {isFiltered ? (
                <>
                  <p className="text-sm font-semibold text-brand-900">
                    No reports match your search.
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    Try a different name, or choose All countries.
                  </p>
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="mt-4 rounded-xl border border-brand-300 bg-white px-4 py-2.5 text-sm font-bold text-brand-800 hover:border-brand-500 hover:bg-brand-50"
                  >
                    Clear the filters
                  </button>
                </>
              ) : boardTab === 'verified' ? (
                <>
                  <p className="text-sm font-semibold text-brand-900">
                    No verified reports yet.
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    Reports appear here once a moderator has checked them.
                  </p>
                </>
              ) : (
                <>
                  <p className="text-sm font-semibold text-brand-900">
                    Nothing is waiting for review.
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    Every report submitted so far has been checked.
                  </p>
                </>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
