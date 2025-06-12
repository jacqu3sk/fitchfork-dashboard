import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import Dashboard from "./pages/Dashboard";
import Services from "./pages/Services";
import Login from "./pages/Login";
import { useAuth } from "./context/AuthContext";

export default function App() {
	const { isAuthenticated, isExpired, loading } = useAuth();

	if (loading) return null;

	const needsLogin = !isAuthenticated() || isExpired();

	return (
		<BrowserRouter>
			<Routes>
				{/* Login route */}
				<Route
					path="/login"
					element={needsLogin ? <Login /> : <Navigate to="/" replace />}
				/>

				{/* Protected routes */}
				<Route
					path="/"
					element={
						needsLogin ? <Navigate to="/login" replace /> : <AppLayout />
					}
				>
					{/* Default route when logged in */}
					<Route index element={<Navigate to="/dashboard" replace />} />
					<Route path="dashboard" element={<Dashboard />} />
					<Route path="services" element={<Services />} />
				</Route>

				{/* Catch-all route (optional) */}
				<Route path="*" element={<Navigate to="/" replace />} />
			</Routes>
		</BrowserRouter>
	);
}
