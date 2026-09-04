/*
  The guided tour.

  Each step can move the app to a role and a tab, and point at a real element
  on the page. Targets are plain CSS selectors — mostly the ids the form fields
  already have — so a step whose element is missing simply shows its card
  without a highlight rather than breaking the tour.
*/
export const TOUR_STEPS = [
  {
    role: 'seeker',
    tab: 'verify',
    target: null,
    title: 'Verify before you pay',
    body: 'Unlicensed agents advertise overseas jobs that do not exist. This tour takes about a minute and shows you the four things SafeHire LK can check.',
  },
  {
    role: 'seeker',
    tab: 'verify',
    target: '[data-tour="role"]',
    title: 'Two sides, one record',
    body: 'Job seekers check agencies and job adverts. Licensed agencies check candidates. This switch changes the whole app between them.',
  },
  {
    role: 'seeker',
    tab: 'verify',
    target: '#registry-search',
    title: 'Check a licence in seconds',
    body: 'Type an agency name or a licence number. Try “Gulf Star Manpower” — it is not in the registry, and you will see exactly what to do next.',
  },
  {
    role: 'seeker',
    tab: 'scan',
    target: '#advert-text',
    title: 'Scan a job advert',
    body: 'Paste a Facebook or WhatsApp post. Press “Try a sample advert”, then “Check this advert” — it scores 95 out of 100 and shows the exact phrase behind every warning.',
  },
  {
    role: 'seeker',
    tab: 'reports',
    target: '#subjectName',
    title: 'Report what happened to you',
    body: 'Anyone can report a suspicious agent. Reports are checked by a moderator before they appear publicly, so nothing unverified is presented as fact.',
  },
  {
    role: 'seeker',
    tab: 'reports',
    target: '[data-tour="boards"]',
    title: 'Verified and unverified, kept apart',
    body: 'The Verified board holds checked reports. Awaiting review shows the rest with an amber badge, so a claim is never mistaken for a confirmed fact.',
  },
  {
    role: 'agent',
    tab: 'candidate',
    target: '#candidate-search',
    title: 'The side nobody builds for',
    body: 'Licensed agencies get defrauded too. Search a candidate who has been reported for absconding after a paid placement — by name or masked NIC.',
  },
  {
    role: 'seeker',
    tab: 'learn',
    target: null,
    title: 'Six checks that cost nothing',
    body: 'Verify the licence, never pay before written confirmation, never hand over your passport. The Learn page has all six, and the hotline is 1989.',
  },
  {
    role: 'seeker',
    tab: 'reports',
    target: '[data-tour="admin"]',
    title: 'That is the tour',
    body: 'Moderators approve or reject reports from here — the demo passcode is admin2026. Start by searching an agency name you have been given.',
  },
]
