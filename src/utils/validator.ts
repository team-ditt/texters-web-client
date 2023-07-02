export function isNonEmptyAlpha(value: string) {
  return /^[a-zA-Z]+$/.test(value);
}

export function isEmail(value: string) {
  return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value);
}

export function isFilled(value: string) {
  return /\w+/.test(value);
}

export function isPostcode(value: string) {
  return /[0-9]{4}/.test(value);
}
