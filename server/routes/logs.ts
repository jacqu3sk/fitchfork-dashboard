import { Router } from "express";
import { exec } from "child_process";

const router = Router();

router.get("/", (_req, res) => {
	exec("tail -n 30 /var/log/syslog", (err, stdout) => {
		if (err) return res.status(500).json({ error: err.message });
		res.json({ logs: stdout });
	});
});

export default router;
