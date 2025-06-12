import { Router, Request, Response } from "express";
import { exec } from "child_process";

const router = Router();

router.get("/status/:service", (req: Request, res: Response): void => {
	const name = req.params.service;

	if (!/^[a-zA-Z0-9_.@-]+\.service$/.test(name)) {
		res.status(400).json({
			success: false,
			message: "Invalid service name.",
			data: null,
		});
	}

	const command = `systemctl show ${name} --no-page`;

	exec(command, (err, stdout, stderr) => {
		if (err) {
			res.status(500).json({
				success: false,
				message: `Failed to fetch service status: ${stderr || err.message}`,
				data: null,
			});
		}

		// Parse key=value pairs into an object
		const lines = stdout.trim().split("\n");
		const status: Record<string, string> = {};
		lines.forEach(line => {
			const [key, ...rest] = line.split("=");
			status[key] = rest.join("=");
		});

		const summary = {
			ActiveState: status.ActiveState,
			SubState: status.SubState,
			ExecMainStatus: status.ExecMainStatus,
			ExecMainPID: status.ExecMainPID,
			RestartCount: status.NRestart,
			Description: status.Description,
		};

		return res.json({
			success: true,
			message: "Service status fetched.",
			data: summary,
		});
	});
});

export default router;
