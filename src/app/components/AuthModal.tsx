"use client";

import { useContext, useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import AuthModalInput from "./AuthModalInput";
import { useForm } from "react-hook-form";
import useAuth from "@/hooks/useAuth";
import { AuthenticationContext } from "../context/AuthContext";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";

const style = {
	position: "absolute" as "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: 400,
	bgcolor: "background.paper",
	border: "2px solid #000",
	boxShadow: 24,
	p: 4,
};

export default function AuthModal({ isSignIn }: { isSignIn: boolean }) {
	const [open, setOpen] = useState(false);
	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

	const { data, error, loading } = useContext(AuthenticationContext);

	const { signIn, signUp } = useAuth();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();

	const renderContent = (signInContent: string, signUpContent: string) => {
		return isSignIn ? signInContent : signUpContent;
	};

	const onSubmit = (data: any) => {
		isSignIn ? signIn(data) : signUp(data);
	};

	return (
		<div>
			<button
				className={`${renderContent(
					"bg-blue-400 text-white",
					""
				)} border p-1 px-4 rounded mr-3`}
				onClick={handleOpen}
			>
				{renderContent("Sign In", "Sign Up")}
			</button>
			<Modal
				open={open}
				onClose={handleClose}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				<Box sx={style}>
					{loading ? (
						<div className="py-24 p-2 flex justify-center">
							<CircularProgress />
						</div>
					) : (
						<div className="p-2">
							{error ? (
								<Alert severity="error" className="mb-4 flex justify-center">
									{error}
								</Alert>
							) : null}
							<div className="uppercase font-bold text-center pb-2 border-b mb-2">
								<p className="text-sm">
									{renderContent("Sign in", "Create an account")}
								</p>
							</div>
							<div className="m-auto">
								<h2 className="text-2xl font-light text-center">
									{renderContent("Log Into Your Account", "Create New Account")}
								</h2>
							</div>
							<AuthModalInput
								register={register}
								errors={errors}
								isSignIn={isSignIn}
							/>
							<button
								className="uppercase bg-red-600 w-full text-white p-3 rounded text-sm mb-5 disabled:bg-gray-400"
								onClick={handleSubmit(onSubmit)}
							>
								{/* {loading ? (
								<div className="h-0.5 flex justify-center">
									<CircularProgress />
								</div>
							) : (
								<>{renderContent("Sign In", "Create an account")}</>
							)} */}
								{renderContent("Sign In", "Create an account")}
							</button>
						</div>
					)}
				</Box>
			</Modal>
		</div>
	);
}
