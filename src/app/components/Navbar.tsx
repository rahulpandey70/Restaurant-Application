"use client";

import { useContext } from "react";
import Link from "next/link";
import AuthModal from "./AuthModal";
import { AuthenticationContext } from "../context/AuthContext";
import useAuth from "@/hooks/useAuth";

const Navbar = () => {
	const { data, loading } = useContext(AuthenticationContext);
	const { logout } = useAuth();

	return (
		<nav className="bg-white p-2 flex justify-between">
			<Link href="/" className="font-bold text-gray-700 text-2xl">
				OpenTable
			</Link>
			<div>
				<div className="flex">
					{data ? (
						<button
							className="bg-blue-400 text-white border p-1 px-4 rounded mr-3"
							onClick={logout}
						>
							Logout
						</button>
					) : (
						<>
							<AuthModal isSignIn={true} />
							<AuthModal isSignIn={false} />
						</>
					)}
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
