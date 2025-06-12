import { useState, useCallback } from "react";
import { Card, Row, Col, Button, Tag, Space, message } from "antd";
import type { Service } from "../types/service";

const MOCK_SERVICES: Service[] = [
	{ name: "nginx", status: "running" },
	{ name: "postgresql", status: "running" },
	{ name: "fitchfork-api", status: "stopped" },
	{ name: "discord-bot", status: "running" },
];

export default function ServiceManager() {
	const [services, setServices] = useState<Service[]>(MOCK_SERVICES);

	const toggleService = useCallback(
		(name: string, action: "start" | "stop" | "restart") => {
			setServices((prev) =>
				prev.map((svc) =>
					svc.name === name
						? {
								...svc,
								status:
									action === "start"
										? "running"
										: action === "stop"
										? "stopped"
										: svc.status,
						  }
						: svc
				)
			);
			message.success(`${action.toUpperCase()}ED ${name}`);
		},
		[]
	);

	return (
		<Card title="Service Manager">
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
						</Card>
					</Col>
				))}
			</Row>
		</Card>
	);
}
