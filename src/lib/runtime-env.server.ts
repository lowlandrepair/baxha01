// Node development uses process.env; Workers exposes runtime secrets as bindings.
// Read on each request so newly configured secrets are not captured at build time.
export async function emailRuntimeEnv(workerBindings?: Record<string, unknown>): Promise<Record<string, string | undefined>> {
  let bindings: Record<string, unknown> = workerBindings ?? {};
  if (!workerBindings) try {
    // Keep this native import intact: Node's dev server has no Workers module.
    const moduleName = "cloudflare:workers";
    const workers = await import(/* @vite-ignore */ moduleName);
    bindings = workers.env;
  } catch { /* This module is unavailable outside Cloudflare Workers. */ }
  return Object.fromEntries([
    "EMAILJS_SERVICE_ID", "EMAILJS_TEMPLATE_ID", "EMAILJS_PUBLIC_KEY", "EMAILJS_PRIVATE_KEY",
  ].map((key) => [key, typeof bindings[key] === "string" ? bindings[key] : process.env[key]]));
}
