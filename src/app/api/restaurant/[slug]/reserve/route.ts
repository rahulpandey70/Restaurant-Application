import { findAvailableTables } from "@/utils/findAvailableTables";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

interface BookingData {
	bookerEmail: string;
	bookerPhone: string;
	bookerFirstName: string;
	bookerLastName: string;
	bookerOccasion: string;
	bookerRequest: string;
}

export async function POST(
	req: NextRequest,
	{ params }: { params: { slug: string } }
) {
	const slug = params.slug;
	const partySize = req.nextUrl.searchParams.get("partySize") as string;
	const bookingTime = req.nextUrl.searchParams.get("time") as string;
	const bookingDate = req.nextUrl.searchParams.get("date") as string;

	const {
		bookerEmail,
		bookerFirstName,
		bookerLastName,
		bookerOccasion,
		bookerPhone,
		bookerRequest,
	}: BookingData = await req.json();

	const restaurant = await prisma.restaurant.findUnique({
		where: {
			slug,
		},
		select: {
			id: true,
			tables: true,
			open_time: true,
			closing_time: true,
		},
	});

	if (!restaurant) {
		return NextResponse.json(
			{
				errorMessage: "No restaurant found",
			},
			{ status: 400 }
		);
	}

	if (
		new Date(`${bookingDate}T${bookingTime}`) <
			new Date(`${bookingDate}T${restaurant.open_time}`) ||
		new Date(`${bookingDate}T${bookingTime}`) >
			new Date(`${bookingDate}T${restaurant.closing_time}`)
	) {
		return NextResponse.json(
			{
				errorMessage: "Restaurant is not available at this time.",
			},
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

	const availableTables = tableList?.find((t) => {
		return (
			t.date.toISOString() ===
			new Date(`${bookingDate}T${bookingTime}`).toISOString()
		);
	});

	if (!availableTables) {
		return NextResponse.json(
			{
				errorMessage: "No table available.",
			},
			{ status: 400 }
		);
	}

	const tableCount: { 2: number[]; 4: number[] } = { 2: [], 4: [] };

	availableTables.tables.forEach((table) => {
		if (table.seats === 2) {
			tableCount[2].push(table.id);
		} else {
			tableCount[4].push(table.id);
		}
	});

	const tablesToBook: number[] = [];
	let seatRemaining = parseInt(partySize);

	while (seatRemaining > 0) {
		if (seatRemaining >= 3) {
			if (tableCount[4].length) {
				tablesToBook.push(tableCount[4][0]);
				tableCount[4].shift();
				seatRemaining = seatRemaining - 4;
			} else {
				tablesToBook.push(tableCount[2][0]);
				tableCount[2].shift();
				seatRemaining = seatRemaining - 2;
			}
		} else {
			if (tableCount[2].length) {
				tablesToBook.push(tableCount[2][0]);
				tableCount[2].shift();
				seatRemaining = seatRemaining - 2;
			} else {
				tablesToBook.push(tableCount[4][0]);
				tableCount[4].shift();
				seatRemaining = seatRemaining - 4;
			}
		}
	}

	const booking = await prisma.booking.create({
		data: {
			number_of_people: parseInt(partySize),
			booking_email: bookerEmail,
			booker_firstname: bookerFirstName,
			booker_lastname: bookerLastName,
			booker_occasion: bookerOccasion,
			booker_request: bookerRequest,
			booking_phone: bookerPhone,
			booking_time: new Date(`${bookingDate}T${bookingTime}`),
			restaurant_id: restaurant.id,
		},
	});

	const bookingsOnTableData = tablesToBook.map((table_id) => {
		return {
			table_id,
			booking_id: booking.id,
		};
	});

	await prisma.bookingOnTable.createMany({
		data: bookingsOnTableData,
	});

	return NextResponse.json({ tableCount, tablesToBook }, { status: 200 });
}
