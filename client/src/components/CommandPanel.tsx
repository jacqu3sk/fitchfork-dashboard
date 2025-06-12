import { Card, Button, Space } from "antd";
import {
	ReloadOutlined,
	SyncOutlined,
	PoweroffOutlined,
} from "@ant-design/icons";
import React from "react";

interface CommandPanelProps {
	onRunCommand: (cmd: string) => Promise<void>;
}

export default function CommandPanel({ onRunCommand }: CommandPanelProps) {
	const [loadingCmd, setLoadingCmd] = React.useState<string | null>(null);

	const handle = async (cmd: string) => {
		setLoadingCmd(cmd);
		try {
			await onRunCommand(cmd);
		} finally {
			setLoadingCmd(null);
		}
	};

	return (
		<Card
			title="Server Commands"
			className="shadow-sm dark:bg-gray-950 dark:border-gray-800"
		>
			<Space direction="vertical" size="middle" className="w-full">
				<Button
					block
					type="primary"
					icon={<SyncOutlined />}
					loading={loadingCmd === "restart-backend"}
					onClick={() => handle("restart-backend")}
					className="font-semibold"
				>
					Restart Backend
				</Button>

				<Button
					block
					type="default"
					icon={<ReloadOutlined />}
					loading={loadingCmd === "pull-latest"}
					onClick={() => handle("pull-latest")}
					className="font-medium"
				>
					Git Pull Latest
				</Button>

				<Button
					block
					danger
					type="primary"
					icon={<PoweroffOutlined />}
					loading={loadingCmd === "reboot"}
					onClick={() => handle("reboot")}
					className="font-medium"
				>
					Reboot Server
				</Button>
			</Space>
		</Card>
	);
}
