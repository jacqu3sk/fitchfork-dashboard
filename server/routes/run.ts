import { Router, Request, Response } from "express";
import { exec } from "child_process";

const router = Router();

// Define all supported commands in one place
const whitelist: Record<string, string> = {
  "restart-backend": "sudo systemctl restart my-backend.service",
  "pull-latest": "cd /home/pi/dev/project && git pull",
  "reboot": "sudo reboot", // added reboot support
};

router.post("/", (req: Request, res: Response): void => {
  const command = req.body?.command;

  if (typeof command !== "string" || !whitelist[command]) {
    res.status(400).json({ error: "Invalid command" });
    return;
  }

  exec(whitelist[command], (err, stdout, stderr) => {
    if (err) {
      res.status(500).json({ error: stderr || err.message });
      return;
    }
    res.json({ result: stdout.trim() || "Command executed successfully." });
  });
});

export default router;
