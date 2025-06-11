import { Router } from "express";
import jwt from "jsonwebtoken";

const router = Router();

const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const JWT_SECRET = process.env.JWT_SECRET;

if (!ADMIN_USERNAME || !ADMIN_PASSWORD || !JWT_SECRET) {
	throw new Error("Missing required environment variables for login");
}

router.post("/", (req, res) => {
	const { username, password } = req.body;

	if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
		const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: "6h" });
		res.json({
			success: true,
			data: { token, expiresIn: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString() },
			message: "Login successful",
		});
	}

	res.status(401).json({
		success: false,
		data: null,
		message: "Invalid credentials",
	});
});

export default router;
