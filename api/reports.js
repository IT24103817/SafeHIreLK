import { MongoClient } from 'mongodb'

/*
  Vercel serverless function: /api/reports

  GET    -> { reports, statuses }   everything other people have shared
  POST   -> save one new report     (always saved as pending)
  PATCH  -> record a moderator decision

  This is a SYNC layer, not the source of truth.

  The app reads and writes localStorage first and renders from it immediately.
  This function only adds reports submitted on other devices. If MONGODB_URI is
  not set, if Atlas is unreachable, or if campus wifi blocks it, every call here
  fails and the browser quietly carries on with the local data. Nothing in the
  demo depends on this working — same rule as the AI layer.
*/

const DB_NAME = 'safehire'
const REPORTS = 'reports'
const STATUSES = 'statuses'

// Anyone can reach this URL, so cap what a single request can do.
const MAX_TEXT = 600
const MAX_DESCRIPTION = 2000
const MAX_RETURNED = 200

/*
  A serverless function can be invoked many times on the same warm container.
  Opening a new connection each time exhausts the Atlas connection limit fast,
  so the client is cached on globalThis and reused.
*/
const cache = globalThis._safehireMongo || (globalThis._safehireMongo = {})

async function getDb() {
  if (!process.env.MONGODB_URI) return null

  if (!cache.promise) {
    cache.promise = new MongoClient(process.env.MONGODB_URI, {
      // Fail fast. A hanging database must never hold up the browser.
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
      maxPoolSize: 5,
    }).connect()
  }

  cache.client = await cache.promise
  return cache.client.db(DB_NAME)
}

function text(value, max = MAX_TEXT) {
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  return trimmed === '' ? null : trimmed.slice(0, max)
}

/*
  Rebuild the report from scratch rather than storing whatever was posted.
  Anything not in this list is dropped, and the status is always pending —
  a report cannot arrive already approved.
*/
function cleanReport(body) {
  const description = text(body?.description, MAX_DESCRIPTION)
  const subjectName = text(body?.subject_name)

  if (subjectName === null || description === null || description.length < 20) {
    return null
  }

  const amount = Number(body?.amount_lkr)

  return {
    client_id: text(body?.client_id, 64) || String(Date.now()),
    type: body?.type === 'candidate' ? 'candidate' : 'agent',
    reported_by_role: body?.reported_by_role === 'agent' ? 'agent' : 'seeker',
    subject_name: subjectName,
    subject_phone: text(body?.subject_phone, 32),
    subject_nic: text(body?.subject_nic, 32),
    destination: text(body?.destination, 64) || 'Other',
    district: text(body?.district, 64),
    amount_lkr: Number.isFinite(amount) && amount > 0 ? Math.round(amount) : 0,
    contact_method: text(body?.contact_method, 64),
    description,
    reported_by: text(body?.reported_by) || 'Job seeker (name withheld)',
    date:
      typeof body?.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(body.date)
        ? body.date
        : new Date().toISOString().slice(0, 10),
    status: 'pending',
    created_at: new Date().toISOString(),
  }
}

export default async function handler(request, response) {
  let db
  try {
    db = await getDb()
  } catch (error) {
    return response.status(503).json({ error: 'Shared reports unavailable' })
  }

  if (db === null) {
    // No database configured on this deployment. Perfectly fine.
    return response.status(503).json({ error: 'Shared reports not configured' })
  }

  try {
    if (request.method === 'GET') {
      const [reports, statuses] = await Promise.all([
        db
          .collection(REPORTS)
          .find({}, { projection: { _id: 0 } })
          .sort({ date: -1 })
          .limit(MAX_RETURNED)
          .toArray(),
        db.collection(STATUSES).find({}).limit(MAX_RETURNED).toArray(),
      ])

      const statusMap = {}
      for (const row of statuses) {
        if (typeof row._id === 'string' && typeof row.status === 'string') {
          statusMap[row._id] = row.status
        }
      }

      return response.status(200).json({ reports, statuses: statusMap })
    }

    if (request.method === 'POST') {
      const report = cleanReport(request.body)
      if (report === null) {
        return response.status(400).json({ error: 'Report is not complete' })
      }

      // Keyed on client_id so a retry cannot create a duplicate.
      await db
        .collection(REPORTS)
        .updateOne(
          { client_id: report.client_id },
          { $setOnInsert: report },
          { upsert: true }
        )

      return response.status(201).json({ ok: true, client_id: report.client_id })
    }

    if (request.method === 'PATCH') {
      const id = text(request.body?.id, 64)
      const status = request.body?.status
      const allowed = ['pending', 'verified', 'rejected']

      /*
        The same demo passcode guards this. It is not authentication — the
        passcode is in the client source and anyone can read it. It exists so a
        public URL cannot be casually used to approve reports, and it is stated
        plainly in the README and in the app.
      */
      if (request.body?.passcode !== 'admin2026') {
        return response.status(403).json({ error: 'Moderator passcode required' })
      }

      if (id === null || !allowed.includes(status)) {
        return response.status(400).json({ error: 'Unknown report or status' })
      }

      await db
        .collection(STATUSES)
        .updateOne(
          { _id: id },
          { $set: { status, decided_at: new Date().toISOString() } },
          { upsert: true }
        )

      return response.status(200).json({ ok: true })
    }

    return response.status(405).json({ error: 'Method not allowed' })
  } catch (error) {
    // Any database failure is invisible to the user. The browser keeps its
    // local data and the app carries on.
    return response.status(503).json({ error: 'Shared reports unavailable' })
  }
}
