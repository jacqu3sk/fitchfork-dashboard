import { Card, Descriptions, Tag, Typography } from "antd";
import type { SystemStatus } from "../types/system";
import RefreshToggle from "@/components/RefreshToggle";

function formatUptime(seconds: number): string {
	const hrs = Math.floor(seconds / 3600);
	const mins = Math.floor((seconds % 3600) / 60);
	return `${hrs}h ${mins}m`;
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
				<Descriptions column={1} size="small" bordered>
					<Descriptions.Item label="Uptime">
						<Tag color="blue">{formatUptime(status.uptime)}</Tag>
					</Descriptions.Item>

					<Descriptions.Item label="Memory Usage">
						<Tag color="geekblue">
							{status.memUsedMB} / {status.memTotalMB} MB
						</Tag>
					</Descriptions.Item>

					<Descriptions.Item label="Load Average">
						<Tag>{status.load.map((l) => l.toFixed(2)).join(" / ")}</Tag>
					</Descriptions.Item>

					{status.cpuCores && (
						<Descriptions.Item label="CPU Cores">
							<Tag>{status.cpuCores}</Tag>
						</Descriptions.Item>
					)}

					{status.cpuTemp && (
						<Descriptions.Item label="CPU Temp">
							<Tag color="red">{status.cpuTemp}</Tag>
						</Descriptions.Item>
					)}

					{status.diskUsedMB && status.diskTotalMB && (
						<Descriptions.Item label="Disk Usage">
							<Tag color="orange">
								{status.diskUsedMB} / {status.diskTotalMB} MB
							</Tag>
						</Descriptions.Item>
					)}
				</Descriptions>
			) : (
				<Typography.Text type="secondary">Loading...</Typography.Text>
			)}
		</Card>
	);
}
