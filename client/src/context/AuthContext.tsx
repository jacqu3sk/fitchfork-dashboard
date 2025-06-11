import { createContext, useContext } from "react";

export const AuthContext = createContext({
	user: null,
	isAdmin: false,
	isUser: true,
	logout: () => {},
});

export const useAuth = () => useContext(AuthContext);
