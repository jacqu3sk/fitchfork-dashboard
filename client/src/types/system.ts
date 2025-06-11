export interface SystemStatus {
	uptime: number;
	load: [number, number, number];
	memUsedMB: string;
	memTotalMB: string;
	cpuCores?: number;
	diskUsedMB?: string;
	diskTotalMB?: string;
	cpuTemp?: string;
}
