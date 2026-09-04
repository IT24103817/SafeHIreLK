/*
  Owner: C and D — reports saved in the browser with localStorage.

  Planned exports (Phase 2):
    loadReports()          seeded reports plus anything the user submitted
    saveReport(report)     adds a report with status 'pending'
    updateStatus(id, s)    admin approve / reject flips 'verified' | 'rejected'

  Every read and write is wrapped in try/catch. Private browsing can throw on
  localStorage access, and a demo must not crash because of that.
*/
