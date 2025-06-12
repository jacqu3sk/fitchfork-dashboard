import os from "os";
import disk from "diskusage";
import si from "systeminformation";
import { SystemStatus } from "../types";

export async function getSystemStatus(): Promise<SystemStatus> {
	const usedMem = os.totalmem() - os.freemem();
	const totalMemMB = os.totalmem() / 1024 / 1024;
	const usedMemMB = usedMem / 1024 / 1024;

	let diskUsedMB: string | undefined;
	let diskTotalMB: string | undefined;
	let diskPercentUsed: string | undefined;
	let cpuTemp: string | undefined;
	let cpuUsagePercent: string | undefined;
	let perCoreLoad: string[] | undefined;

	try {
		const { total, free } = disk.checkSync("/");
		diskUsedMB = ((total - free) / 1024 / 1024).toFixed(1);
		diskTotalMB = (total / 1024 / 1024).toFixed(1);

		const percent = (parseFloat(diskUsedMB) / parseFloat(diskTotalMB)) * 100;
		diskPercentUsed = percent.toFixed(1);
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

	try {
		const loadData = await si.currentLoad();
		cpuUsagePercent = loadData.currentLoad.toFixed(1);
		perCoreLoad = loadData.cpus.map((cpu: { load: number }) =>
			cpu.load.toFixed(1)
		);
	} catch (e) {
		console.error("CPU load error:", e);
	}

	return {
		uptime: os.uptime(),
		load: os.loadavg() as [number, number, number],
		memUsedMB: usedMemMB.toFixed(1),
		memTotalMB: totalMemMB.toFixed(1),
		memPercent: ((usedMemMB / totalMemMB) * 100).toFixed(1),
		cpuCores: os.cpus().length,
		cpuModel: os.cpus()[0].model,
		hostname: os.hostname(),
		platform: os.platform(),
		arch: os.arch(),
		nodeVersion: process.version,
		cpuTemp,
		cpuUsagePercent,
		perCoreLoad,
		diskUsedMB,
		diskTotalMB,
		diskPercentUsed,
	};
}
