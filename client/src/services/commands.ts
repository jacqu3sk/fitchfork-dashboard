// src/services/commands.ts

import { apiFetch } from "@/utils/api";

/**
 * Runs a predefined backend command like restarting a service or pulling code.
 * Only commands whitelisted on the backend will succeed.
 *
 * @param command - The command key (e.g., "restart-backend", "pull-latest", "reboot")
 * @returns The result output from the server
 */
export async function runCommand(command: string): Promise<string> {
  const res = await apiFetch<{ result: string }>("/run", {
    method: "POST",
    body: JSON.stringify({ command }),
  });

  if (!res.success) {
    throw new Error(res.message);
  }

  return res.data.result || "Command executed.";
}
