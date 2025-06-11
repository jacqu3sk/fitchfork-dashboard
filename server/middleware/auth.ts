import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Runtime check + TS-safe reassign
if (!process.env.JWT_SECRET) {
	throw new Error("JWT_SECRET not set");
}
const secret: string = process.env.JWT_SECRET;

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
	const authHeader = req.headers.authorization;

	if (!authHeader?.startsWith("Bearer ")) {
		res.status(401).json({ error: "Missing or invalid token" });
		return;
	}

	const token = authHeader.split(" ")[1];

	try {
		const payload = jwt.verify(token, secret);
		(req as any).user = payload; // If you want to type `user`, we can extend Request
		next();
	} catch {
		res.status(401).json({ error: "Invalid or expired token" });
	}
}
