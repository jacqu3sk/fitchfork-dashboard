// src/pages/Services.tsx
import { useState } from "react";
import { Card, Table, Badge, Button, Typography, Space, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";

const { Title } = Typography;

interface Service {
	key: string;
	name: string;
	status: "running" | "stopped";
}

const initialData: Service[] = [
	{ key: "1", name: "nginx", status: "running" },
	{ key: "2", name: "postgresql", status: "running" },
	{ key: "3", name: "backend-api", status: "stopped" },
	{ key: "4", name: "discord-bot", status: "running" },
];

export default function Services() {
	const [data, setData] = useState<Service[]>(initialData);

	const handleAction = (key: string, action: "start" | "stop" | "restart") => {
		setData((current) =>
			current.map((svc) =>
				svc.key === key
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
	};

	const columns: ColumnsType<Service> = [
		{
			title: "Service Name",
			dataIndex: "name",
			key: "name",
			render: (name) => <Tag>{name}</Tag>,
		},
		{
			title: "Status",
			dataIndex: "status",
			key: "status",
			render: (st) => (
				<Badge
					status={st === "running" ? "success" : "error"}
					text={st === "running" ? "Running" : "Stopped"}
				/>
			),
		},
		{
			title: "Actions",
			key: "actions",
			render: (_, record) => (
				<Space size="middle">
					<Button
						type="primary"
						disabled={record.status === "running"}
						size="small"
						onClick={() => handleAction(record.key, "start")}
					>
						Start
					</Button>
					<Button
						danger
						disabled={record.status === "stopped"}
						size="small"
						onClick={() => handleAction(record.key, "stop")}
					>
						Stop
					</Button>
					<Button
						size="small"
						onClick={() => handleAction(record.key, "restart")}
					>
						Restart
					</Button>
				</Space>
			),
		},
	];

	return (
		<Card>
			<Title level={3}>Service Manager</Title>
			<Table<Service>
				columns={columns}
				dataSource={data}
				pagination={false}
				bordered
				rowKey="key"
			/>
		</Card>
	);
}
