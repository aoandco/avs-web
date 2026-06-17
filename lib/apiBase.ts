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
  const defaultApiUrl = "https://api.aoandco.tech";
  const fromEnv = process.env.NEXT_PUBLIC_API_URL || defaultApiUrl;
  return String(fromEnv).replace(/\/$/, "");
}

/**
 * Direct backend URL for multipart file uploads.
 * Next.js rewrites can corrupt multipart bodies, so uploads must hit the API directly.
 */
export function apiUploadBase(): string {
  const defaultApiUrl = "https://api.aoandco.tech";
  const fromEnv = process.env.NEXT_PUBLIC_API_URL || defaultApiUrl;
  return String(fromEnv).replace(/\/$/, "");
}
