"use client";

import {
	Dispatch,
	ReactNode,
	SetStateAction,
	createContext,
	useState,
} from "react";

interface User {
	id: number;
	firstName: string;
	lastName: string;
	email: string;
	city: string;
	phone: string;
}

interface state {
	loading: boolean;
	data: User | null;
	error: string | null;
}

interface AuthState extends state {
	setAuth: Dispatch<SetStateAction<state>>;
}

export const AuthenticationContext = createContext<AuthState>({
	loading: false,
	data: null,
	error: null,
	setAuth: () => {},
});

export default function AuthContext({ children }: { children: ReactNode }) {
	const [auth, setAuth] = useState<state>({
		loading: false,
		data: null,
		error: null,
	});

	return (
		<AuthenticationContext.Provider value={{ ...auth, setAuth }}>
			{children}
		</AuthenticationContext.Provider>
	);
}
