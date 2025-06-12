// src/services/services.ts

import { apiFetch } from "@/utils/api";

/**
 * Fetches the status of a systemd service.
 *
 * @param serviceName - The full name of the service (e.g., "fitchfork.service")
 * @returns An object summarizing the service status
 */
export async function getServiceStatus(serviceName: string): Promise<{
  ActiveState?: string;
  SubState?: string;
  ExecMainStatus?: string;
  ExecMainPID?: string;
  RestartCount?: string;
  Description?: string;
}> {
  const res = await apiFetch<{
    ActiveState?: string;
    SubState?: string;
    ExecMainStatus?: string;
    ExecMainPID?: string;
    RestartCount?: string;
    Description?: string;
  }>(`/services/status/${serviceName}`);

  if (!res.success) {
    throw new Error(res.message);
  }

  return res.data;
}
