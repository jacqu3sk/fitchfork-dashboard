// routes/logs.ts
import { Router } from "express";
import { exec } from "child_process";

const router = Router();

router.get("/", (req, res) => {
	const services = ["fitchfork.service", "discord-bot.service", "fitchfork-admin-api.service"];
	const tailLines = 100;

	// Join logs from all services
	const cmd = `journalctl -u ${services.join(" -u ")} -n ${tailLines} --no-pager --output short-iso`;

	exec(cmd, (err, stdout, stderr) => {
		if (err) {
			return res.status(500).json({ error: stderr || err.message });
		}
		res.json({ logs: stdout });
	});
});

export default router;
