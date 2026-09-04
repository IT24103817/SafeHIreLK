/*
  The moderator passcode.

  This is NOT authentication and we say so in the app, in the README and in the
  demo. It sits in the client source, so anyone can read it. It exists to
  demonstrate the moderation workflow — approve, reject, publish — without
  spending an hour of a four hour build on a login system that earns no marks.

  It lives in its own file because two places need it: the sign-in dialog, and
  the request that shares a moderator decision with the other devices.
*/
export const DEMO_PASSCODE = 'admin2026'
