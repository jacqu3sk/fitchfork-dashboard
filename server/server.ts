import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import statusRoutes from "./routes/status";
import logsRoutes from "./routes/logs";
import runRoutes from "./routes/run";
import servicesRoutes from "./routes/services";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use("/__admin/status", statusRoutes);
app.use("/__admin/logs", logsRoutes);
app.use("/__admin/run", runRoutes);
app.use("/__admin/services", servicesRoutes);

app.listen(PORT, () => {
	console.log(`Dashboard backend running on port ${PORT}`);
});
