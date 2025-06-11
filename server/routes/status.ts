import { Router } from "express";
import { getSystemStatus } from "../utils/systemInfo";

const router = Router();

router.get("/", async (_req, res) => {
	const status = await getSystemStatus();
	res.json(status);
});

export default router;
