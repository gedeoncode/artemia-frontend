export async function clientFetch(url: string, options?: RequestInit) {
  console.log("Url:", url)
  const res = await fetch(url, {
    ...options, // ✅ FIRST
      credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || `HTTP error ${res.status}`);
  }

  return data;
}

