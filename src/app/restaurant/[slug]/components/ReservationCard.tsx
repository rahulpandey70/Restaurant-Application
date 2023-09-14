"use client";

import { partySize, times } from "@/data";
import useAvailabilities from "@/hooks/useAvailabilities";
import { convertToDisplayTime } from "@/utils/convertToDisplayTime";
import { CircularProgress } from "@mui/material";
import { useRef, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const ReservationCard = ({
	openTime,
	closeTime,
	slug,
}: {
	openTime: string;
	closeTime: string;
	slug: string;
}) => {
	const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
	const [date, setDate] = useState<string>(
		new Date().toISOString().split("T")[0]
	);
	const { loading, data, error, fetchRestaurant } = useAvailabilities();

	const partySizeRef = useRef<HTMLSelectElement>(null);
	const timeRef = useRef<HTMLSelectElement>(null);

	const handleDate = (date: Date | null) => {
		if (date) {
			setDate(date.toISOString().split("T")[0]);
			return setSelectedDate(date);
		}
		return setSelectedDate(null);
	};

	const handleSubmit = () => {
		fetchRestaurant({
			slug,
			partySize: String(partySizeRef.current?.value),
			date,
			time: String(timeRef.current?.value),
		});
	};

	const filterTime = () => {
		const timeRange: typeof times = [];
		let flag = false;

		times.forEach((time) => {
			if (time.time === openTime) {
				flag = true;
			}
			if (flag) {
				timeRange.push(time);
			}
			if (time.time === closeTime) {
				flag = false;
			}
		});
		return timeRange;
	};

	return (
		<div className="w-[27%] relative text-reg">
			<div className="bg-white rounded p-3 shadow">
				<div className="text-center border-b pb-2 font-bold">
					<h4 className="mr-7 text-lg">Make a Reservation</h4>
				</div>
				<div className="my-3 flex flex-col">
					<label htmlFor="">Party size</label>
					<select
						name=""
						className="py-3 border-b font-light"
						id=""
						ref={partySizeRef}
					>
						{partySize.map((party) => (
							<option value={party.value} key={party.value}>
								{party.label}
							</option>
						))}
					</select>
				</div>
				<div className="flex justify-between">
					<div className="flex flex-col w-[48%]">
						<label htmlFor="">Date</label>
						<DatePicker
							selected={selectedDate}
							onChange={handleDate}
							className="py-3 w-28 border-b font-light text-reg"
							dateFormat="MMMM d"
						/>
					</div>
					<div className="flex flex-col w-[48%]">
						<label htmlFor="">Time</label>
						<select
							name=""
							id=""
							className="py-3 border-b font-light"
							ref={timeRef}
						>
							{filterTime().map((time) => (
								<option value={time.time} key={time.time}>
									{time.displayTime}
								</option>
							))}
						</select>
					</div>
				</div>
				<div className="mt-5">
					<button
						className="bg-red-600 rounded w-full px-4 text-white font-bold h-16 disabled:bg-gray-600"
						onClick={handleSubmit}
						disabled={loading}
					>
						{loading ? <CircularProgress color="inherit" /> : "Find a Time"}
					</button>
				</div>
				{data && data.length ? (
					<div className="mt-4">
						<p className="text-reg">Select a time</p>
						<div className="flex flex-wrap mt-2">
							{data.map((time) => {
								return time.available ? (
									<div className="bg-red-600 cursor-pointer p-2 w-24 text-center text-white mb-3 mr-3 rounded">
										{convertToDisplayTime(time.time)}
									</div>
								) : (
									<div className="bg-gray-300 p-2 w-24 mb-3 mr-3 rounded"></div>
								);
							})}
						</div>
					</div>
				) : null}
			</div>
		</div>
	);
};

export default ReservationCard;
