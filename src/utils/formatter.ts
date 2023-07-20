export function toBalancedTwoLines(text: string) {
  const middleIndex = Math.floor(text.length / 2);
  let splitIndex = text.lastIndexOf(" ", middleIndex - 1);
  if (splitIndex === -1) splitIndex = middleIndex - 1;

  const firstHalf = text.slice(0, splitIndex).trim();
  const secondHalf = text.slice(splitIndex).trim();
  return `${firstHalf}\n${secondHalf}`;
}

export function toCompactNumber(n: number) {
  return Intl.NumberFormat("en", {notation: "compact"}).format(n);
}
