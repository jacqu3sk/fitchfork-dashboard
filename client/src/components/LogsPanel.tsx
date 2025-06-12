import { Card } from "antd";
import RefreshToggle from "@/components/RefreshToggle"; // adjust path as needed

export default function LogsPanel({
	logs,
	onRefresh,
	autoRefresh,
	setAutoRefresh,
}: {
	logs?: string;
	onRefresh: () => void;
	autoRefresh: boolean;
	setAutoRefresh: (v: boolean) => void;
}) {
	return (
		<Card
			title="Recent Logs"
			extra={
				<RefreshToggle
					onRefresh={onRefresh}
					autoRefresh={autoRefresh}
					setAutoRefresh={setAutoRefresh}
				/>
			}
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
