# SafeHire LK — Test Plan

Manual test plan for the whole system. Work top to bottom and tick each row.
Anything that fails, note the row ID and what you actually saw.

**Moderator passcode: `admin2026`** (footer → Admin)

---

## Before you start

```bash
git clone https://github.com/IT24103817/SafeHIreLK.git
cd SafeHIreLK
npm install
npm run dev          # http://localhost:5173
```

To test what is actually deployed, use the production build instead:

```bash
npm run build
npm run preview      # http://localhost:4173
```

### Three things that will confuse you if you do not know them

1. **Reports are stored per browser.** Submitted reports and moderator decisions live in
   `localStorage`. They do **not** sync between devices, browsers, or normal and incognito
   windows. If you submit a report on your phone it will not appear on your laptop. Do the
   whole submit → approve flow in one browser.
2. **Moderator mode resets on reload.** This is deliberate — it is not remembered between
   visits. Sign in again after every refresh.
3. **`npm run dev` does not serve `/api`.** Vite does not run Vercel functions, so the AI
   button will fail and hide itself locally. That is the fallback working correctly, not a
   bug. Only test section J on the deployed URL.

### Resetting to a clean state

Open DevTools → Console and run:

```js
localStorage.clear(); location.reload()
```

This restores the 8 seeded reports (5 verified, 3 pending) and clears all moderator
decisions. Do this before section E and section H.

---

## A. Landing page and navigation

| ID | Steps | Expected | ✓ |
|---|---|---|---|
| A1 | Open the app | Blue header, "SafeHire LK", tagline, role toggle, tabs, dark hero reading "Verify before you pay." | |
| A2 | Scroll to the bottom | Disclaimer paragraph, then a small "Admin" link | |
| A3 | Scroll down the landing page | "Why this matters" section with four facts, "Who this affects", "The side nobody builds for" | |
| A4 | Tap each tab: Verify, Scan Advert, Reports, Learn | Each loads, the active tab is underlined in blue | |
| A5 | Scroll down on any page | Header and tabs stay stuck to the top | |
| A6 | Tap "I'm an Agent" | Tabs become: Check Candidate, Reports, Learn. Scan Advert and Verify disappear | |
| A7 | Tap "I'm a Job Seeker" again | Tabs return to Verify, Scan Advert, Reports, Learn | |
| A8 | As Job Seeker go to "Scan Advert", then switch to Agent | Falls back to Check Candidate. **Must not** show a blank page | |
| A9 | As Job Seeker go to "Reports", then switch to Agent | Stays on Reports, wording changes to the agent version | |
| A10 | Toggle the role rapidly 8–10 times | No blank page, no stuck tab, no console error | |
| A11 | Tap the hotline "1989" link in the hero | On a phone, opens the dialler. On desktop, may do nothing — that is fine | |

---

## B. Verify an agent (job seeker side)

| ID | Input | Expected | ✓ |
|---|---|---|---|
| B1 | `Al Falah Manpower` | Green **LICENSED** card — Al-Falah Manpower (Pvt) Ltd, FE/1001, Colombo, 011XXXXXXX | |
| B2 | `al-falah manpower (pvt) ltd` | Same result as B1 — punctuation and case ignored | |
| B3 | `AL FALAH MANPOWER` | Same result as B1 | |
| B4 | `alfalah` | Same result as B1 — works with no spaces | |
| B5 | `manpower falah` | Al-Falah first — word order does not matter | |
| B6 | `falah manpo` | Al-Falah first — half-typed words still match | |
| B7 | `FE/1001` | Exactly one result: Al-Falah Manpower | |
| B8 | `fe/1001`, `FE1001`, `fe 1001`, `1001` | All four give the same single result | |
| B9 | `FE/1007` | Amber **LICENCE EXPIRED** — Sahara Job Agency, "This licence has expired. Do not pay this agency." | |
| B10 | `FE/2001` | Green **SUB-AGENT VERIFIED** — "Operating under licence FE/1001 — Al-Falah Manpower (Pvt) Ltd (active)." | |
| B11 | `FE/2009` | Amber — sub-agent's own licence expired | |
| B12 | `FE/2007` | Amber **PARENT LICENCE EXPIRED** — listed under FE/1019 Damith Manpower Agency, which has expired | |
| B13 | `FE/2014` | Red **SUB-AGENT UNVERIFIED** — "claims licence FE/1041, which does not exist in the registry." | |
| B14 | `FE/2015` | Red — claims FE/1063, which does not exist | |
| B15 | `Gulf Star Manpower` | Red full-width **"No match found in the registry."** panel | |
| B16 | Read the B15 panel | Four numbered steps: call 1989, do not pay, do not hand over passport, report it. Plus a "Report this agent" button | |
| B17 | Click "Report this agent" on that panel | Jumps to the Reports tab | |
| B18 | `Dubai Direct Jobs Lanka` | Red not-found panel | |
| B19 | `Skyway Overseas Agency` | Red not-found panel — **must not** match a real agency | |
| B20 | `a` (single letter) | "Please type at least two letters…" — no results | |
| B21 | `!!!` then `@#$%^&*()` then `999999` | Not-found panel each time. No crash, no console error | |
| B22 | `<script>alert(1)</script>` | Rendered as plain text in the panel. **No alert box** | |
| B23 | Paste 120 random letters | Not-found panel, text wraps, page does not scroll sideways | |
| B24 | Type into the box, then clear it with the ✕ | Returns to the "Try one of these" examples. **Only one ✕** should be visible | |
| B25 | Tap each of the four example chips | Each fills the box and shows the described result | |

---

## C. Scan a job advert

| ID | Steps | Expected | ✓ |
|---|---|---|---|
| C1 | Open Scan Advert | Large textarea, placeholder "Paste the job advertisement here", two buttons | |
| C2 | Press "Check this advert" with the box empty | "Please paste the job advertisement into the box first…" | |
| C3 | Type `too short`, press Check | "Please paste a bit more of the advert… that is about N more." | |
| C4 | Start typing after an error shows | The red error clears as you type | |
| C5 | Press "Try a sample advert" | The Dubai driver post fills the box, character count updates | |
| C6 | Press "Check this advert" | **95 / 100**, band **High risk**, "6 warning signs" | |
| C7 | Read the flag list | 6 flags: upfront payment 25, no licence 20, mobile only 15, promises 15, urgency 10, passport 10 | |
| C8 | Check each flag | Each shows the matched phrase highlighted in yellow inside the surrounding text | |
| C9 | Check the "No SLBFE licence number" flag | Says "Nothing matching was found anywhere in the advert." — it fires on absence | |
| C10 | Scroll to "Checks this advert passed" | 2 items: personal bank account, salary realistic | |
| C11 | Paste a clean advert (see below) | **0 / 100**, Low risk, 8 of 8 checks passed | |
| C12 | Paste 5,000 characters of text | Scores without freezing. Page does not scroll sideways | |
| C13 | Press "Clear" | Textarea empties, result disappears | |
| C14 | Score the sample advert twice in a row | Same score both times (95) — not a different number the second time | |

**Clean advert for C11** — paste exactly this:

```
Al-Falah Manpower (Pvt) Ltd, SLBFE Licence No. FE/1001.
We are recruiting welders for a construction firm in Qatar under an approved job order.
Salary QAR 2,200 per month with accommodation provided by the employer.
Interviews at our Colombo office. Call 0112345678 during working hours.
Bring photocopies of your NIC and passport to the interview.
Agency fees are payable only after the visa is approved, against a receipt.
```

**Check the maths on C6:** the eight rules add up to 110 points, so the score is capped
at 100. Bands are 0–29 Low, 30–59 Caution, 60–100 High.

---

## D. Check a candidate (agent side)

Switch to **I'm an Agent** first.

| ID | Input | Expected | ✓ |
|---|---|---|---|
| D1 | `K. Perera` | One verified record — Qatar, Rs. 185,000, Al-Falah Manpower (Pvt) Ltd, 14 July 2026 | |
| D2 | `perera` | Same record — surname alone works | |
| D3 | `PERERA` | Same record — case ignored | |
| D4 | `H. Ameena` | Amber **UNDER REVIEW** badge and "This report is still being checked. Do not treat it as proven." | |
| D5 | `199XXXXXXXXX` | One record — A. Dilrukshi | |
| D6 | `9XXXXXXXXV` | **4 records** — several candidates share that mask. Expected, not a bug | |
| D7 | `M. Silva` | **Green** "No record found." panel | |
| D8 | Read the D7 panel | Says "This is not a clearance." — green because for an agent, no record is the good outcome | |
| D9 | `!!!` | No-record panel, no crash | |
| D10 | Click "Report a candidate" on the D7 panel | Jumps to the Reports tab | |

---

## E. Report form and validation

Run `localStorage.clear(); location.reload()` first.

### E1 — Job seeker mode

| ID | Steps | Expected | ✓ |
|---|---|---|---|
| E1.1 | Reports tab, press "Submit report" with everything empty | **5** red errors appear under the 5 fields | |
| E1.2 | Read them | "Please enter the agency name so others can search for it" · "Please enter the number the agent contacted you on, for example 0771234567" · "Please choose the destination country from the list" · "Please enter the amount in numbers only, for example 150000" · "Please describe what happened in a little more detail — at least 20 characters" | |
| E1.3 | Check the wording | No message anywhere says just "Invalid input" or "Required" | |
| E1.4 | Type in the name field, then click away | That error disappears | |
| E1.5 | Phone: `abc`, click away | "Please enter a valid phone number, for example 0771234567" | |
| E1.6 | Phone: `077123`, then `07712345678` | Both rejected — too short and too long | |
| E1.7 | Phone: `0771234567`, `077 123 4567`, `077-123-4567`, `+94771234567`, `0112345678` | All five accepted | |
| E1.8 | Amount: `abcdef` | "Please enter the amount in numbers only, for example 150000" | |
| E1.9 | Amount: `150000rs` | Same message | |
| E1.10 | Amount: `0` | "Please enter an amount greater than zero, for example 150000" | |
| E1.11 | Amount: `150000`, `150,000`, `150 000` | All three accepted | |
| E1.12 | Description: type 19 characters | Still shows the error; counter reads "19 of 20 characters minimum" | |
| E1.13 | Description: 20 characters | Error clears | |
| E1.14 | Description: 25 spaces only | Rejected — whitespace does not count | |
| E1.15 | Fill everything correctly and submit | Green "Thank you. Your report has been received." with a report ID like R-009 | |
| E1.16 | Read the success message | Explains a moderator checks it before it appears on the public board | |
| E1.17 | Look at the boards below | The board switched to "Awaiting review" and your report is there with an amber badge | |
| E1.18 | Double-click Submit quickly on a new report | Exactly **one** new report is created, not two | |
| E1.19 | Press "Submit another report" | The form returns, empty | |

### E2 — Agent mode

| ID | Steps | Expected | ✓ |
|---|---|---|---|
| E2.1 | Switch to Agent, go to Reports | Form now asks for candidate initials, **masked NIC**, and your agency name | |
| E2.2 | Submit empty | **6** errors this time | |
| E2.3 | NIC: `199012345678` (a full unmasked NIC) | Rejected — "Please hide the middle digits of the NIC before sharing it, for example 9XXXXXXXXV" | |
| E2.4 | NIC: `9XXXXXXXXV` and `9xxxxxxxxv` | Both accepted | |
| E2.5 | NIC: `9XX` | Rejected — too short | |
| E2.6 | Submit a valid candidate report | Success panel, report appears under Awaiting review | |
| E2.7 | Fill in half the form, then switch role to Job Seeker | Form resets to the seeker fields. No leftover values, no stale success panel | |

---

## F. Moderation and admin

| ID | Steps | Expected | ✓ |
|---|---|---|---|
| F1 | Reports tab, count the two board tabs | "Verified reports (5)" and "Awaiting review (3)" on a fresh state | |
| F2 | Open Verified reports | Green **VERIFIED** badges. Line above says a moderator has checked them | |
| F3 | Open Awaiting review | Amber **UNVERIFIED — UNDER REVIEW** badges, and a line saying to treat them as claims, not facts | |
| F4 | Type `Dubai` in Search reports | Filters to matching reports; the count line updates | |
| F5 | Search `zzzznothing` | "No reports match your search." plus a "Clear the filters" button | |
| F6 | Press "Clear the filters" | All reports return | |
| F7 | Destination dropdown → `Qatar` | Only Qatar reports | |
| F8 | Combine a search term and a country | Both filters apply together | |
| F9 | Scroll to the footer, click **Admin** | Passcode dialog opens | |
| F10 | Enter nothing, press Unlock | "Please enter the moderator passcode to continue." | |
| F11 | Enter `wrongcode` | "That passcode is not correct. Please check it and try again." | |
| F12 | Press Escape | Dialog closes | |
| F13 | Reopen, click the dark area behind the box | Dialog closes | |
| F14 | Reopen, enter **`admin2026`** | Unlocks, jumps to Reports, shows "Moderator mode is on." | |
| F15 | Read the dialog text before unlocking | States it is a demonstration and not real authentication | |
| F16 | Open Awaiting review | Every pending report now has **Approve** and **Reject** buttons | |
| F17 | Approve one report | It moves to Verified immediately; both tab counts change | |
| F18 | Reject a different report | Stays visible to you with a red **REJECTED** badge and a "Move back to review" button | |
| F19 | Footer → Sign out, then check the boards | The rejected report is now hidden from both boards. Normal users never see rejected reports | |
| F20 | Sign in again, press "Move back to review" | Report returns to pending | |
| F21 | Approve a **seeded** report (e.g. the Israel one, R-003) | Works — moderator decisions apply to seeded reports too | |
| F22 | Refresh the page | Your approvals are still there. Moderator mode is signed out — expected | |

---

## G. Learn page and content

| ID | Steps | Expected | ✓ |
|---|---|---|---|
| G1 | Open Learn | "Safe hiring checklist" with **6** numbered items | |
| G2 | Read them | Verify the licence · never pay before written confirmation · never hand over passport · insist on SLBFE approval · register before departure · call 1989 | |
| G3 | Scroll on | "What changes if this exists" — 3 items, each with Today vs With SafeHire LK | |
| G4 | Scroll on | "What we would build next" — 5 roadmap items | |
| G5 | Check every page | No lorem ipsum, no "TODO", no placeholder text anywhere in the app | |

---

## H. Storage and resilience

Open DevTools → Console for these.

| ID | Steps | Expected | ✓ |
|---|---|---|---|
| H1 | `localStorage.clear(); location.reload()` | App loads normally with the 8 seeded reports | |
| H2 | Submit a report, then refresh | The report is still there | |
| H3 | `localStorage.setItem('safehire.reports.submitted','{not json'); location.reload()` | App still loads, falls back to seeded reports, no white screen | |
| H4 | `localStorage.setItem('safehire.reports.submitted','{"not":"an array"}'); location.reload()` | Same — loads fine | |
| H5 | `localStorage.setItem('safehire.reports.statuses','"a string"'); location.reload()` | Same — loads fine | |
| H6 | Open the app in a private/incognito window | Loads and works. Submitting may warn it could not be saved — that is honest, not a bug | |
| H7 | Throughout all testing, watch the Console | **Zero** errors and zero warnings on every page | |

---

## I. Mobile and responsive

Use DevTools device toolbar at **375 px** width (iPhone SE), and a real phone if you can.

| ID | Steps | Expected | ✓ |
|---|---|---|---|
| I1 | Every page at 375px | No horizontal scrollbar. Nothing cut off at the right edge | |
| I2 | All four tabs at 375px | All visible or horizontally scrollable, never overlapping | |
| I3 | Verdict cards at 375px | Licence number, district and contact stack vertically and stay readable | |
| I4 | Risk score at 375px | Score, band and bar all fit; band labels 0 / 30 / 60 readable | |
| I5 | Report form at 375px | Every field full width, error messages wrap properly | |
| I6 | Report cards at 375px | Two-column detail grid fits; long agency names wrap | |
| I7 | Admin dialog at 375px | Sits at the bottom of the screen, buttons reachable with a thumb | |
| I8 | Rotate to landscape | Layout still works | |
| I9 | Submit a report with a 90-character name with no spaces | The card wraps it; the page does not widen | |
| I10 | Test at 320px (iPhone SE 1st gen) | Still usable — note anything that breaks | |

---

## J. AI layer — deployed URL only

Skip entirely if `ANTHROPIC_API_KEY` is not set in Vercel. The app is complete without it.

| ID | Steps | Expected | ✓ |
|---|---|---|---|
| J1 | Scan the sample advert | Score renders **first**, with an "Explain this advert" button below it | |
| J2 | Press "Explain this advert" | Spinner with "Reading the advert…" | |
| J3 | Wait | "AI ANALYSIS" section appears with a warning, tactics, and 3 next steps | |
| J4 | Compare | The 95/100 score is **unchanged** by the AI section | |
| J5 | Press Clear, then scan a different advert | The AI section is gone and the button is offered again | |
| J6 | DevTools → Network → set to Offline, then press the button | After ~10 seconds the whole AI section disappears. **No error dialog, no broken layout**, score still there | |
| J7 | On localhost with `npm run dev` | Button disappears on click — expected, Vite does not serve `/api` | |
| J8 | View page source / bundle, search for `sk-ant` | **Nothing.** The key must never reach the browser | |

---

## J2. Guided tour

| ID | Steps | Expected | ✓ |
|---|---|---|---|
| J2.1 | Landing page → press "Take a tour" | Dark card at the bottom reading "Step 1 of 9" | |
| J2.2 | Press Next through all nine steps | The app changes role and tab by itself; each step highlights something with a blue ring | |
| J2.3 | Watch step 7 | Switches to the **agent** side and the Check Candidate tab on its own | |
| J2.4 | Press Back | Returns to the previous step and the previous screen | |
| J2.5 | Press the ← and → arrow keys | Move through the tour | |
| J2.6 | Press Escape | Tour closes | |
| J2.7 | After closing, look for leftover blue rings | None — the highlight is removed | |
| J2.8 | Run the tour at 375px | The card fits, the progress dots stay on one line, nothing is covered | |
| J2.9 | Press "Skip tour" at any step | Closes immediately | |

---

## J3. Shared reports (MongoDB)

Only relevant when `MONGODB_URI` **and** `VITE_SHARED_REPORTS=on` are set in Vercel.
Skip if they are not — the app is complete without them.

| ID | Steps | Expected | ✓ |
|---|---|---|---|
| J3.1 | Open Reports with the shared layer **off** | Boards render normally, **no** "Synced across devices" badge, and **no** console error | |
| J3.2 | With it on, open Reports | Green "Synced across devices" badge next to "Reports from the community" | |
| J3.3 | Submit a report on device A, then open device B | The report appears on device B under Awaiting review | |
| J3.4 | Approve it on device B, then reload device A | It shows as verified on device A too | |
| J3.5 | DevTools → Network → Offline, reload, open Reports | Boards still render from localStorage. No spinner, no error | |
| J3.6 | Submit a report while offline | Saves locally and shows the success panel. It syncs the next time the shared layer is reachable | |
| J3.7 | Two devices each submit a report at the same time | Both appear. Neither overwrites the other — reports are keyed by a random client id, not by R-00n | |

---

## K. Deployment

| ID | Steps | Expected | ✓ |
|---|---|---|---|
| K1 | Open the Vercel URL in **incognito** | Loads fully, no cached session hiding a problem | |
| K2 | Open it on a real phone over **mobile data**, not wifi | Loads and works | |
| K3 | Hard refresh (Cmd/Ctrl + Shift + R) | Still fine | |
| K4 | Check the deployed build matches the repo | Latest commit hash in Vercel matches `git log -1` | |
| K5 | Check the browser tab | Shield favicon and the title "SafeHire LK — Verify before you pay" | |
| K6 | Check the footer on the live site | The disclaimer paragraph is present | |

---

## L. The ten minimum requirements

Tick these on the **deployed** build, not localhost.

| # | Requirement | Where to check | ✓ |
|---|---|---|---|
| 1 | Clear landing page | Hero + role chooser + search box | |
| 2 | Problem explained inside the app | "Why this matters" on the landing page | |
| 3 | At least two functional features | Verify, Scan, Candidate check, Reporting — four | |
| 4 | At least one form accepting input | Report form on the Reports tab | |
| 5 | Validation with friendly messages | Section E above | |
| 6 | Display / search / filter / calculate | Registry search, risk scoring, board filters | |
| 7 | Responsive on desktop and mobile | Section I above | |
| 8 | Navigation between sections | Tab bar | |
| 9 | Sample data relevant to the problem | 50 registry, 10 candidates, 8 reports | |
| 10 | Clear demonstration of value | Impact section on Learn + the live demo | |

---

## Known limitations — by design, do not "fix"

| Behaviour | Why |
|---|---|
| Phone numbers show as `011XXXXXXX` | Masked deliberately. These are plausible agency names on a public URL; inventing full numbers risks printing a real business's line |
| `9XXXXXXXXV` returns 4 candidates | Several fictional records share that mask. Search by name for a unique result |
| Passcode is in the source | Demonstrates the moderation workflow. A real login earns no marks and costs an hour. The dialog says so |
| Moderator mode forgotten on reload | Not persisted on purpose |
| Rejected reports vanish for normal users | They are rejected. Moderators still see them and can undo |
| Reports do not sync between devices | `localStorage`, no backend. Stated in the README |
| AI button disappears on failure | Required behaviour: fail closed, never break the rules result |

---

## Improvement backlog

Ordered by what actually protects marks. Do not start P2 until every P0 is done.

### P0 — before submission

| # | Task | Why it matters |
|---|---|---|
| 1 | **Deploy to Vercel and test in incognito** | 10 marks. Nothing is deployed yet |
| 2 | Fill README section 7 — names, IDs, contributions in each member's own words | 5 marks. The spec says AI cannot write this |
| 3 | Complete README section 6 — the "what we changed" column and the AI declaration | Academic integrity. An overstated declaration is treated as a breach |
| 4 | **Every member makes real commits** | 5 marks. All 9 commits are currently from one account |
| 5 | Add source links for the four 2026 figures in README section 2 | 10 marks for problem relevance depend on citable sources |
| 6 | Rename the repo `SafeHIreLK` → `SafeHireLK` | Typo appears in the submission PDF and the URL |
| 7 | Delete or archive the duplicate repo `devmarkui/SafeHireLK` | Two identical public repos creates ambiguity, and ambiguity is marked down |
| 8 | Paste the live URL and video link into README sections 9 and 10 | Required deliverables |
| 9 | Update the video script: the sample advert scores **95**, not 82 | 82 is impossible — all eight weights are multiples of 5 |

### P1 — worth doing if there is time

| # | Task | Why |
|---|---|---|
| 10 | **Prefill the report form** with the name that was just searched | The not-found panel says "Report this agent" but the user then retypes the name. Biggest UX win in the app |
| 11 | **Add a React error boundary** | Right now an unexpected render error gives a white screen. A friendly fallback protects the live demo |
| 12 | Sinhala and Tamil for the 6 checklist items | The people this protects mostly do not read English. Directly answers "who is this for?" |
| 13 | Browse the registry without searching — list by district | Currently the only way in is to know a name. Also makes the demo easier |
| 14 | Sort the report boards by date or amount | The boards only filter, they do not sort |
| 15 | Show "4 records share this masked NIC" when a NIC search is ambiguous | Removes the only confusing result in the app |
| 16 | Focus trap in the admin dialog | Tab currently escapes to the page behind it |
| 17 | `aria-live` on the search result count | Screen reader users get no announcement when results change |
| 18 | Add a few unit tests with Vitest for `search.js` and `riskEngine.js` | Both are pure functions and easy to test. Evidence of engineering practice |

### P2 — roadmap, do not build now

Live SLBFE registry integration · verified agent accounts · SMS verification for feature
phones · full Sinhala and Tamil interface · embassy escalation workflow.

These are already written up on the Learn page. Talk about them, do not code them.

---

## Reporting a failure

For anything that fails, write down:

```
ID:        B13
Device:    iPhone 13 / Safari  (or Chrome desktop 375px)
Steps:     Typed FE/2014 into the Verify search box
Expected:  Red card, "claims licence FE/1041, which does not exist"
Actual:    Green LICENSED card
Console:   (paste any red error text)
```

That is enough for whoever fixes it to reproduce it without asking questions.
