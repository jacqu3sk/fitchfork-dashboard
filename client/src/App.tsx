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
				<Route
					path="/login"
					element={needsLogin ? <Login /> : <Navigate to="/" replace />}
				/>

				<Route
					element={
						needsLogin ? <Navigate to="/login" replace /> : <AppLayout />
					}
				>
					<Route path="/dashboard" element={<Dashboard />} />
					<Route path="/services" element={<Services />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
}
