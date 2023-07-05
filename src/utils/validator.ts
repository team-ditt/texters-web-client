export function isValidPenName(value: string) {
  return /^[a-zA-Z0-9가-힣]{1,15}$/.test(value);
}
