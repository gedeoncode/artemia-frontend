/**
 * Normalizes date-only inputs (YYYY-MM-DD) to ISO strings
 * Backend-safe for Joi.date() and MongoDB
 */
 function normalizeDateToISO(value?: string): string | undefined {
  if (!value) return undefined;

  const date = new Date(value);
  if (isNaN(date.getTime())) return undefined;

  return date.toISOString();
}

/** ✅ Helper: checks if string is valid ISO date YYYY-MM-DD */
function isValidISODate(value: string): boolean {
  const isoRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!isoRegex.test(value)) return false;

  const date = new Date(value + "T00:00:00Z");
  return !isNaN(date.getTime());
}

/** ✅ Helper: calculates age in years from a DOB string (UTC-safe) */
function calculateAge(dobString: string): number {
  const dob = new Date(dobString + "T00:00:00Z");
  const today = new Date();

  let age = today.getUTCFullYear() - dob.getUTCFullYear();

  const monthDiff = today.getUTCMonth() - dob.getUTCMonth();
  const dayDiff = today.getUTCDate() - dob.getUTCDate();

  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) age--;

  return age;
}

/** ✅ Helper: checks if DOB is in the past (UTC-safe) */
function isPastDate(dobString: string): boolean {
  const date = new Date(dobString + "T00:00:00Z");
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  return date < today;
}



export {  calculateAge, isValidISODate, isPastDate ,normalizeDateToISO };

