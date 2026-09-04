import { useEffect, useState } from 'react'

/*
  Returns the value only after the user has stopped changing it for `delay`
  milliseconds.

  Without this the results list would rebuild on every keystroke and the
  "no match found" panel would flash while someone is halfway through typing
  an agency name.
*/
export default function useDebouncedValue(value, delay = 250) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)

    // Runs before the next effect, so a fast typist keeps resetting the timer
    // and we only ever search once at the end.
    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}
