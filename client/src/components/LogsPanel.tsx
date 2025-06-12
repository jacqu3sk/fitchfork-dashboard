import { Card } from "antd";
import { useEffect, useRef } from "react";
import hljs from "highlight.js/lib/core";
import plaintext from "highlight.js/lib/languages/plaintext";
import "highlight.js/styles/atom-one-dark.css"; // or any other theme
import RefreshToggle from "@/components/RefreshToggle";

hljs.registerLanguage("plaintext", plaintext);

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
	const preRef = useRef<HTMLPreElement>(null);

	useEffect(() => {
		if (preRef.current) {
			hljs.highlightElement(preRef.current);
		}
	}, [logs]);

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
				ref={preRef}
				className="hljs"
				style={{
					backgroundColor: "#1e1e1e",
					color: "#d4d4d4",
					fontFamily: "Consolas, Menlo, monospace",
					padding: "1rem",
					borderRadius: "4px",
					margin: 0,
					overflowX: "auto",
					maxHeight: 400,
					whiteSpace: "pre-wrap",
				}}
			>
				{logs ?? "No logs found."}
			</pre>
		</Card>
	);
}
