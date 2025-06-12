import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthService } from "@/services/auth";
import type { LoginRequest, LoginResponse } from "@/services/auth";
import type { ApiResponse } from "@/utils/api";

interface AuthContextType {
	isAuthenticated: () => boolean;
	loading: boolean;
	login: (request: LoginRequest) => Promise<ApiResponse<LoginResponse | null>>;
	logout: () => void;
	isExpired: () => boolean;
	user: { username: string } | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [authenticated, setAuthenticated] = useState(false);
	const [user, setUser] = useState<{ username: string } | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const stored = localStorage.getItem("auth");
		if (!stored) {
			setLoading(false);
			return;
		}

		try {
			const { token, expires_at, username } = JSON.parse(stored);
			if (token && expires_at && new Date(expires_at) > new Date()) {
				setAuthenticated(true);
				setUser({ username });
			} else {
				localStorage.removeItem("auth");
			}
		} catch {
			localStorage.removeItem("auth");
		}

		setLoading(false);
	}, []);

	const login = async (
		request: LoginRequest
	): Promise<ApiResponse<LoginResponse | null>> => {
		try {
			const res = await AuthService.login(request);
			if (res.success && res.data) {
				const { token, expiresIn, username } = res.data;

				localStorage.setItem(
					"auth",
					JSON.stringify({
						token,
						expires_at: expiresIn,
						username,
					})
				);

				setAuthenticated(true);
				setUser({ username });
			}
			return res;
		} catch (err: unknown) {
			let message = "Login failed";
			if (err instanceof Error) {
				message = err.message;
			}
			return {
				success: false,
				data: null,
				message,
			};
		}
	};

	const logout = () => {
		localStorage.removeItem("auth");
		setAuthenticated(false);
		setUser(null);
		window.location.href = "/login";
	};

	const isExpired = (): boolean => {
		const stored = localStorage.getItem("auth");
		if (!stored) return true;
		try {
			const { expires_at } = JSON.parse(stored);
			return !expires_at || new Date(expires_at) < new Date();
		} catch {
			return true;
		}
	};

	const isAuthenticated = () => authenticated;

	return (
		<AuthContext.Provider
			value={{
				isAuthenticated,
				loading,
				login,
				logout,
				isExpired,
				user,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = (): AuthContextType => {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error("useAuth must be used within AuthProvider");
	return ctx;
};
