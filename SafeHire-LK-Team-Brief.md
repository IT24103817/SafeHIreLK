# SafeHire LK — Team Brief

**Module:** SE3090 Software Engineering Frameworks · Assignment 2 — Mini Hackathon
**Format:** Supervised in-class build · 4 hours · Group of 3–4 · 100 marks · 15% of module
**Read this before the session. Bring it printed or open on a second screen.**

---

## 1. The one rule

We ship a **working, deployed web app** in four hours. Not a design, not a mockup, not a half-built idea. The spec is explicit: a presentation-only concept, a static design, or an unfinished interface without working features **will not be accepted**.

Everything below is optimised for one thing: getting all ten minimum requirements working reliably and deployed on a public link, then adding polish. Features that are not on this document do not get built during the session. If someone has a new idea at minute 90, the answer is "roadmap section".

---

## 2. The problem we are solving

Sri Lankan job seekers going abroad are being defrauded by unlicensed recruitment agents at scale.

- The SLBFE has warned that fraudulent overseas job offers are spreading on social media, most of them never authorised by the Bureau, run by unlicensed individuals and agencies.
- In August 2026 an alleged fake recruitment racket was dismantled operating **inside the SLBFE itself**, based on bogus employment contracts for non-existent placements in Israel.
- This came weeks after the SLBFE opened applications for up to 16,000 positions in Israel, warning the public against unlicensed agents trying to exploit the demand.
- An earlier racket sent over 30,000 people abroad without mandatory training, mostly women, with losses exceeding Rs. 2.5 billion.

**Who is affected, specifically:** first-time migrant workers from rural districts — housemaids, drivers, caregivers, construction workers — who find jobs through Facebook posts and WhatsApp agents and pay money before verifying anything.

**Why the current fix fails:** verification today means calling hotline 1989 or searching the SLBFE website's licensed agency list. Nobody does that at 11pm when an "urgent Dubai driver job, leaving next week" post appears.

**The other side nobody builds for:** licensed agents also get defrauded. Candidates take a placement, accept the paid ticket and processing, then vanish or abscond on arrival, leaving the agency liable. Agents have no shared record of who has done this.

**Our position:** one verification layer covering the whole industry — agencies, sub-agents, job adverts and candidates.

---

## 3. What we are building

**SafeHire LK** — a two-sided verification and reporting platform for Sri Lanka's foreign employment industry.

A role toggle on the landing page switches the app between two audiences. Same components, same search engine, different dataset and copy.

### Side A — Job Seeker

| Feature | What it does |
|---|---|
| **Verify an agent** | Type an agency name or licence number. Get a verdict card: Licensed / Not found / Licence expired, with district and contact. Fuzzy matching so "Al Falah Manpower" still finds "Al-Falah Manpower (Pvt) Ltd". |
| **Verify a sub-agent** | Sub-agents are records in the same registry with a `parent_licence`. Result shows "operating under licence FE/1234 — Al-Falah Manpower (active)" or "claims a licence that does not exist". |
| **Job advert scanner** | Paste the Facebook or WhatsApp job post. Get a risk score out of 100 with the exact phrases that triggered each flag. |
| **Report an incident** | Form to report a suspicious agent or offer. Goes into the moderation queue. |

### Side B — Agent

| Feature | What it does |
|---|---|
| **Candidate check** | Search a shared blacklist of candidates who absconded or defaulted — name, masked NIC, destination, amount, reporting agency, date. |
| **Report a candidate** | Same form component, different fields. Goes into the same moderation queue. |

### Shared — Moderation

Every report carries `status: pending | verified | rejected`.

- **Public board** shows verified reports only, searchable and filterable by destination country.
- **Pending board** shows unverified reports with an orange "under review" badge.
- **Admin view** sits behind a hardcoded passcode modal. Approve / reject buttons flip the status.

**We are not building real authentication.** A passcode modal demonstrates the moderation workflow in five minutes of work. A login system eats an hour and earns zero extra marks.

### Learn page

Safe-hiring checklist: always verify the licence, never pay before the job is confirmed, never hand over your passport, insist on SLBFE approval of the advert, register with the SLBFE before departure, hotline 1989.

---

## 4. The AI feature

**Read this section carefully — it is the most likely thing to sink us.**

The rubric has **no line item for an AI feature.** The spec calls it optional. "Effective use of technology & AI tools" (10 marks) is about whether we used AI well to *build* the app and can explain our own code. So the AI feature earns no direct marks, and a broken one costs us deployment and usability marks.

Therefore:

- The **rule-based scanner is the product.** It always runs. It always produces a score.
- The AI layer only **enriches** an existing result, and it is built at minute 150 **only if the ten-requirement checklist is fully green.**
- Every AI call is wrapped in try/catch with a fallback to the rules output. If the campus wifi blocks the API, the app behaves normally and the demo still lands.
- **Never put an API call on the critical path of the main flow.**

**What the AI does:** takes the pasted job advert and returns (a) the specific manipulation tactics used, (b) a plain-language warning the user can actually act on, (c) optionally the same warning in Sinhala or Tamil.

**Rules:** API key goes in a Vercel environment variable, never committed to the repo. Every significant prompt goes in the AI Prompt Log.

### The rules engine (this is what actually scores)

Each trigger adds points. Cap at 100. Show the matched phrase next to every flag.

| Flag | Points |
|---|---|
| Upfront payment requested before job confirmation | 25 |
| No SLBFE licence number anywhere in the advert | 20 |
| Contact is a personal WhatsApp or mobile number only | 15 |
| "Visa guaranteed" / "no experience needed" / "100% job" | 15 |
| Urgency pressure — "only 2 slots", "today only", "urgent" | 10 |
| Asks for passport to be handed over | 10 |
| Payment to a personal bank account | 10 |
| Salary stated far above market for the role | 5 |

**Bands:** 0–29 Low · 30–59 Caution · 60–100 High risk.

---

## 5. Stack

| Layer | Choice | Why (memorise this — the panel will ask) |
|---|---|---|
| Framework | React + Vite | Fast dev server, near-zero config, instant Vercel deploys |
| Styling | Tailwind CSS | Responsive utilities without writing a stylesheet under time pressure |
| Data | Static JSON files | Four-hour scope; no schema, no migrations, no connection failures |
| Persistence | localStorage | Reports survive a page refresh during the demo without a backend |
| AI | Claude API (optional layer) | Text analysis with a rules fallback |
| Hosting | **Vercel** | Free, git-connected, deploys on every push, gives a public HTTPS URL |
| Version control | GitHub | Required deliverable |

**Deliberately not using:** a database, real auth, file uploads, SMS, maps. Each of those is an hour we do not have, and none of them are in the marking scheme.

### Data files

`src/data/registry.json`
```json
{
  "licence_no": "FE/1234",
  "name": "Al-Falah Manpower (Pvt) Ltd",
  "type": "agency",
  "parent_licence": null,
  "district": "Colombo",
  "status": "active",
  "phone": "011XXXXXXX"
}
```
Target 40–60 records. Include 3–4 with `status: "expired"`, several `type: "sub_agent"` with a valid `parent_licence`, and at least one sub-agent whose `parent_licence` does not exist in the registry. Keep two realistic-sounding fake names **out** of the file so the demo can show a red "not found" verdict.

`src/data/blacklist.json`
```json
{
  "id": "C-018",
  "name": "Initials + surname only",
  "nic_masked": "9XXXXXXXXV",
  "destination": "Qatar",
  "amount_lkr": 185000,
  "reported_by": "Agency name",
  "date": "2026-07-14",
  "status": "verified"
}
```
8–10 seeded records, clearly fictional.

**Mandatory disclaimer, visible in the app footer and in the README:**
> Sample data compiled from publicly listed SLBFE information and fictional records, for academic demonstration only. This is not a live registry and must not be relied on for real hiring decisions.

That sentence protects us in panel questions. Do not skip it.

---

## 6. The ten minimum requirements — our definition of done

Print this. Tick each one physically when it works in the deployed build, not in localhost.

| # | Requirement | Where it lives | ✓ |
|---|---|---|---|
| 1 | Clear landing page | Hero + role toggle + search box | |
| 2 | Problem explained inside the app | "Why this matters" section with the real figures | |
| 3 | At least two functional features | Verify, Scanner, Candidate check, Reporting | |
| 4 | At least one form accepting input | Report incident form | |
| 5 | Validation with friendly error messages | Required fields, phone format, numeric amount, min 20 chars on description | |
| 6 | Display / search / filter / calculate / process | Registry search, risk scoring, report board filter | |
| 7 | Responsive on desktop and mobile | Test at 375px width | |
| 8 | Navigation between sections | Tabs: Verify / Scan / Reports / Learn | |
| 9 | Sample data relevant to the problem | registry.json + blacklist.json + seeded reports | |
| 10 | Clear demonstration of value | Impact section + the live demo | |

**Error messages must be friendly and specific.** Not "Invalid input" — "Please enter the amount in numbers only, for example 150000".

---

## 7. Roles

Everyone writes code. Everyone commits under their own GitHub account, throughout the session, not one dump at the end. The rubric explicitly rewards "meaningful history from all registered members".

| Member | Owns |
|---|---|
| **A** | Repo setup, Vercel deploy, registry search + verdict cards, final push |
| **B** | Rules engine, risk score UI, blacklist data, AI layer if we reach it |
| **C** | Layout, role toggle, tabs, report form, validation, responsive pass |
| **D** | README, AI prompt log, problem/impact content, moderation board, demo video |

Record what each person did in the README. That is worth 5 marks and takes ten minutes.

---

## 8. Timeline

| Time | Phase | Work |
|---|---|---|
| 0–20 | Plan | Lock scope. Print the checklist. No further scope discussion after minute 20. |
| 20–45 | Setup | **A:** repo + empty app **deployed to Vercel and confirmed live**. **B:** registry.json + blacklist.json. **C:** layout, role toggle, tabs. **D:** README skeleton + prompt log started. |
| 45–110 | Build core | **A:** search + fuzzy match + verdict cards both sides. **B:** rules engine + score UI. **C:** report form + validation. **D:** problem/impact sections, seeded reports. |
| 110–150 | Build moderation | Admin passcode view, approve/reject, public vs pending boards. Merge everything. |
| 150–175 | AI or polish | AI layer **only if the checklist is green**. Otherwise polish and fix. |
| 175–205 | Polish | Break it on purpose. Mobile pass. Empty states. |
| 205–225 | Ship | Final push. Verify the deployed build matches the repo. Incognito test on a phone over mobile data. |
| 225–240 | Submit | Record video. Assemble PDF. Upload. |

**Two hard rules:** scope locks at minute 20. Building stops at minute 175.

**Deploy at minute 45, not minute 205.** Deploying an empty app early turns deployment from a risk into a solved problem, and protects 10 marks.

### Break-testing script (minute 175)

- Submit the report form completely empty
- Type symbols and numbers into the agency name search
- Paste 5,000 characters into the scanner
- Enter letters into the amount field
- Search for something that does not exist — does the empty state look intentional?
- Open the live URL on a phone, in incognito, on mobile data
- Rotate the phone to landscape

---

## 9. Deliverables

### GitHub repository
Meaningful commit history from all members. README.md must contain **all ten** of these:

1. Project title
2. The selected problem
3. The proposed solution
4. Main features
5. Technologies used
6. **AI tools used** — one line each, stating what it did and what we changed
7. Team member details and contributions
8. Installation and execution instructions
9. Deployed application link
10. Demonstration video link

### Deployment
Vercel. Public link must work for anyone. **Test it in incognito** so we are not fooled by our own cache.

### Demonstration video — maximum 2 minutes
Upload to OneDrive or any accessible platform. Check the sharing permission is open before submitting.

### Submission PDF — renamed with our Group ID
Uploaded to courseweb.sliit.lk before the session ends. Must contain:

1. Git repository link
2. Deployed application link
3. Two-minute demonstration video link
4. Team member names and student IDs
5. Short description of the problem and our solution
6. List of technologies and AI tools used
7. **AI Prompt Log**
8. **AI usage declaration**

### AI Prompt Log — mandatory
Fill this in **as we go**, not at minute 235. For every significant AI use: the tool, the exact prompt, the purpose, and how we checked or modified the output. Redact any keys.

| Tool | Exact prompt | Purpose | How we checked / changed it |
|---|---|---|---|
| | | | |

### AI declaration — mandatory, in README *and* PDF
One line per tool, in the format the spec gives:
> "Claude Code — generated the initial registry search component; we rewrote the fuzzy matching and added the expired-licence branch."

The team contribution statement must be **in our own words** — the spec says AI cannot write that one.

---

## 10. The presentation

### Video structure (target 1:50)

| Time | Content |
|---|---|
| 0:00–0:15 | Team, project name, one-line pitch |
| 0:15–0:40 | The Sri Lankan problem, with one real figure |
| 0:40–1:10 | Live demo: paste a fake Dubai job post → 82/100 high risk with flags shown |
| 1:10–1:30 | Verify the agent → "not found in registry". Flip to agent side → candidate check |
| 1:30–1:45 | Submit a report → admin verifies it → it appears on the public board |
| 1:45–1:55 | Show the live Vercel URL and state the expected impact |

Record the screen with the deployed URL visible in the address bar. Rehearse once. Being over time costs marks.

### Panel questions — prepare one answer each

- **"How does the risk score work?"** → know the weights and the bands
- **"Why no database?"** → four-hour scope, static reference data, zero deployment risk, and it let us finish all ten requirements
- **"Where did the data come from?"** → publicly listed SLBFE information plus fictional records, disclaimed in the app
- **"Show me this function and explain it"** → everyone must be able to explain their own code and one section of someone else's
- **"Make a small live change"** → be ready to change a threshold or a label and redeploy
- **"What would you build next?"** → live SLBFE registry integration, verified agent accounts, SMS verification, Sinhala and Tamil, embassy escalation

---

## 11. How we are marked

| Criterion | Marks | How we secure it |
|---|---|---|
| Relevance of the Sri Lankan problem | 10 | Real 2026 sources, named affected users, in-app problem section |
| Practicality & creativity | 15 | Two-sided coverage nobody else will build, tightly scoped |
| Minimum functional requirements | 20 | The checklist in section 6, ticked on the deployed build |
| Quality & usability | 15 | Responsive, friendly validation, break-tested |
| Technology & AI tools | 10 | Justified stack, prompt log, every member can explain the code |
| Git repository & documentation | 10 | Commits from all members throughout, complete README |
| Successful deployment | 10 | Deployed at minute 45, incognito-tested |
| 2-minute demonstration | 5 | Scripted, rehearsed, under time |
| Contribution from all members | 5 | Individual commits + README contribution table |

Note: where a team sits between two bands, the examiner awards the **lower** band. Ambiguity costs us. Make every requirement obviously present.

---

## 12. Academic integrity

- AI assistance is permitted and encouraged. **Submitting a pre-built or previously submitted project is not.**
- All code is written during the session. Planning, templates and this document are fine — the codebase is not.
- We must be able to explain every line we submit. An undeclared AI dependency that becomes evident during the demo is treated as a breach of the declaration.

---

## 13. Bring to the session

- Laptops charged, chargers, a mobile hotspot as wifi backup
- GitHub accounts logged in, Vercel accounts created and linked **before** the session
- Node installed and working
- Claude Code / AI tool set up and logged in
- Screen recorder installed and tested
- This document, printed

---

## Appendix — Team details

| Name | Student ID | Contribution |
|---|---|---|
| Jamsith M.M.M | IT24103421 | |
| | | |
| | | |
| | | |

**Group ID:** ____________
**Repo:** ____________
**Live URL:** ____________
**Video link:** ____________
