import { afterEach, expect, it, vi } from "vitest";
import { emailRuntimeEnv } from "@/lib/runtime-env.server";
const env: Record<string, unknown> = {};

afterEach(() => {
  for (const key of Object.keys(env)) delete env[key];
  vi.unstubAllEnvs();
});
it("reads worker secrets at request time instead of capturing missing build variables", async () => {
  vi.stubEnv("EMAILJS_SERVICE_ID", "");
  env["EMAILJS_SERVICE_ID"] = "worker_service";
  expect((await emailRuntimeEnv(env))["EMAILJS_SERVICE_ID"]).toBe("worker_service");
  env["EMAILJS_SERVICE_ID"] = "updated_service";
  expect((await emailRuntimeEnv(env))["EMAILJS_SERVICE_ID"]).toBe("updated_service");
});
it("supports local Node server environment variables", async () => {
  vi.stubEnv("EMAILJS_SERVICE_ID", "local_service");
  expect((await emailRuntimeEnv())["EMAILJS_SERVICE_ID"]).toBe("local_service");
});
