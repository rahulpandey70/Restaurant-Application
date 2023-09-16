import { findAvailableTables } from "@/utils/findAvailableTables";
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

	const restaurant = await prisma.restaurant.findUnique({
		where: {
			slug,
		},
		select: {
			tables: true,
			open_time: true,
			close_time: true,
		},
	});

	if (!restaurant) {
		return NextResponse.json(
			{ errorMessage: "No restaurant found" },
			{ status: 400 }
		);
	}

	const tableList = await findAvailableTables({
		bookingDate,
		bookingTime,
		restaurant,
	});

	if (!tableList) {
		return NextResponse.json(
			{ errorMessage: "No available table found." },
			{ status: 400 }
		);
	}

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
				new Date(`${bookingDate}T${restaurant?.close_time}`);

			return afterOpeningTime && beforeClosingTime;
		});

	return NextResponse.json(availabilities, { status: 200 });
}
