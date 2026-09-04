/*
  Owner: A — registry and blacklist searching.

  Planned exports (Phase 2):
    normalise(text)                  strip punctuation and case so
                                     "Al Falah Manpower" matches
                                     "Al-Falah Manpower (Pvt) Ltd"
    searchRegistry(records, query)   returns ranked matches
    findByLicence(records, licence)  used to resolve a sub-agent's
                                     parent_licence back to its agency

  No network calls in this file. Everything runs against the static JSON.
*/
