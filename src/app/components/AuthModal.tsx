"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import AuthModalInput from "./AuthModalInput";
import { SubmitHandler, useForm } from "react-hook-form";

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

interface formData {
	firstName: string;
	lastName: string;
	email: string;
	city: string;
	phone: number;
}

export default function AuthModal({ isSignIn }: { isSignIn: boolean }) {
	const [open, setOpen] = useState(false);
	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<formData>();

	const renderContent = (signInContent: string, signUpContent: string) => {
		return isSignIn ? signInContent : signUpContent;
	};

	const onSubmit: SubmitHandler<formData> = (data) => {
		console.log(data);
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
					<div className="p-2">
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
						<AuthModalInput register={register} errors={errors} />
						<button
							className="uppercase bg-red-600 w-full text-white p-3 rounded text-sm mb-5 disabled:bg-gray-400"
							onClick={handleSubmit(onSubmit)}
						>
							{renderContent("Sign In", "Create an account")}
						</button>
					</div>
				</Box>
			</Modal>
		</div>
	);
}
