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

export function toAutoSaveTimestamp(dateString: string) {
  const date = isValidDateString(dateString) ? new Date(dateString) : new Date();
  return `${toDateString(date)} ${toTimeString(date)}`;
}

function isValidDateString(dateString: string) {
  const timestamp = Date.parse(dateString);
  return !isNaN(timestamp);
}

export function toDateString(date: Date, separator = ".") {
  const year = date.getFullYear().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return [year, month, day].join(separator);
}

function toTimeString(date: Date, separator = ":") {
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");
  return [hours, minutes, seconds].join(separator);
}
