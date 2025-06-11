import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import Dashboard from "./pages/Dashboard";
import Services from "./pages/Services"; // Import the new page

export default function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route element={<AppLayout />}>
					<Route path="/" element={<Dashboard />} />
					<Route path="/services" element={<Services />} /> {/* New route */}
				</Route>
			</Routes>
		</BrowserRouter>
	);
}
