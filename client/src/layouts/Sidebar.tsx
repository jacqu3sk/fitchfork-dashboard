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
		key: "/dashboard",
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
	forceCollapsed = false, // optional fallback
}: {
	collapsed: boolean;
	isMobile: boolean;
	setCollapsed: (value: boolean) => void;
	closeMobile: () => void;
	forceCollapsed?: boolean;
}) {
	const navigate = useNavigate();
	const location = useLocation();
	const { logout } = useAuth();

	const handleClick = (key: string) => {
		if (key === "logout") {
			logout();
			navigate("/login");
		} else {
			navigate(key);
		}
		if (isMobile) closeMobile();
	};

	return (
		<div className="bg-white dark:bg-gray-950 h-full flex flex-col justify-between">
			<div>
				<div
					className="py-4 mb-4 flex items-center justify-center cursor-pointer"
					onClick={closeMobile}
				>
					<Logo collapsed={collapsed && !isMobile} />
				</div>

				<div className="px-2">
					<Menu
						mode="inline"
						theme="light"
						selectedKeys={[location.pathname]}
						items={menuItems}
						onClick={({ key }) => handleClick(key)}
						inlineCollapsed={!isMobile && collapsed}
						className="!bg-transparent !p-0 mt-2"
						style={{ border: "none" }}
					/>
				</div>
			</div>

			<div className="px-2 pb-4">
				<Menu
					mode="inline"
					theme="light"
					selectedKeys={[location.pathname]}
					items={bottomItems}
					onClick={({ key }) => handleClick(key)}
					className="!bg-transparent"
					style={{ border: "none" }}
				/>

				{!isMobile && !forceCollapsed && (
					<div className="px-1 mt-3">
						<Button
							block
							type="default"
							onClick={() => setCollapsed(!collapsed)}
							icon={
								collapsed ? <DoubleRightOutlined /> : <DoubleLeftOutlined />
							}
						>
							{collapsed ? "" : "Collapse"}
						</Button>
					</div>
				)}
			</div>
		</div>
	);
}
