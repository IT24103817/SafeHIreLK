import PageHeading from '../components/PageHeading.jsx'

/*
  Owners: C — report form and validation. D — moderation boards.

  The role prop decides which report form is shown later: job seekers report a
  suspicious agent or offer, agents report a candidate. Both go into the same
  moderation queue.
*/
export default function ReportsPage({ role }) {
  const intro =
    role === 'agent'
      ? 'Report a candidate who absconded or defaulted, and see reports submitted by other licensed agencies.'
      : 'Report a suspicious agent or job offer, and see reports already submitted by other job seekers.'

  return <PageHeading title="Reports" intro={intro} />
}
