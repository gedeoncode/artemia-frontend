export const smartTruncate = (
  text: string,
  maxLength: number
): string => {
  if (!text || text.length <= maxLength) return text;

  const truncated = text.slice(0, maxLength);

  // Avoid cutting mid-word
  const lastSpace = truncated.lastIndexOf(" ");
  if (lastSpace > 0) {
    return truncated.slice(0, lastSpace) + "…";
  }

  return truncated + "…";
};