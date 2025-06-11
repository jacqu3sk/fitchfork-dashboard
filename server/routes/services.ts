import { Router, Request, Response } from "express";
import { exec } from "child_process";

const router = Router();

const allowedServices = ["my-backend.service", "discord-bot.service"];

router.get("/", (_req: Request, res: Response): void => {
  const statusCmd = allowedServices
    .map((name) => `systemctl show -p ActiveState --value ${name}`)
    .join(" && ");

  exec(statusCmd, (err, stdout) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    const lines = stdout.trim().split("\n");
    const statuses = allowedServices.map((name, i) => ({
      name,
      status: lines[i] || "unknown",
    }));

    res.json({ services: statuses });
  });
});

router.post("/:name/:action", (req: Request, res: Response): void => {
  const { name, action } = req.params;

  if (!allowedServices.includes(name)) {
    res.status(400).json({ error: "Invalid service" });
    return;
  }

  const validActions = ["start", "stop", "restart"];
  if (!validActions.includes(action)) {
    res.status(400).json({ error: "Invalid action" });
    return;
  }

  exec(`sudo systemctl ${action} ${name}`, (err, stdout, stderr) => {
    if (err) {
      res.status(500).json({ error: stderr || err.message });
      return;
    }

    res.json({ result: stdout.trim() });
  });
});

export default router;
