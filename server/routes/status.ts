import { Router } from "express";
import { getSystemStatus } from "../utils/systemInfo";

const router = Router();

router.get("/", (_req, res) => {
	res.json(getSystemStatus());
});

export default router;
