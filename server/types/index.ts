export interface SystemStatus {
	uptime: number;
	load: [number, number, number];
	memUsedMB: string;
	memTotalMB: string;
}
