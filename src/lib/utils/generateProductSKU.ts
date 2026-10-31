export const generateSku = (id?: string, prefix = "PRD") => {
  if (!id) return "";

  return `${prefix}-${id.toString().slice(-8).toUpperCase()}`;
};