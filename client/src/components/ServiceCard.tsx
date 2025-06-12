import { Card, Button, Space, Typography, Badge, Tooltip, message } from "antd";
import {
	PlayCircleOutlined,
	StopOutlined,
	ReloadOutlined,
	SyncOutlined,
} from "@ant-design/icons";
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

	const updateService = async () => {
		try {
			const commandKey = `update-${service.name}`;
			message.loading({ content: `Running ${commandKey}...`, key: commandKey });
			await runCommand(commandKey);
			message.success({ content: `Success: ${commandKey}`, key: commandKey });
			setTimeout(onRefresh, 2000);
		} catch {
			message.error({
				content: `Failed: update-${service.name}`,
				key: `update-${service.name}`,
			});
		}
	};

	const isRunning = service.status === "running";

	return (
		<Card
			type="inner"
			bordered
			className="rounded-xl bg-white"
			title={
				<Space>
					<Typography.Text strong>
						{service.name.replace(/(^\w|-\w)/g, (m) => m.toUpperCase())}
					</Typography.Text>
					<Badge
						status={isRunning ? "success" : "error"}
						text={service.status}
					/>
				</Space>
			}
		>
			<Space direction="vertical" className="w-full" size="small">
				{service.description && (
					<Typography.Text type="secondary" className="text-sm">
						{service.description}
					</Typography.Text>
				)}

				<Space wrap>
					<Tooltip title="Start">
						<Button
							icon={<PlayCircleOutlined />}
							type="primary"
							disabled={isRunning}
							onClick={() => toggleService("start")}
						>
							Start
						</Button>
					</Tooltip>

					<Tooltip title="Stop">
						<Button
							icon={<StopOutlined />}
							type="default"
							danger
							disabled={!isRunning}
							onClick={() => toggleService("stop")}
						>
							Stop
						</Button>
					</Tooltip>

					<Tooltip title="Restart">
						<Button
							icon={<ReloadOutlined />}
							type="default"
							onClick={() => toggleService("restart")}
						>
							Restart
						</Button>
					</Tooltip>
					<Tooltip title="Check for Git Updates & Rebuild">
						<Button
							icon={<SyncOutlined />}
							type="dashed"
							onClick={updateService}
						>
							Update
						</Button>
					</Tooltip>
				</Space>
			</Space>
		</Card>
	);
}
