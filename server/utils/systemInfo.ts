import os from "os";
import disk from "diskusage";
import si from "systeminformation";
import { SystemStatus } from "../types";

export async function getSystemStatus(): Promise<SystemStatus> {
	const usedMem = os.totalmem() - os.freemem();

	let diskUsedMB: string | undefined;
	let diskTotalMB: string | undefined;
	let cpuTemp: string | undefined;

	try {
		const { total, free } = disk.checkSync("/");
		diskUsedMB = ((total - free) / 1024 / 1024).toFixed(1);
		diskTotalMB = (total / 1024 / 1024).toFixed(1);
	} catch (e) {
		console.error("Disk usage error:", e);
	}

	try {
		const temp = await si.cpuTemperature();
		if (temp.main !== -1) {
			cpuTemp = `${temp.main.toFixed(1)}°C`;
		}
	} catch (e) {
		console.error("CPU temperature error:", e);
	}

	return {
		uptime: os.uptime(),
		load: os.loadavg() as [number, number, number],
		memUsedMB: (usedMem / 1024 / 1024).toFixed(1),
		memTotalMB: (os.totalmem() / 1024 / 1024).toFixed(1),
		cpuCores: os.cpus().length,
		diskUsedMB,
		diskTotalMB,
		cpuTemp,
	};
}
