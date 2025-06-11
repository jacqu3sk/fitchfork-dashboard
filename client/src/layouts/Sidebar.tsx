import { Menu, Button } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import {
	DoubleLeftOutlined,
	DoubleRightOutlined,
	DashboardOutlined,
	SettingOutlined,
	FileTextOutlined,
	PoweroffOutlined,
} from "@ant-design/icons";
import Logo from "@/components/Logo";
import { useAuth } from "@/context/AuthContext";

const menuItems = [
	{
		key: "/",
		label: "Dashboard",
		icon: <DashboardOutlined />,
	},
	{
		key: "/services",
		label: "Services",
		icon: <SettingOutlined />,
	},
	{
		key: "/logs",
		label: "Logs",
		icon: <FileTextOutlined />,
	},
];

const bottomItems = [
	{
		key: "logout",
		label: "Logout",
		icon: <PoweroffOutlined />,
	},
];

export default function Sidebar({
	collapsed,
	isMobile,
	setCollapsed,
	closeMobile,
}: {
	collapsed: boolean;
	isMobile: boolean;
	setCollapsed: (value: boolean) => void;
	closeMobile: () => void;
}) {
	const navigate = useNavigate();
	const location = useLocation();
	const { logout } = useAuth();

	return (
		<div className="h-full flex flex-col justify-between">
			<div>
				<div
					className="flex justify-center py-4 cursor-pointer"
					onClick={closeMobile}
				>
					<Logo collapsed={collapsed && !isMobile} />
				</div>

				<Menu
					mode="inline"
					selectedKeys={[location.pathname]}
					items={menuItems}
					onClick={({ key }) => {
						navigate(key);
						if (isMobile) closeMobile();
					}}
					inlineCollapsed={!isMobile && collapsed}
					className="!bg-transparent !border-none px-2"
					style={{ borderRight: "none" }}
				/>
			</div>

			<div className="px-2 pb-4">
				<Menu
					mode="inline"
					selectedKeys={[location.pathname]}
					items={bottomItems}
					onClick={({ key }) => {
						if (key === "logout") logout();
						if (isMobile) closeMobile();
					}}
					className="!bg-transparent !border-none"
					style={{ borderRight: "none" }}
				/>
				{!isMobile && (
					<div className="mt-4 flex justify-center">
						<Button
							type="default"
							icon={
								collapsed ? <DoubleRightOutlined /> : <DoubleLeftOutlined />
							}
							onClick={() => setCollapsed(!collapsed)}
						>
							{collapsed ? "" : "Collapse"}
						</Button>
					</div>
				)}
			</div>
		</div>
	);
}
