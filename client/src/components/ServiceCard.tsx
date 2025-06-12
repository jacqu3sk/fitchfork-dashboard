import { Card, Button, Tag, Space, message } from "antd";
import type { Service } from "../types/service";
import { runCommand } from "@/services/commands";

export default function ServiceCard({
	service,
	onRefresh,
}: {
	service: Service;
	onRefresh: () => void;
}) {
	const toggleService = async (action: "start" | "stop" | "restart") => {
		const commandKey = `${action}-${service.name}`;
		try {
			message.loading({
				content: `Running ${commandKey}...`,
				key: service.name,
			});
			await runCommand(commandKey);
			message.success({ content: `Success: ${commandKey}`, key: service.name });
			setTimeout(onRefresh, 2000);
		} catch {
			message.error({ content: `Failed: ${commandKey}`, key: service.name });
		}
	};

	return (
		<Card
			type="inner"
			title={service.name.replace(/(^\w|-\w)/g, (m) => m.toUpperCase())}
			extra={
				<Tag color={service.status === "running" ? "green" : "red"}>
					{service.status}
				</Tag>
			}
		>
			<Space direction="vertical">
				{service.description && (
					<p className="text-xs text-gray-500">{service.description}</p>
				)}
				<Space wrap>
					<Button
						type="primary"
						disabled={service.status === "running"}
						onClick={() => toggleService("start")}
					>
						Start
					</Button>
					<Button
						danger
						disabled={service.status === "stopped"}
						onClick={() => toggleService("stop")}
					>
						Stop
					</Button>
					<Button onClick={() => toggleService("restart")}>Restart</Button>
				</Space>
			</Space>
		</Card>
	);
}
