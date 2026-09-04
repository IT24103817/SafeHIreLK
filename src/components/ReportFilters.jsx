/*
  Text search and a destination filter for the report boards.

  The country list is built from the reports actually on the board, so the
  dropdown can never offer a country that returns nothing.
*/
export default function ReportFilters({
  search,
  onSearchChange,
  destination,
  onDestinationChange,
  destinations,
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div>
        <label
          htmlFor="report-search"
          className="block text-sm font-semibold text-brand-900"
        >
          Search reports
        </label>
        <input
          id="report-search"
          type="search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Name, agency or what happened"
          className="mt-1.5 w-full rounded-xl border border-brand-200 bg-white px-3.5 py-3 text-base text-brand-900 shadow-sm placeholder:text-slate-400 focus:border-brand-600 focus:outline-none"
        />
      </div>

      <div>
        <label
          htmlFor="report-destination"
          className="block text-sm font-semibold text-brand-900"
        >
          Destination country
        </label>
        <select
          id="report-destination"
          value={destination}
          onChange={(event) => onDestinationChange(event.target.value)}
          className="mt-1.5 w-full rounded-xl border border-brand-200 bg-white px-3.5 py-3 text-base text-brand-900 shadow-sm focus:border-brand-600 focus:outline-none"
        >
          <option value="">All countries</option>
          {destinations.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
