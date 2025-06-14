import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ThemeProvider } from "./context/ThemeContext.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";
import "highlight.js/styles/atom-one-dark.css";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<AuthProvider>
			<ThemeProvider>
				<App />
			</ThemeProvider>
		</AuthProvider>
	</StrictMode>
);
