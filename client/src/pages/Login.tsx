import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	Button,
	Card,
	Form,
	Input,
	Typography,
	Alert,
	ConfigProvider,
	theme as antdTheme,
} from "antd";
import Logo from "@/components/Logo";
import { useAuth } from "@/context/AuthContext";
import type { LoginRequest } from "@/services/auth";

const { Title, Text } = Typography;

export default function Login() {
	const { login } = useAuth();
	const navigate = useNavigate();
	const [form] = Form.useForm();
	const [formError, setFormError] = useState<string | null>(null);

	const handleFinish = async (values: LoginRequest) => {
		setFormError(null);
		const res = await login(values);
		if (res.success) {
			navigate("/");
		} else {
			setFormError(res.message);
		}
	};

	return (
		<ConfigProvider theme={{ algorithm: antdTheme.defaultAlgorithm }}>
			<div className="flex flex-col lg:flex-row min-h-screen w-full bg-white text-gray-800">
				{/* Left Panel */}
				<div className="flex w-full lg:w-2/5 items-center justify-center px-4 sm:px-6 md:px-10 py-12">
					<Card className="w-full max-w-md sm:max-w-xl rounded-2xl shadow-none lg:shadow-2xl">
						<div className="flex justify-start mb-6">
							<Logo size="md" showText={false} variant="light" shadow />
						</div>

						<div className="text-center mb-8">
							<Title level={2} className="!mb-2 text-2xl sm:text-3xl">
								Welcome back
							</Title>
							<Text className="block text-sm sm:text-base text-gray-600">
								Log in to access your dashboard
							</Text>
						</div>

						{formError && (
							<Alert
								message={formError}
								type="error"
								showIcon
								closable
								onClose={() => setFormError(null)}
								className="mb-4"
							/>
						)}

						<Form
							layout="vertical"
							form={form}
							onFinish={handleFinish}
							onValuesChange={() => setFormError(null)}
							size="large"
						>
							<Form.Item
								label={<span className="text-sm sm:text-base">Username</span>}
								name="username"
								rules={[
									{ required: true, message: "Please enter your username" },
								]}
							>
								<Input placeholder="admin" />
							</Form.Item>

							<Form.Item
								label={<span className="text-sm sm:text-base">Password</span>}
								name="password"
								rules={[
									{ required: true, message: "Please enter your password" },
								]}
								className="mt-4"
							>
								<Input.Password placeholder="••••••••" />
							</Form.Item>

							<Form.Item className="mt-6">
								<Button type="primary" htmlType="submit" block size="large">
									Sign In
								</Button>
							</Form.Item>
						</Form>
					</Card>
				</div>

				{/* Right Visual Panel */}
				<div className="hidden lg:flex w-3/5 relative items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-700">
					<div className="absolute inset-0 bg-black bg-opacity-30" />
					<div className="relative z-10 px-6 py-10 text-center text-white max-w-xl">
						<Title
							level={2}
							className="!text-white !mb-4 text-2xl xl:!text-3xl leading-snug"
						>
							Automate Code Evaluation with Precision
						</Title>
						<Text className="text-base xl:text-lg text-white opacity-90 leading-relaxed">
							FitchFork helps you monitor services, dispatch grading jobs, and
							analyze logs — all in one place.
						</Text>
					</div>
				</div>
			</div>
		</ConfigProvider>
	);
}
