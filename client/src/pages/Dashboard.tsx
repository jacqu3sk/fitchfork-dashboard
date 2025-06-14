import { Typography, Row, Col, message, Space, Spin } from "antd";
import { useEffect, useState } from "react";

import type { SystemStatus } from "../types/system";
import { fetchSystemStatus, fetchLogs } from "@/services/admin";
import CommandPanel from "@/components/CommandPanel";
import LogsPanel from "@/components/LogsPanel";
import SystemStatusCard from "@/components/SystemStatusCard";
import type { Service } from "@/types/service";
import { getServiceStatus } from "@/services/services";
import ServiceCard from "@/components/ServiceCard";

export default function Dashboard() {
	const [status, setStatus] = useState<SystemStatus | null>(null);
	const [logs, setLogs] = useState<string>("");
	const [autoRefresh, setAutoRefresh] = useState(
		localStorage.getItem("autoRefreshStatus") === "true"
	);
	const [autoRefreshLogs, setAutoRefreshLogs] = useState(
		localStorage.getItem("autoRefreshLogs") === "true"
	);
	const [services, setServices] = useState<Service[]>([]);

	const loadServices = async () => {
		const updated: Service[] = [];

		for (const svc of [
			{ name: "fitchfork-api", systemd: "fitchfork.service" },
			{ name: "discord-bot", systemd: "discord-bot.service" },
		]) {
			try {
				const status = await getServiceStatus(svc.systemd);
				updated.push({
					name: svc.name,
					status: status.ActiveState === "active" ? "running" : "stopped",
					description: status.Description,
					pid: status.ExecMainPID,
					activeState: status.ActiveState,
					subState: status.SubState,
				});
			} catch {
				updated.push({
					name: svc.name,
					status: "stopped",
				});
			}
		}
		setServices(updated);
	};

	const loadStatus = async () => {
		try {
			const data = await fetchSystemStatus();
			setStatus(data);
		} catch {
			message.error("Failed to load system status");
		}
	};

	const loadLogs = async () => {
		try {
			const logData = await fetchLogs();
			setLogs(logData);
		} catch {
			message.error("Failed to load logs");
		}
	};

	useEffect(() => {
		loadStatus();
		loadLogs();
		loadServices(); // load services on first render

		let statusInterval: number | undefined;
		let logsInterval: number | undefined;
		let servicesInterval: number | undefined;

		if (autoRefresh) {
			statusInterval = window.setInterval(loadStatus, 1000);
			servicesInterval = window.setInterval(loadServices, 1000);
		}
		if (autoRefreshLogs) {
			logsInterval = window.setInterval(loadLogs, 3000);
		}

		return () => {
			if (statusInterval) clearInterval(statusInterval);
			if (logsInterval) clearInterval(logsInterval);
			if (servicesInterval) clearInterval(servicesInterval);
		};
	}, [autoRefresh, autoRefreshLogs]);

	useEffect(() => {
		localStorage.setItem("autoRefreshStatus", autoRefresh.toString());
	}, [autoRefresh]);

	useEffect(() => {
		localStorage.setItem("autoRefreshLogs", autoRefreshLogs.toString());
	}, [autoRefreshLogs]);

	return (
		<div className="p-4 sm:p-6">
			<Typography.Title level={2}>Dashboard</Typography.Title>
			<Typography.Paragraph type="secondary">
				Monitor system status, manage services, and view logs for your FitchFork
				server.
			</Typography.Paragraph>

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
					<Space direction="vertical" size="large" style={{ width: "100%" }}>
						<CommandPanel />

						{services.length === 0 ? (
							<Spin />
						) : (
							<>
								<ServiceCard
									service={services.find((s) => s.name === "fitchfork-api")!}
									onRefresh={loadServices}
								/>
								<ServiceCard
									service={services.find((s) => s.name === "discord-bot")!}
									onRefresh={loadServices}
								/>
							</>
						)}
					</Space>
				</Col>

				<Col span={24}>
					<LogsPanel
						logs={logs}
						onRefresh={loadLogs}
						autoRefresh={autoRefreshLogs}
						setAutoRefresh={setAutoRefreshLogs}
					/>
				</Col>
			</Row>
		</div>
	);
}
