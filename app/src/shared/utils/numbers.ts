export function isValidInteger(value: string): boolean {
  if (!/^-?\d+$/.test(value)) {
    return false;
  }

  const num = Number(value);
  return Number.isInteger(num) && Number.isSafeInteger(num);
}
