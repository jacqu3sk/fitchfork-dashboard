export interface SystemStatus {
	uptime: number;
	load: [number, number, number];
	memUsedMB: string;
	memTotalMB: string;
	memPercent?: string;

	cpuCores?: number;
	cpuModel?: string;
	cpuUsagePercent?: string;
	cpuTemp?: string;

	perCoreLoad?: string[];
	diskPercentUsed?: string;
	diskUsedMB?: string;
	diskTotalMB?: string;

	hostname?: string;
	platform?: string;
	arch?: string;
	nodeVersion?: string;
}
