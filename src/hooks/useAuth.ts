import axios from "axios";

interface signInData {
	email: string;
	password: string;
}

export default function useAuth() {
	const signIn = async (data: signInData) => {
		try {
			const response = await axios.post(
				"http://localhost:3000/api/auth/signin",
				{
					email: data.email,
					password: data.password,
				}
			);
			console.log(response.data);
		} catch (error) {
			console.log(error);
		}
	};

	const signUp = (data: any) => {};

	return { signIn, signUp };
}
