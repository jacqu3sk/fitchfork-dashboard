// src/services/admin.ts
import type { SystemStatus } from "@/types/system";
import { apiFetch } from "@/utils/api";
/**
 * Fetch current system metrics like CPU, memory, and disk usage.
 */
export async function fetchSystemStatus(): Promise<SystemStatus> {
  const res = await apiFetch<SystemStatus>("/status");
  if (!res.success) throw new Error(res.message);
  return res.data;
}

/**
 * Fetch system logs from multiple services via journalctl.
 */
export async function fetchLogs(): Promise<string> {
  const res = await apiFetch<{ logs: string }>("/logs");
  if (!res.success) throw new Error(res.message);
  return res.data.logs;
}

/**
 * Run a system admin command and return the result.
 * @param command - The shell command to run (e.g., `systemctl restart xyz`)
 */
export async function runAdminCommand(command: string): Promise<string> {
  const res = await apiFetch<{ result: string }>("/run", {
    method: "POST",
    body: JSON.stringify({ command }),
  });
  if (!res.success) throw new Error(res.message);
  return res.data.result || "Command executed.";
}