import { Typography, Row, Col, Switch, Space } from "antd";
import { useEffect, useState } from "react";
import axios from "axios";
import { message } from "antd";
import CommandPanel from "../components/CommandPanel";
import LogsPanel from "../components/LogsPanel";
import ServiceManager from "../components/ServiceManager";
import SystemStatusCard from "../components/SystemStatusCard";
import type { SystemStatus } from "../types/system";

const API_BASE = import.meta.env.VITE_ADMIN_API_URL;

export default function Dashboard() {
	const [status, setStatus] = useState<SystemStatus | null>(null);
	const [logs, setLogs] = useState<string>("");
	const [autoRefresh, setAutoRefresh] = useState(
		localStorage.getItem("autoRefreshStatus") === "true"
	);
	const [autoRefreshLogs, setAutoRefreshLogs] = useState(
		localStorage.getItem("autoRefreshLogs") === "true"
	);

	const loadStatus = async () => {
		try {
			const res = await axios.get(`${API_BASE}/status`);
			setStatus(res.data);
		} catch {
			message.error("Failed to load system status");
		}
	};

	const loadLogs = async () => {
		try {
			const res = await axios.get(`${API_BASE}/logs`);
			setLogs(res.data.logs);
		} catch {
			message.error("Failed to load logs");
		}
	};

	const runCommand = async (command: string) => {
		try {
			const res = await axios.post(`${API_BASE}/run`, { command });
			message.success(res.data.result || "Command executed");
		} catch (err: unknown) {
			if (axios.isAxiosError(err) && err.response?.data?.error) {
				message.error(err.response.data.error);
			} else {
				message.error("Command failed");
			}
		}
	};

	useEffect(() => {
		loadStatus();
		loadLogs();

		let statusInterval: number | undefined;
		let logsInterval: number | undefined;

		if (autoRefresh) {
			statusInterval = window.setInterval(loadStatus, 1000);
		}
		if (autoRefreshLogs) {
			logsInterval = window.setInterval(loadLogs, 3000);
		}

		return () => {
			if (statusInterval) clearInterval(statusInterval);
			if (logsInterval) clearInterval(logsInterval);
		};
	}, [autoRefresh, autoRefreshLogs]);

	useEffect(() => {
		localStorage.setItem("autoRefreshStatus", autoRefresh.toString());
	}, [autoRefresh]);

	useEffect(() => {
		localStorage.setItem("autoRefreshLogs", autoRefreshLogs.toString());
	}, [autoRefreshLogs]);

	return (
		<div className="p-6">
			<Typography.Title level={2}>FitchFork Server Dashboard</Typography.Title>

			<Row gutter={[24, 24]}>
				<Col xs={24} md={12}>
					<SystemStatusCard
						status={status}
						onRefresh={loadStatus}
						autoRefresh={autoRefresh}
						setAutoRefresh={setAutoRefresh}
					/>
				</Col>

				<Col xs={24} md={12}>
					<CommandPanel onRunCommand={runCommand} />
				</Col>

				<Col span={24}>
					<Space style={{ marginBottom: 12 }}>
						<Switch
							checked={autoRefreshLogs}
							onChange={setAutoRefreshLogs}
							checkedChildren="Logs: Auto"
							unCheckedChildren="Logs: Manual"
						/>
					</Space>
					<LogsPanel logs={logs} onRefresh={loadLogs} />
				</Col>

				<Col span={24}>
					<ServiceManager />
				</Col>
			</Row>
		</div>
	);
}
