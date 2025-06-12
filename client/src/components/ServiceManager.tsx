import { Card, Row, Col, Button, Tag, Space, message, Spin } from "antd";
import type { Service } from "../types/service";
import { runCommand } from "@/services/commands";

export default function ServiceManager({
	services,
	onRefresh,
}: {
	services: Service[];
	onRefresh: () => void;
}) {
	const toggleService = async (
		name: string,
		action: "start" | "stop" | "restart"
	) => {
		const commandKey = `${action}-${name}`;
		try {
			message.loading({ content: `Running ${commandKey}...`, key: name });
			await runCommand(commandKey);
			message.success({ content: `Success: ${commandKey}`, key: name });
			setTimeout(onRefresh, 2000);
		} catch {
			message.error({ content: `Failed: ${commandKey}`, key: name });
		}
	};

	if (services.length === 0) {
		return <Spin />;
	}

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
		</Card>
	);
}
