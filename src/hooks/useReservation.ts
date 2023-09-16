"use client";

import axios from "axios";
import { Dispatch, SetStateAction, useState } from "react";

export default function useReservation() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const createReservation = async ({
		slug,
		partySize,
		time,
		date,
		firstName,
		lastName,
		phone,
		email,
		occasion,
		request,
		setIsBooked,
	}: {
		slug: string;
		partySize: string;
		time: string;
		date: string;
		firstName: string;
		lastName: string;
		phone: string;
		email: string;
		occasion: string;
		request: string;
		setIsBooked: Dispatch<SetStateAction<boolean>>;
	}) => {
		setLoading(true);

		try {
			const response = await axios.post(
				`http://localhost:3000/api/restaurant/${slug}/reserve`,
				{
					firstName,
					lastName,
					phone,
					email,
					occasion,
					request,
				},
				{
					params: {
						partySize,
						date,
						time,
					},
				}
			);
			setLoading(false);
			setIsBooked(true);
			return response.data;
		} catch (error: any) {
			setLoading(false);
			setError(error.response.data.errorMessage);
		}
	};

	return { loading, error, createReservation };
}
