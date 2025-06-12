import { Layout, Drawer } from "antd";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import Sidebar from "./Sidebar";
import HeaderBar from "./HeaderBar";

const { Sider, Header, Content } = Layout;

export default function AppLayout() {
	const [collapsed, setCollapsed] = useState(
		() => localStorage.getItem("sidebarCollapsed") === "true"
	);
	const [mobileSidebarVisible, setMobileSidebarVisible] = useState(false);
	const isMobile = useMediaQuery({ maxWidth: 768 });
	const forceCollapsed = useMediaQuery({ maxWidth: 1024 });

	const handleCollapse = (value: boolean) => {
		setCollapsed(value);
		localStorage.setItem("sidebarCollapsed", value.toString());
	};

	const sidebar = (
		<Sidebar
			collapsed={collapsed}
			isMobile={isMobile}
			setCollapsed={setCollapsed}
			closeMobile={() => setMobileSidebarVisible(false)}
		/>
	);

	return (
		<Layout className="min-h-screen bg-white dark:bg-gray-950">
			{isMobile ? (
				<Drawer
					open={mobileSidebarVisible}
					onClose={() => setMobileSidebarVisible(false)}
					placement="left"
					width={240}
					closable={false}
					className="!p-0"
				>
					{sidebar}
				</Drawer>
			) : (
				<Sider
					width={240}
					collapsedWidth={80}
					collapsed={collapsed}
					onCollapse={handleCollapse}
					collapsible={!forceCollapsed}
					className="!bg-white dark:!bg-gray-950 border-r border-gray-200 dark:border-gray-800"
					trigger={null}
				>
					{sidebar}
				</Sider>
			)}

			<Layout className="flex flex-col w-full h-screen !bg-white dark:!bg-gray-950">
				<Header className="!bg-transparent border-b border-gray-200 dark:border-gray-800 !px-4 sm:px-6">
					<HeaderBar
						isMobile={isMobile}
						onMenuClick={() => setMobileSidebarVisible(true)}
					/>
				</Header>
				<Content className="overflow-auto">
					<div>
						<Outlet />
					</div>
				</Content>
			</Layout>
		</Layout>
	);
}
