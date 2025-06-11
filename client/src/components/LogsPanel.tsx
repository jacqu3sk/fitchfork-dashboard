import { Card, Button } from "antd";

const sampleLogs = `
[2025-06-11 14:32:01] INFO  Server started on port 8080
[2025-06-11 14:32:02] DEBUG AuthService: verifying token...
[2025-06-11 14:32:02] INFO  AuthService: user 1024 authenticated
[2025-06-11 14:32:03] WARN  Disk space at 90% capacity
[2025-06-11 14:32:04] ERROR Database: failed to connect to replica set
[2025-06-11 14:32:05] INFO  Retry scheduled in 5 seconds
`;

export default function LogsPanel({
	onRefresh,
}: {
	logs?: string;
	onRefresh: () => void;
}) {
	return (
		<Card
			title="Recent Logs"
			extra={<Button onClick={onRefresh}>Refresh</Button>}
		>
			<pre
				style={{
					backgroundColor: "#1e1e1e",
					color: "#d4d4d4",
					fontFamily: "Consolas, Menlo, monospace",
					padding: "1rem",
					borderRadius: "4px",
					margin: 0,
					overflowX: "auto",
					maxHeight: 300,
					whiteSpace: "pre-wrap",
				}}
			>
				{sampleLogs}
			</pre>
		</Card>
	);
}
