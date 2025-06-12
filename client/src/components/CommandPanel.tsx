// src/components/CommandPanel.tsx

import { Card, Button, Space } from "antd";
import { PoweroffOutlined } from "@ant-design/icons";
import React from "react";
import { runCommand } from "@/services/commands";

export default function CommandPanel() {
	const [loadingCmd, setLoadingCmd] = React.useState<string | null>(null);

	const handle = async (cmd: string) => {
		setLoadingCmd(cmd);
		try {
			const result = await runCommand(cmd);
			console.log(result); // You can show a toast here
		} catch (e) {
			console.error(e);
		} finally {
			setLoadingCmd(null);
		}
	};

	return (
		<Card
			title="Server Commands"
			className="dark:bg-gray-950 dark:border-gray-800"
		>
			<Space direction="vertical" size="middle" className="w-full">
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
