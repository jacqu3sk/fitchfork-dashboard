import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import loginRoute from "./routes/login";
import statusRoutes from "./routes/status";
import logsRoutes from "./routes/logs";
import runRoutes from "./routes/run";
import servicesRoutes from "./routes/services";
import { requireAuth } from "./middleware/auth";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const app = express();
const HOST = process.env.HOST || "127.0.0.1";
const PORT = Number(process.env.PORT) || 4000;

app.use(cors());
app.use(express.json());

// Public route (login)
app.use("/api/auth/login", loginRoute);

// Apply auth to everything else
app.use((req, res, next) => {
	if (req.path.startsWith("/api/auth/login")) {
		return next(); // bypass auth for login
	}
	return requireAuth(req, res, next);
});

// Protected routes
app.use("/api/status", statusRoutes);
app.use("/api/logs", logsRoutes);
app.use("/api/run", runRoutes);
app.use("/api/services", servicesRoutes);

app.listen(PORT, HOST, () => {
	console.log(`Dashboard backend running on http://${HOST}:${PORT}`);
});
