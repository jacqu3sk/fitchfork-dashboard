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
		<Card title="Commands" style={{ padding: "1rem" }}>
			<Space direction="vertical" style={{ width: "100%" }}>
				<Button.Group>
					<Button
						type="primary"
						icon={<SyncOutlined />}
						loading={loadingCmd === "restart-backend"}
						onClick={() => handle("restart-backend")}
					>
						Restart Backend
					</Button>
					<Button
						icon={<ReloadOutlined />}
						loading={loadingCmd === "pull-latest"}
						onClick={() => handle("pull-latest")}
					>
						Git Pull Latest
					</Button>
					<Button
						danger
						icon={<PoweroffOutlined />}
						loading={loadingCmd === "reboot"}
						onClick={() => handle("reboot")}
					>
						Reboot Server
					</Button>
				</Button.Group>
			</Space>
		</Card>
	);
}
