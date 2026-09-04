/*
  Shared heading for every page so all five tabs look like one product.
  Read-only for the team — add page content underneath it, not inside it.
*/
export default function PageHeading({ title, intro }) {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold tracking-tight text-brand-900 sm:text-2xl">
        {title}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">{intro}</p>
    </div>
  )
}
