import axios from "axios";
import { useContext } from "react";
import { AuthenticationContext } from "@/app/context/AuthContext";
import { deleteCookie } from "cookies-next";

interface signInData {
	email: string;
	password: string;
}

export default function useAuth() {
	const { loading, error, data, setAuth } = useContext(AuthenticationContext);

	const signIn = async (data: signInData) => {
		setAuth({
			loading: true,
			error: null,
			data: null,
		});

		try {
			const response = await axios.post(
				"http://localhost:3000/api/auth/signin",
				{
					email: data.email,
					password: data.password,
				}
			);
			setAuth({
				loading: false,
				error: null,
				data: response.data,
			});
		} catch (error: any) {
			setAuth({
				loading: false,
				error: error.response.data.errorMessage,
				data: null,
			});
		}
	};

	const signUp = async (data: any) => {
		setAuth({
			loading: true,
			error: null,
			data: null,
		});

		try {
			const response = await axios.post(
				"http://localhost:3000/api/auth/signup",
				{
					firstName: data.firstName,
					lastName: data.lastName,
					email: data.email,
					city: data.city,
					phone: data.phone,
					password: data.password,
				}
			);
			setAuth({
				loading: false,
				error: null,
				data: response.data,
			});
		} catch (error: any) {
			setAuth({
				loading: false,
				error: error.response.data.errorMessage,
				data: null,
			});
		}
	};

	const logout = () => {
		deleteCookie("jwt");
		setAuth({
			loading: false,
			error: null,
			data: null,
		});
	};

	return { signIn, signUp, logout };
}
