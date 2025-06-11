import { Avatar, Button, Dropdown, Typography, Breadcrumb } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { useBreadcrumbs } from "@/hooks/useBreadcrumbs";

const { Text } = Typography;

export default function HeaderBar({
	isMobile,
	onMenuClick,
}: {
	isMobile: boolean;
	onMenuClick: () => void;
}) {
	const navigate = useNavigate();
	const { logout } = useAuth();
	const { toggleDarkMode } = useTheme();
	const breadcrumbs = useBreadcrumbs();

	const items = [
		{
			key: "profile",
			label: "Profile",
			onClick: () => navigate("/profile"),
		},
		{
			key: "theme",
			label: "Toggle Theme",
			onClick: toggleDarkMode,
		},
		{
			key: "logout",
			label: "Logout",
			onClick: () => {
				logout();
				navigate("/login");
			},
		},
	];

	return (
		<div className="flex items-center justify-between w-full h-full">
			{isMobile ? (
				<>
					<Dropdown menu={{ items }} trigger={["click"]}>
						<div className="flex items-center gap-2 cursor-pointer h-full">
							<Avatar size="large" src="/profile.jpeg" />
							<Text className="text-gray-700 dark:text-gray-200 font-medium">
								{"User"}
							</Text>
						</div>
					</Dropdown>
					<Button
						type="text"
						icon={<MenuOutlined />}
						onClick={onMenuClick}
						className="text-gray-700 dark:text-gray-200"
					/>
				</>
			) : (
				<>
					<Breadcrumb
						className="flex-1"
						separator=">"
						items={breadcrumbs.map(({ path, label, isLast }) => ({
							title: isLast ? (
								label
							) : (
								<a onClick={() => navigate(path)}>{label}</a>
							),
						}))}
					/>
					<Dropdown menu={{ items }} trigger={["click"]}>
						<div className="flex items-center gap-2 cursor-pointer h-full">
							<Avatar size="large" src="/profile.jpeg" />
							<Text className="text-gray-700 dark:text-gray-200 font-medium">
								{"User"}
							</Text>
						</div>
					</Dropdown>
				</>
			)}
		</div>
	);
}
