import { Router, Request, Response } from "express";
import { exec } from "child_process";

const router = Router();

/**
 * Whitelisted system commands. 
 * These should be validated and safe, with no user input concatenation.
 */
const whitelist: Record<string, string> = {
  "restart-fitchfork": "sudo systemctl restart fitchfork.service",
  "pull-latest": "cd /home/pi/dev/project && git pull",
  "reboot": "sudo /sbin/reboot", // use absolute path for safety
};

router.post("/", (req: Request, res: Response): void => {
  const command = req.body?.command;

  if (typeof command !== "string" || !whitelist[command]) {
    res.status(400).json({ success: false, error: "Invalid or unauthorized command." });
  }

  const shellCommand = whitelist[command];
  console.log(`[RUN] Executing command: ${command} -> ${shellCommand}`);

  exec(shellCommand, (err, stdout, stderr) => {
    if (err) {
      console.error(`[ERROR] Command failed: ${stderr || err.message}`);
      res.status(500).json({ success: false, error: stderr || err.message });
    }

    const result = stdout.trim() || "Command executed successfully.";
    console.log(`[SUCCESS] Command result: ${result}`);
    res.json({ success: true, result });
  });
});

export default router;
