import { useEffect, useState, useCallback } from "react";
import { Card, Row, Col, Button, Tag, Space, message, Spin } from "antd";
import type { Service } from "../types/service";
import { getServiceStatus } from "@/services/services";
import { runCommand } from "@/services/commands";

const SERVICES = [
	{ name: "fitchfork-api", systemd: "fitchfork.service" },
	{ name: "discord-bot", systemd: "discord-bot.service" },
];

export default function ServiceManager() {
	const [services, setServices] = useState<Service[]>([]);
	const [loading, setLoading] = useState(true);

	const loadStatuses = async () => {
		setLoading(true);
		const updated: Service[] = [];

		for (const svc of SERVICES) {
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
		setLoading(false);
	};

	useEffect(() => {
		loadStatuses(); // initial fetch
		const interval = setInterval(() => {
			loadStatuses(); // periodic fetch
		}, 1000);
		return () => clearInterval(interval); // cleanup
	}, []);

	const toggleService = useCallback(
		async (name: string, action: "start" | "stop" | "restart") => {
			const commandKey = `${action}-${name}`;
			try {
				message.loading({ content: `Running ${commandKey}...`, key: name });
				await runCommand(commandKey);
				message.success({ content: `Success: ${commandKey}`, key: name });
				setTimeout(loadStatuses, 2000); // wait a bit before re-fetch
			} catch {
				message.error({ content: `Failed: ${commandKey}`, key: name });
			}
		},
		[]
	);

	return (
		<Card title="Service Manager">
			{loading ? (
				<Spin />
			) : (
				<Row gutter={[16, 16]}>
					{services.map((svc) => (
						<Col key={svc.name} xs={24} md={12} lg={8}>
							<Card
								type="inner"
								title={svc.name.replace(/(^\w|-\w)/g, (m) => m.toUpperCase())}
								extra={
									<Tag color={svc.status === "running" ? "green" : "red"}>
										{svc.status}
									</Tag>
								}
							>
								<Space direction="vertical">
									{svc.description && (
										<p className="text-xs text-gray-500">{svc.description}</p>
									)}
									<Space wrap>
										<Button
											type="primary"
											disabled={svc.status === "running"}
											onClick={() => toggleService(svc.name, "start")}
										>
											Start
										</Button>
										<Button
											danger
											disabled={svc.status === "stopped"}
											onClick={() => toggleService(svc.name, "stop")}
										>
											Stop
										</Button>
										<Button onClick={() => toggleService(svc.name, "restart")}>
											Restart
										</Button>
									</Space>
								</Space>
							</Card>
						</Col>
					))}
				</Row>
			)}
		</Card>
	);
}
