export function isValidPenName(value: string) {
  return /^[a-zA-Z0-9가-힣]{1,15}$/.test(value);
}

export function isMobileDevice(agent: string) {
  return /Mobi|Android|iPhone|iPad|iPod|Windows Phone|Mobile|Tablet/i.test(agent);
}
