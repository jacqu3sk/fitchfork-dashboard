import { Card, Button } from "antd";

export default function LogsPanel({
	logs,
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
				{logs ?? "No logs found."}
			</pre>
		</Card>
	);
}
