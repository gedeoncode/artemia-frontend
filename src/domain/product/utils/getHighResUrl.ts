export function getHighResUrl(url: string, width = 3000, q = 90) {
  try {
    const u = new URL(url);
    u.searchParams.set("w", String(width));
    u.searchParams.set("q", String(q));
    u.searchParams.set("auto", "format");
    return u.toString();
  } catch {
    const sep = url.includes("?") ? "&" : "?";
    return `${url}${sep}w=${width}&q=${q}&auto=format`;
  }
}
