export function toMinorUnits(amount?: number): number | undefined {
  if (amount == null) return undefined;

  return Math.round(amount * 100);
}