/*
  Small display helpers shared by the result cards and the report boards.
*/

// 185000 -> "Rs. 185,000"
export function formatMoney(amount) {
  if (typeof amount !== 'number' || Number.isNaN(amount)) return '—'
  return 'Rs. ' + amount.toLocaleString('en-LK')
}

// "2026-07-14" -> "14 July 2026"
export function formatDate(isoDate) {
  if (typeof isoDate !== 'string') return '—'

  const date = new Date(isoDate)
  if (Number.isNaN(date.getTime())) return isoDate

  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}
