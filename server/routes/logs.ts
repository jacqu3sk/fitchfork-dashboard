import { Router } from "express";
import { exec } from "child_process";

const router = Router();

router.get("/", (_req, res) => {
	const services = ["fitchfork.service", "discord-bot.service", "fitchfork-admin-api.service"];
	const tailLines = 100;
	const cmd = `journalctl -u ${services.join(" -u ")} -n ${tailLines} --no-pager --output short-iso`;

	exec(cmd, (err, stdout, stderr) => {
		if (err) {
			return res.status(500).json({
				success: false,
				data: null,
				message: stderr || err.message,
			});
		}

		res.json({
			success: true,
			data: { logs: stdout },
			message: "Logs fetched successfully",
		});
	});
});

export default router;
