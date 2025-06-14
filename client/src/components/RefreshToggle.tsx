import { ReloadOutlined } from "@ant-design/icons";
import { Button, Switch, Tooltip } from "antd";

export default function RefreshToggle({
	onRefresh,
	autoRefresh,
	setAutoRefresh,
}: {
	onRefresh: () => void;
	autoRefresh: boolean;
	setAutoRefresh: (v: boolean) => void;
}) {
	return (
		<div className="flex items-center gap-2 rounded-md px-2 py-1">
			<Tooltip title="Refresh now">
				<Button
					type="text"
					icon={<ReloadOutlined />}
					onClick={onRefresh}
					className="!text-gray-700 dark:!text-gray-200 !p-1"
				/>
			</Tooltip>

			<div className="flex items-center gap-1">
				<span className="text-xs text-gray-500 dark:text-gray-400">Auto</span>
				<Switch size="small" checked={autoRefresh} onChange={setAutoRefresh} />
			</div>
		</div>
	);
}
