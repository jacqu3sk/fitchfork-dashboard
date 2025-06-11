import { useEffect, useState } from "react";
import {
	Card,
	Button,
	Typography,
	Row,
	Col,
	Space,
	Descriptions,
	Tag,
} from "antd";
import axios from "axios";

const API = "http://localhost:4000/api"; // Change in production

interface SystemStatus {
	uptime: number;
	load: [number, number, number];
	memUsedMB: string;
	memTotalMB: string;
}

function formatUptime(seconds: number): string {
	const hrs = Math.floor(seconds / 3600);
	const mins = Math.floor((seconds % 3600) / 60);
	return `${hrs}h ${mins}m`;
}

export default function Dashboard() {
	const [status, setStatus] = useState<SystemStatus | null>(null);
	const [logs, setLogs] = useState<string>("");

	const loadStatus = async () => {
		const res = await axios.get(`${API}/status`);
		setStatus(res.data);
	};

	const loadLogs = async () => {
		const res = await axios.get(`${API}/logs`);
		setLogs(res.data.logs);
	};

	const runCommand = async (command: string) => {
		const res = await axios.post(`${API}/run`, { command });
		alert(res.data.result || res.data.error);
	};

	useEffect(() => {
		loadStatus();
		loadLogs();
	}, []);

	return (
		<div style={{ padding: 24 }}>
			<Typography.Title level={2} style={{ marginBottom: 24 }}>
				FitchFork Server Dashboard
			</Typography.Title>

			<Row gutter={[24, 24]}>
				<Col xs={24} md={12}>
					<Card
						title="System Status"
						extra={<Button onClick={loadStatus}>Refresh</Button>}
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
							</Descriptions>
						) : (
							<Typography.Text type="secondary">Loading...</Typography.Text>
						)}
					</Card>
				</Col>

				<Col xs={24} md={12}>
					<Card title="Commands">
						<Space direction="vertical">
							<Button
								type="primary"
								onClick={() => runCommand("restart-backend")}
								block
							>
								Restart Backend
							</Button>
							<Button onClick={() => runCommand("pull-latest")} block>
								Git Pull Latest
							</Button>
						</Space>
					</Card>
				</Col>

				<Col span={24}>
					<Card
						title="Recent Logs"
						extra={<Button onClick={loadLogs}>Refresh</Button>}
					>
						<pre
							style={{
								background: "#111",
								color: "#0f0",
								padding: "1rem",
								borderRadius: 4,
								overflowX: "auto",
								maxHeight: 300,
							}}
						>
							{logs || "No logs loaded."}
						</pre>
					</Card>
				</Col>
			</Row>
		</div>
	);
}
