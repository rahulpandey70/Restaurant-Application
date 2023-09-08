import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";

const AuthModalInput = ({
	register,
	errors,
}: {
	register: UseFormRegister<FieldValues>;
	errors: FieldErrors<FieldValues>;
}) => {
	return (
		<div>
			<div className="my-3 flex flex-col gap-3 text-sm w-full">
				<input
					type="text"
					placeholder="First Name"
					className={`border ${
						errors.firstName ? "border-red-500" : ""
					} rounded p-2 py-3`}
					{...register("firstName", { required: true, pattern: /^[a-zA-Z]+$/ })}
				/>
				<input
					type="text"
					placeholder="Last Name"
					className={`border ${
						errors.lastName ? "border-red-500" : ""
					} rounded p-2 py-3`}
					{...register("lastName", { required: true, pattern: /^[a-zA-Z]+$/ })}
				/>
				<input
					type="email"
					placeholder="Email"
					className={`border ${
						errors.email ? "border-red-500" : ""
					} rounded p-2 py-3`}
					{...register("email", { required: true, pattern: /^\S+@\S+$/i })}
				/>
				<input
					type="text"
					placeholder="City"
					className={`border ${
						errors.city ? "border-red-500" : ""
					} rounded p-2 py-3`}
					{...register("city", { required: true, pattern: /^[a-zA-Z]+$/ })}
				/>
				<input
					type="text"
					placeholder="Phone"
					className={`border ${
						errors.phone ? "border-red-500" : ""
					} rounded p-2 py-3`}
					{...register("phone", {
						required: true,
						pattern: /^[0-9+-]+$/,
						maxLength: 10,
						minLength: 10,
					})}
				/>
				<input
					type="password"
					placeholder="Password"
					className="border rounded p-2 py-3"
					{...register("password", {
						required: true,
					})}
				/>
			</div>
		</div>
	);
};

export default AuthModalInput;
