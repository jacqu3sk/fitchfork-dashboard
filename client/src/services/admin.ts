// src/services/admin.ts
import axios from "axios";
import type { SystemStatus } from "@/types/system";

const API_BASE = import.meta.env.VITE_ADMIN_API_URL;

export async function fetchSystemStatus(): Promise<SystemStatus> {
	const res = await axios.get(`${API_BASE}/status`);
	return res.data;
}

export async function fetchLogs(): Promise<string> {
	const res = await axios.get(`${API_BASE}/logs`);
	return res.data.logs;
}

export async function runAdminCommand(command: string): Promise<string> {
	const res = await axios.post(`${API_BASE}/run`, { command });
	return res.data.result || "Command executed";
}
