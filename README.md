# SafeHire LK

A two-sided verification and reporting platform for Sri Lanka's foreign employment industry.

**Module:** SE3090 Software Engineering Frameworks — Assignment 2, Mini Hackathon
**Group ID:** `TODO — add the group ID`

> Sample data compiled from publicly listed SLBFE information and fictional records, for academic demonstration only. This is not a live registry and must not be relied on for real hiring decisions.

---

## 1. Project title

**SafeHire LK — verify before you pay.**

A mobile-first web application that lets a Sri Lankan job seeker check a recruitment agency's licence, scan an overseas job advertisement for fraud warning signs, and report a suspicious agent — and lets a licensed agency check whether a candidate has been reported for absconding.

---

## 2. The selected problem

Sri Lankan job seekers going abroad are being defrauded by unlicensed recruitment agents at scale.

- The SLBFE has warned that fraudulent overseas job offers are spreading on social media, the great majority never authorised by the Bureau and run by unlicensed individuals and agencies.
- In August 2026 an alleged fake recruitment racket was dismantled operating **inside the SLBFE itself**, based on bogus employment contracts for placements in Israel that did not exist.
- This came weeks after the SLBFE opened applications for up to **16,000 positions in Israel**, warning the public against unlicensed agents trying to exploit the demand.
- An earlier racket sent over **30,000 people** abroad without the mandatory training, mostly women, with losses exceeding **Rs. 2.5 billion**.

**Who is affected:** first-time migrant workers from rural districts — housemaids, drivers, caregivers and construction workers — who find jobs through Facebook posts and WhatsApp agents and pay money before verifying anything.

**Why the current fix fails:** verification today means calling hotline 1989 during office hours or searching the SLBFE website's licensed agency list. Nobody does that at 11pm when an "urgent Dubai driver job, leaving next week" post appears in a WhatsApp group.

**The side nobody builds for:** licensed agents are defrauded too. Candidates accept a paid placement, take the ticket and processing costs, then vanish or abscond on arrival, leaving the agency liable. Agencies have no shared record of who has done this before.

> `TODO — add source links for the four figures above (SLBFE notices and 2026 news reports). The marking scheme awards credit for real, citable 2026 sources, and the panel may ask where a specific number came from.`

---

## 3. The proposed solution

One verification layer covering the whole industry — agencies, sub-agents, job adverts and candidates — reachable on a phone in seconds.

A role toggle on the landing page switches the application between two audiences. Both sides share the same components, the same search engine and the same moderation queue; only the dataset and the copy change.

| Side | What it does |
|---|---|
| **Job Seeker** | Verify an agency or sub-agent licence, scan a job advert for fraud warning signs, report a suspicious agent |
| **Agent** | Check a candidate against a shared record of absconding and default reports, report a candidate |
| **Shared** | Public board of verified reports, pending board of unverified ones, moderator approve/reject workflow, safe-hiring guidance |

---

## 4. Main features

**Verify an agent (job seeker side)**
Fuzzy search over 50 agency and sub-agent records by name or licence number. Case-insensitive, ignores punctuation and the words "(Pvt)" and "Ltd", tolerates reversed word order and half-typed words — so `Al Falah Manpower` finds `Al-Falah Manpower (Pvt) Ltd`. Returns a colour-coded verdict card in one of six states:

| Verdict | Colour | Example record |
|---|---|---|
| Licensed | green | `FE/1001` Al-Falah Manpower (Pvt) Ltd |
| Licence expired | amber | `FE/1007` Sahara Job Agency (Pvt) Ltd |
| Sub-agent verified | green | `FE/2001` operating under `FE/1001` |
| Sub-agent's own licence expired | amber | `FE/2009` |
| Sub-agent's parent licence expired | amber | `FE/2007`, listed under expired `FE/1019` |
| Sub-agent unverified — parent does not exist | red | `FE/2014` claims `FE/1041` |

**Not found** is treated as the most important screen in the app: a full-width panel with four numbered next steps (call 1989, do not pay, do not hand over your passport, file a report) and a button through to the report form. It states plainly that absence from the registry is not proof of fraud, only that nobody has confirmed a licence.

**Job advert scanner (job seeker side)**
Paste a Facebook or WhatsApp job post and get a score out of 100 from eight fixed rules, with the exact phrase that triggered each flag highlighted in its surrounding text.

| Warning sign | Points |
|---|---|
| Upfront payment requested before the job is confirmed | 25 |
| No SLBFE licence number anywhere in the advert | 20 |
| A personal mobile or WhatsApp is the only contact | 15 |
| Promises no employer can make — visa guaranteed, no experience, 100% job | 15 |
| Pressure to decide immediately — urgent, only 2 slots, today only | 10 |
| Asks for the passport to be handed over | 10 |
| Payment into a personal bank account | 10 |
| Salary far above market rate for the role | 5 |

Bands: **0–29 Low** (green) · **30–59 Caution** (amber) · **60–100 High risk** (red). The eight rules total 110, so the score is capped at 100.

The result also lists the checks the advert **passed**. A page of only red flags reads as an accusation; showing all eight tests makes the score legible as a fixed procedure applied identically to every advert.

**Check a candidate (agent side)**
Same search engine over 10 fictional candidate records, by name or masked NIC. Shows destination, amount, reporting agency, date and a verified badge. Pending records are marked "Do not treat it as proven."

The no-record state is deliberately **green, not red** — for an agent, no record is the good outcome — and states explicitly that it is *not a clearance*.

**Report an incident**
One form component in two modes. Job seekers report an agent (name, contact number, destination, amount, description); agencies report a candidate (initials, masked NIC, destination, amount, description, reporting agency). Every message is specific, for example *"Please enter the amount in numbers only, for example 150000"*. Errors appear inline, on blur and on submit. The masked-NIC field refuses a full unmasked NIC — this is a shared record between agencies, so the form should not let one agency publish a candidate's real ID number to all the others.

**Moderation**
Every report carries `pending | verified | rejected`. The Verified board is public; the Awaiting review board shows unconfirmed reports with an amber "Unverified — under review" badge. A moderator signs in with a passcode and gets Approve / Reject buttons; approving moves a report to the public board immediately, and the decision persists across reloads.

**Learn**
Six-point safe-hiring checklist, a Today-versus-with-SafeHire impact section, and a roadmap.

**Guided tour**
A "Take a tour" button on the landing page walks a first-time visitor through all
nine steps of the product — switching role and tab as it goes, and drawing a ring
around the thing each step is describing. Escape leaves it, the arrow keys move
through it.

**AI analysis (optional)**
An "Explain this advert" button appears *after* the rules result is already on screen. See section 6.

---

## 5. Technologies used

| Layer | Choice | Why this choice |
|---|---|---|
| Framework | **React 19 + Vite 7** | Instant dev server and near-zero configuration; Vercel detects and builds a Vite project with no settings to get wrong under time pressure. |
| Styling | **Tailwind CSS 4** | Responsive utilities without writing a stylesheet, and design tokens live in one `@theme` block so the safe/caution/danger colours mean the same thing everywhere. No separate config file to merge-conflict over. |
| Reference data | **Static JSON in `src/data`** | A four-hour build has no time for a schema, migrations or a connection that can fail during a demo. The registry is read-only data, which is exactly what a JSON file is good at. |
| Persistence | **`localStorage`** | Submitted reports and moderator decisions survive a page refresh during the demo without a backend or a login. It is the source of truth, so every core flow works with the network unplugged. |
| Shared storage | **MongoDB Atlas (optional sync layer)** | `localStorage` is per-device, so a report filed on a phone never reaches a laptop. One collection of reports and one of moderator decisions let them travel between devices. It is a sync layer, not the source of truth — if it is unreachable the app behaves exactly as it does without it. |
| Optional AI | **Claude API (`claude-opus-5`) via one Vercel function** | Adds a plain-language explanation on top of the rules result. Wrapped in a timeout and a try/catch, so the app behaves identically if the API is unreachable. |
| Hosting | **Vercel** | Free, git-connected, deploys on every push, gives a public HTTPS URL, and runs the one serverless function that keeps the API key off the client. |
| Version control | **GitHub** | Required deliverable; lets each member commit under their own account throughout the session. |

**Deliberately not used:** a database, an authentication library, file uploads, SMS and maps. Each is an hour this build did not have, and none appear in the marking scheme.

### Why there is one serverless function

The rule was that the API key must never appear in the source. A Vite variable (`VITE_…`) is compiled into the JavaScript bundle every visitor downloads, so putting the key there would publish it. `api/explain.js` reads `ANTHROPIC_API_KEY` on the server instead. This is not a backend server the team runs or hosts — it is one file Vercel deploys from the same `git push`, and the application is fully functional without it.

---

## 6. AI tools used

> **The team must complete the "what we changed" half of each line before submission.** The declaration has to describe what actually happened. If a component was used unchanged, the honest line says so — an undeclared or overstated AI dependency that becomes evident during the demo is treated as a breach of the declaration.

| Tool | What it generated | What we changed |
|---|---|---|
| **Claude Code (Claude Opus 5)** | The project scaffold — Vite + Tailwind setup, app shell, sticky header, role toggle and tab navigation. | `TODO` |
| **Claude Code (Claude Opus 5)** | `src/utils/search.js` — the fuzzy matcher, ranking scores, sub-agent parent resolution and the six verdict states. | `TODO` |
| **Claude Code (Claude Opus 5)** | `src/utils/riskEngine.js` — the eight scoring rules, the 100-point cap and the three risk bands. | `TODO` |
| **Claude Code (Claude Opus 5)** | `src/data/registry.json`, `blacklist.json` and `reports.seed.json` — 50 registry records, 10 candidate records and 8 seeded reports, all fictional. | `TODO` |
| **Claude Code (Claude Opus 5)** | The report form, validation messages, `localStorage` layer and the moderation boards. | `TODO` |
| **Claude Code (Claude Opus 5)** | The landing hero, problem section, safe-hiring checklist, impact and roadmap copy. | `TODO` |
| **Claude Code (Claude Opus 5)** | `api/explain.js` and the optional AI analysis panel. | `TODO` |

### AI declaration

`TODO — one line per tool in the format the specification gives, for example:`

> "Claude Code — generated the initial registry search component; we rewrote the fuzzy matching and added the expired-licence branch."

### AI inside the product (separate from the tools above)

The deployed app can optionally call the Claude API to explain a scanned advert. This is a **feature**, not a build tool, and it is not on the critical path of anything:

- The rules engine always runs and always produces a score. It never calls the network.
- The AI section only appears after the rules result is already rendered, and only when the user presses "Explain this advert".
- The call has a 10-second timeout and is wrapped in try/catch. On **any** failure — no API key, function not deployed, offline, blocked wifi, malformed reply — the AI section hides itself entirely and the rules result is left untouched. There is no error dialog and no broken layout.

### AI prompt log

The full prompt log is in the submission PDF, as required. Keys are redacted.

---

## 7. Team member details and contributions

> Written by the team in their own words, as the assignment requires.

| Name | Student ID | Owned | Contribution |
|---|---|---|---|
| Jamsith M.M.M | IT24103421 | `TODO` | `TODO` |
| `TODO — name` | `TODO — ID` | `TODO` | `TODO` |
| `TODO — name` | `TODO — ID` | `TODO` | `TODO` |
| `TODO — name` | `TODO — ID` | `TODO` | `TODO` |

---

## 8. Installation and execution instructions

**Requirements:** Node.js 20 or newer and npm.

```bash
# 1. Clone the repository
git clone https://github.com/TODO-org/TODO-repo.git
cd SafeHireLK

# 2. Install dependencies
npm install

# 3. Start the development server (http://localhost:5173)
npm run dev

# 4. Build for production
npm run build

# 5. Preview the production build locally (http://localhost:4173)
npm run preview
```

No environment variable, API key or database is needed for any of this. Every feature except the optional "Explain this advert" button works offline.

### Optional extras

Both are off by default and the app is complete without either. Set them in
**Vercel → Settings → Environment Variables**, then redeploy — environment variables
are not picked up by an existing deployment. `.env.example` documents all three.

| Variable | Enables | Notes |
|---|---|---|
| `ANTHROPIC_API_KEY` | The "Explain this advert" button | Server-side only, read in `api/explain.js` |
| `MONGODB_URI` | Shared reports across devices | Server-side only, read in `api/reports.js` |
| `VITE_SHARED_REPORTS` | Set to `on` to switch the shared layer on in the browser | A feature switch, not a secret. Leave it unset and the app never calls `/api/reports`, which keeps the console clean on a deployment with no database |

**Never commit a real key.** `.env` is in `.gitignore`; `.env.example` holds empty
placeholders only.

Note that `npm run dev` does not serve `/api` — Vite does not run Vercel functions. Locally
the AI button will fail and hide itself, which is the fallback behaving correctly. To
exercise the functions locally use `vercel dev`; otherwise test them on the deployed URL.

### How the optional layers fail

Both follow the same rule, and it is the most important architectural decision in the
project: **nothing on the critical path may depend on the network.** The rules engine
always scores, the registry always searches, reports always save locally, and the boards
always render. The AI section hides itself on any failure; the sync layer returns nothing
and the app carries on with local data. Neither can produce an error dialog, a stuck
spinner, or a broken layout.

### Deploying

Import the repository on [vercel.com](https://vercel.com). Vercel detects Vite automatically — no `vercel.json`, no build settings, and no rewrite rules, because navigation is React state rather than a client-side router.

### Demo credentials

Moderator passcode: **`admin2026`** (footer → Admin).

This is **not** authentication. The passcode is written into the source and anyone can read it. It exists to demonstrate the moderation workflow — approve, reject, publish — without spending an hour of a four-hour build on a login system that earns no marks. The modal says so on its face.

### Things worth trying

| Where | Try | What you should see |
|---|---|---|
| Verify | `Al Falah Manpower` | Finds `Al-Falah Manpower (Pvt) Ltd` — fuzzy match |
| Verify | `Gulf Star Manpower` | Red "No match found in the registry" panel |
| Verify | `FE/2014` | Sub-agent claiming a licence that does not exist |
| Verify | `FE/2007` | Sub-agent whose parent licence has expired |
| Scan Advert | "Try a sample advert" → "Check this advert" | **95/100, High risk**, 6 warning signs, 2 checks passed |
| Check Candidate | `K. Perera` | Verified record; `M. Silva` gives the no-record state |
| Reports | Submit a report, then footer → Admin → `admin2026` → Approve | The report moves to the Verified board |

---

## 9. Deployed application link

**`TODO — paste the public Vercel URL here`**

Test it in an incognito window before submitting, so a cached session does not hide a broken deploy.

---

## 10. Demonstration video link

**`TODO — paste the video link here (maximum 2 minutes)`**

`TODO — confirm the sharing permission is open to anyone with the link before submitting.`

---

## Project structure

```
api/
  explain.js            optional Claude API call (server-side, keeps the key off the client)
public/
  favicon.svg
src/
  data/
    registry.json       50 agencies and sub-agents
    blacklist.json      10 fictional candidate records
    reports.seed.json   8 seeded incident reports
    destinations.js     destination countries for the report form
    sampleAdvert.js     the demo advert used by "Try a sample advert"
  components/           one component per file
  pages/                one file per tab
  utils/
    search.js           fuzzy matching and verdict logic
    riskEngine.js       the eight advert rules
    storage.js          localStorage, seed merging, moderator decisions
    validation.js       form rules and their messages
    format.js           money and date formatting
    aiExplain.js        the only network call in the app
    useDebouncedValue.js
  App.jsx               role, active tab and moderator state
  index.css             design tokens
```

### How report data is stored

Two `localStorage` keys, kept separate on purpose:

- `safehire.reports.submitted` — reports typed into the form
- `safehire.reports.statuses` — an id → status map of moderator decisions

Keeping decisions apart from the reports is what lets a moderator approve a **seeded** report: `reports.seed.json` is read-only, so the decision is recorded against the id and applied when the list is read. It also means edits to the seed file show up immediately, instead of being hidden behind a copy written into a visitor's browser on their first load.

Every read and write is wrapped in try/catch. Private browsing can throw on `localStorage` access, and a corrupt or hand-edited value is discarded rather than allowed to blank the page. If a report cannot be saved, the app says so instead of pretending it succeeded.

---

## Testing notes

The application was break-tested in Chrome at 375px width against the production build:

- Empty form submit produces five specific inline errors
- Symbols, numbers, script tags and non-Latin text in the search boxes return an empty state, never a crash
- A 5,000-character advert scores without hanging
- Cleared, corrupt and blocked `localStorage` all fall back to the seed data
- All seven pages fit 375px with no horizontal overflow
- No console errors or warnings on any page
- Colour contrast passes WCAG AA — the amber band text is 5.02:1 on white and 4.84:1 on the amber panel

---

## Disclaimer

> Sample data compiled from publicly listed SLBFE information and fictional records, for academic demonstration only. This is not a live registry and must not be relied on for real hiring decisions.

This sentence also appears in the footer of every page of the application.
