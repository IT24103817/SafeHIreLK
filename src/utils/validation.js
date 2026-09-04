/*
  Owner: C — form validation.

  One rule for every message in here: say what to do and show an example.
  "Invalid input" tells someone standing at a bus halt on a phone nothing at
  all. "Please enter the amount in numbers only, for example 150000" tells
  them exactly what to type next.
*/

const MIN_DESCRIPTION_LENGTH = 20

// 0771234567 or +94771234567, spaces, dashes and brackets allowed while typing.
const PHONE_PATTERN = /^(?:\+94|0)\d{9}$/

// A masked NIC: digits and X, ending in an optional V. We require at least
// three X characters, because the whole point is that the number is hidden
// before it is shared with other agencies.
const NIC_PATTERN = /^[0-9X]{9,12}V?$/
const MIN_HIDDEN_DIGITS = 3

export function isBlank(value) {
  return typeof value !== 'string' || value.trim() === ''
}

// Strips the characters people naturally type inside a phone number.
export function cleanPhone(value) {
  return typeof value === 'string' ? value.replace(/[\s\-()]/g, '') : ''
}

// Strips thousands separators so "150,000" and "150 000" are accepted.
export function cleanAmount(value) {
  return typeof value === 'string' ? value.replace(/[\s,]/g, '') : ''
}

/*
  Check every field for the role that is filling the form.

  Returns an object of field name -> message. An empty object means the form
  is good to submit.
*/
export function validateReport(role, values) {
  const errors = {}
  const isAgent = role === 'agent'

  if (isBlank(values.subjectName)) {
    errors.subjectName = isAgent
      ? 'Please enter the candidate initials and surname, for example K. Perera'
      : 'Please enter the agency name so others can search for it'
  }

  if (isAgent) {
    const nic = values.subjectNic.trim().toUpperCase()

    if (isBlank(values.subjectNic)) {
      errors.subjectNic =
        'Please enter the NIC with the middle digits hidden, for example 9XXXXXXXXV'
    } else if (
      !NIC_PATTERN.test(nic) ||
      (nic.match(/X/g) || []).length < MIN_HIDDEN_DIGITS
    ) {
      errors.subjectNic =
        'Please hide the middle digits of the NIC before sharing it, for example 9XXXXXXXXV'
    }
  } else {
    const phone = cleanPhone(values.subjectPhone)

    if (isBlank(values.subjectPhone)) {
      errors.subjectPhone =
        'Please enter the number the agent contacted you on, for example 0771234567'
    } else if (!PHONE_PATTERN.test(phone)) {
      errors.subjectPhone =
        'Please enter a valid phone number, for example 0771234567'
    }
  }

  if (isBlank(values.destination)) {
    errors.destination = 'Please choose the destination country from the list'
  }

  const amount = cleanAmount(values.amount)

  if (isBlank(values.amount)) {
    errors.amount =
      'Please enter the amount in numbers only, for example 150000'
  } else if (!/^\d+$/.test(amount)) {
    errors.amount =
      'Please enter the amount in numbers only, for example 150000'
  } else if (Number(amount) <= 0) {
    errors.amount =
      'Please enter an amount greater than zero, for example 150000'
  }

  if (isBlank(values.description)) {
    errors.description =
      'Please describe what happened in a little more detail — at least 20 characters'
  } else if (values.description.trim().length < MIN_DESCRIPTION_LENGTH) {
    errors.description =
      'Please describe what happened in a little more detail — at least 20 characters'
  }

  if (isAgent && isBlank(values.reportedBy)) {
    errors.reportedBy =
      'Please enter your agency name so other agencies know who reported this'
  }

  return errors
}
