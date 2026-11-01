// Node development uses process.env; Workers exposes runtime secrets as bindings.
// Read on each request so newly configured secrets are not captured at build time.
export async function emailRuntimeEnv(): Promise<Record<string, string | undefined>> {
  let bindings: Record<string, unknown> = {};
  try {
    const workers = await import("cloudflare:workers");
    bindings = workers.env;
  } catch { /* This module is unavailable outside Cloudflare Workers. */ }
  return Object.fromEntries([
    "EMAILJS_SERVICE_ID", "EMAILJS_TEMPLATE_ID", "EMAILJS_PUBLIC_KEY", "EMAILJS_PRIVATE_KEY",
  ].map((key) => [key, typeof bindings[key] === "string" ? bindings[key] : process.env[key]]));
}
