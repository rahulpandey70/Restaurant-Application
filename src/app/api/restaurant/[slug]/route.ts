import { times } from "@/data";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(
	req: NextRequest,
	{ params }: { params: { slug: string } }
) {
	const slug = params.slug;
	const partySize = req.nextUrl.searchParams.get("partySize") as string;
	const bookingTime = req.nextUrl.searchParams.get("time") as string;
	const bookingDate = req.nextUrl.searchParams.get("date") as string;

	if (!partySize || !bookingTime || !bookingDate) {
		return NextResponse.json(
			{ errorMessage: "Invalid data! Please Provide all data." },
			{ status: 400 }
		);
	}

	const searchedTimes = times.find((t) => {
		return t.time == bookingTime;
	})?.searchTimes;

	if (!searchedTimes) {
		return NextResponse.json(
			{ errorMessage: "No date found!" },
			{ status: 400 }
		);
	}

	const bookings = await prisma.booking.findMany({
		where: {
			booking_time: {
				gte: new Date(`${bookingDate}T${searchedTimes[0]}`),
				lte: new Date(
					`${bookingDate}T${searchedTimes[searchedTimes.length - 1]}`
				),
			},
		},
		select: {
			number_of_people: true,
			booking_time: true,
			tables: true,
		},
	});

	const bookingOnTableObj: { [key: string]: { [key: number]: true } } = {};

	bookings.forEach((booking) => {
		bookingOnTableObj[booking.booking_time.toISOString()] =
			booking.tables.reduce((obj, table) => {
				return {
					...obj,
					[table.table_id]: true,
				};
			}, {});
	});

	const restaurant = await prisma.restaurant.findUnique({
		where: {
			slug,
		},
		select: {
			tables: true,
			open_time: true,
			closing_time: true,
		},
	});

	const restaurantTable = restaurant?.tables;

	const tableList = searchedTimes.map((time) => {
		return {
			date: new Date(`${bookingTime}T${time}`),
			time,
			tables: restaurantTable,
		};
	});

	tableList.forEach((t) => {
		t.tables = t.tables?.filter((table) => {
			if (bookingOnTableObj[t.date.toISOString()]) {
				if (bookingOnTableObj[t.date.toISOString()][table.id]) return false;
			}
			return true;
		});
	});

	const availabilities = tableList
		.map((t) => {
			const totalSeats = t.tables?.reduce((sum, table) => {
				return sum + table.seats;
			}, 0);
			return {
				time: t.time,
				available: (totalSeats as number) >= parseInt(partySize),
			};
		})
		.filter((availability) => {
			const afterOpeningTime =
				new Date(`${bookingDate}T${availability.time}`) >=
				new Date(`${bookingDate}T${restaurant?.open_time}`);
			const beforeClosingTime =
				new Date(`${bookingDate}T${availability.time}`) <=
				new Date(`${bookingDate}T${restaurant?.closing_time}`);

			return afterOpeningTime && beforeClosingTime;
		});

	return NextResponse.json(availabilities, { status: 200 });
}
