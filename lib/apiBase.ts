/**
 * Base URL for API requests.
 * In the browser, requests go to `/api/backend/...` and Next.js rewrites them
 * to `NEXT_PUBLIC_API_URL` (see `next.config.ts`), avoiding cross-origin (CORS) failures.
 * On the server, the full configured URL is used.
 */
export function apiBase(): string {
  if (typeof window !== "undefined") {
    return "/api/backend";
  }
  const fromEnv = process.env.NEXT_PUBLIC_API_URL || "https://api.aoandco.tech";
  return String(fromEnv).replace(/\/$/, "");
}
