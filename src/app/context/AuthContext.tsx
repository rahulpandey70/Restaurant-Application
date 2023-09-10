"use client";

import axios from "axios";
import { getCookie } from "cookies-next";
import {
	Dispatch,
	ReactNode,
	SetStateAction,
	createContext,
	useEffect,
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

	const fetchUser = async () => {
		setAuth({ data: null, error: null, loading: false });

		try {
			const jwt = getCookie("jwt");

			if (!jwt) {
				setAuth({
					data: null,
					error: null,
					loading: false,
				});
			} else {
				const res = await axios.get("http://localhost:3000/api/auth/token", {
					headers: {
						Authorization: `Bearer ${jwt}`,
					},
				});

				axios.defaults.headers.common["Authorization"] = `Bearer ${jwt}`;

				setAuth({ data: res.data, error: null, loading: false });
			}
		} catch (error: any) {
			setAuth({
				data: null,
				error: error.response.data.errorMessage,
				loading: false,
			});
		}
	};

	useEffect(async () => {
		await fetchUser();
	}, []);

	return (
		<AuthenticationContext.Provider value={{ ...auth, setAuth }}>
			{children}
		</AuthenticationContext.Provider>
	);
}
