import { Card, Descriptions, Tag, Typography, Tooltip } from "antd";
import type { SystemStatus } from "../types/system";
import RefreshToggle from "@/components/RefreshToggle";

function formatUptime(seconds: number): string {
	const hrs = Math.floor(seconds / 3600);
	const mins = Math.floor((seconds % 3600) / 60);
	return `${hrs}h ${mins}m`;
}

function getCpuTempColor(tempStr: string): string {
	const temp = parseFloat(tempStr);
	if (isNaN(temp)) return "default";
	if (temp < 55) return "green";
	if (temp <= 65) return "gold";
	return "red";
}

function getCpuUsageColor(percentStr: string): string {
	const percent = parseFloat(percentStr);
	if (isNaN(percent)) return "default";
	if (percent <= 40) return "green";
	if (percent <= 75) return "gold";
	return "red";
}

export default function SystemStatusCard({
	status,
	onRefresh,
	autoRefresh,
	setAutoRefresh,
}: {
	status: SystemStatus | null;
	onRefresh: () => void;
	autoRefresh: boolean;
	setAutoRefresh: (v: boolean) => void;
}) {
	return (
		<Card
			title="System Status"
			extra={
				<RefreshToggle
					onRefresh={onRefresh}
					autoRefresh={autoRefresh}
					setAutoRefresh={setAutoRefresh}
				/>
			}
		>
			{status ? (
				<Descriptions column={2} size="small" bordered>
					<Descriptions.Item
						label={<Tooltip title="Name of this machine">Hostname</Tooltip>}
					>
						<Tag>{status.hostname}</Tag>
					</Descriptions.Item>

					<Descriptions.Item
						label={
							<Tooltip title="OS platform and architecture">Platform</Tooltip>
						}
					>
						<Tag>
							{status.platform} / {status.arch}
						</Tag>
					</Descriptions.Item>

					<Descriptions.Item
						label={
							<Tooltip title="Version of Node.js running this server">
								Node Version
							</Tooltip>
						}
					>
						<Tag>{status.nodeVersion}</Tag>
					</Descriptions.Item>

					<Descriptions.Item
						label={<Tooltip title="Detailed CPU model name">CPU Model</Tooltip>}
					>
						<Tag className="max-w-[20rem] whitespace-normal">
							{status.cpuModel}
						</Tag>
					</Descriptions.Item>

					<Descriptions.Item
						label={
							<Tooltip title="Number of logical CPU cores">CPU Cores</Tooltip>
						}
					>
						<Tag>{status.cpuCores}</Tag>
					</Descriptions.Item>

					{status.cpuUsagePercent && (
						<Descriptions.Item
							label={<Tooltip title="Overall CPU usage">CPU Usage</Tooltip>}
						>
							<Tag color={getCpuUsageColor(status.cpuUsagePercent)}>
								{status.cpuUsagePercent}%
							</Tag>
						</Descriptions.Item>
					)}

					{status.cpuTemp && (
						<Descriptions.Item
							label={<Tooltip title="CPU temperature">CPU Temp</Tooltip>}
						>
							<Tag color={getCpuTempColor(status.cpuTemp)}>
								{status.cpuTemp}
							</Tag>
						</Descriptions.Item>
					)}

					<Descriptions.Item
						label={
							<Tooltip title="RAM used / total and percentage">
								Memory Usage
							</Tooltip>
						}
					>
						<Tag color="geekblue">
							{status.memUsedMB} / {status.memTotalMB} MB ({status.memPercent}%)
						</Tag>
					</Descriptions.Item>

					<Descriptions.Item
						label={
							<Tooltip title="Load average over 1 / 5 / 15 mins">
								Load Average
							</Tooltip>
						}
					>
						<Tag>{status.load.map((l) => l.toFixed(2)).join(" / ")}</Tag>
					</Descriptions.Item>

					{status.diskUsedMB && status.diskTotalMB && (
						<Descriptions.Item
							label={
								<Tooltip title="Disk usage and percentage">Disk Usage</Tooltip>
							}
						>
							<Tag color="orange">
								{status.diskUsedMB} / {status.diskTotalMB} MB
								{status.diskPercentUsed ? ` (${status.diskPercentUsed}%)` : ""}
							</Tag>
						</Descriptions.Item>
					)}

					{status.perCoreLoad && (
						<Descriptions.Item
							label={
								<Tooltip title="CPU usage per logical core">
									Per-Core Usage
								</Tooltip>
							}
							span={2}
						>
							{status.perCoreLoad.map((load, idx) => (
								<Tag key={idx}>
									Core {idx}: {load}%
								</Tag>
							))}
						</Descriptions.Item>
					)}

					<Descriptions.Item
						label={
							<Tooltip title="System uptime since last boot">Uptime</Tooltip>
						}
					>
						<Tag color="blue">{formatUptime(status.uptime)}</Tag>
					</Descriptions.Item>
				</Descriptions>
			) : (
				<Typography.Text type="secondary">Loading...</Typography.Text>
			)}
		</Card>
	);
}
