import { Button, Switch, Space } from "antd";
import { ReloadOutlined } from "@ant-design/icons";

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
		<Space.Compact>
			<Button type="default" icon={<ReloadOutlined />} onClick={onRefresh} />
			<Switch
				size="small"
				checked={autoRefresh}
				onChange={setAutoRefresh}
				checkedChildren="Auto"
				unCheckedChildren="Man"
			/>
		</Space.Compact>
	);
}
