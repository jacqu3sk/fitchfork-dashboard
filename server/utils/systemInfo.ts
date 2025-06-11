import os from "os";
import { SystemStatus } from "../types";

export function getSystemStatus(): SystemStatus {
	const usedMem = os.totalmem() - os.freemem();
	return {
		uptime: os.uptime(),
		load: os.loadavg() as [number, number, number],
		memUsedMB: (usedMem / 1024 / 1024).toFixed(1),
		memTotalMB: (os.totalmem() / 1024 / 1024).toFixed(1),
	};
}
