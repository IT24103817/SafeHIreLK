/*
  Owner: B — the rules engine that scores a pasted job advert.

  Planned exports (Phase 2):
    scoreAdvert(text)  ->  { score, band, flags }
       score  0-100, capped at 100
       band   'low' (0-29) | 'caution' (30-59) | 'high' (60-100)
       flags  one entry per triggered rule, each carrying the exact
              phrase from the advert that matched, so the user can see
              why the score is what it is

  This file is the product. It must always return a result and must never
  call an API. The optional AI layer only adds explanation on top of it.
*/
