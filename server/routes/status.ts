import { Router } from "express";
import { getSystemStatus } from "../utils/systemInfo";

const router = Router();

router.get("/", async (_req, res) => {
	try {
		const status = await getSystemStatus();
		res.json({
			success: true,
			data: status,
			message: "System status retrieved",
		});
	} catch (err: any) {
		res.status(500).json({
			success: false,
			data: null,
			message: err.message || "Failed to get system status",
		});
	}
});

export default router;
