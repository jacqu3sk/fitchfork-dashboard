import { Router, Request, Response } from "express";
import { exec } from "child_process";

const router = Router();

/**
 * Whitelisted system commands.
 * These should be validated and safe, with no user input concatenation.
 */
const whitelist: Record<string, string> = {
  "restart-fitchfork-api": "sudo /usr/bin/systemctl restart fitchfork.service",
  "stop-fitchfork-api": "sudo /usr/bin/systemctl stop fitchfork.service",
  "start-fitchfork-api": "sudo /usr/bin/systemctl start fitchfork.service",
  "update-fitchfork": "/home/owca/scripts/auto-update.sh",
  "restart-discord-bot": "sudo /usr/bin/systemctl restart discord-bot.service",
  "stop-discord-bot": "sudo /usr/bin/systemctl stop discord-bot.service",
  "start-discord-bot": "sudo /usr/bin/systemctl start discord-bot.service",
  "update-discord": "/home/owca/scripts/update-discord.sh",
  "reboot": "sudo /sbin/reboot",
};

router.post("/", (req: Request, res: Response): void => {
  const command = req.body?.command;

  if (typeof command !== "string" || !whitelist[command]) {
    res.status(400).json({
      success: false,
      message: "Invalid or unauthorized command.",
      data: null,
    });
  }


  const shellCommand = whitelist[command];
  console.log(`[RUN] Executing command: ${command} -> ${shellCommand}`);

  exec(shellCommand, (err, stdout, stderr) => {
    if (err) {
      console.error(`[ERROR] Command failed: ${stderr || err.message}`);
      return res.status(500).json({
        success: false,
        message: stderr || err.message,
        data: null,
      });
    }

    const result = stdout.trim() || "Command executed successfully.";
    console.log(`[SUCCESS] Command result: ${result}`);
    return res.json({
      success: true,
      message: "Command executed successfully.",
      data: result,
    });
  });
});

export default router;
