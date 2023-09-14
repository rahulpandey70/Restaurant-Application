import { times } from "@/data";
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

	const availableTables = tableList.find((time) => {
		return (
			time.date.toISOString() ===
			new Date(`${bookingDate}T${bookingTime}`).toISOString()
		);
	});

	if (availableTables) {
		return NextResponse.json(
			{
				errorMessage: "No table available.",
			},
			{ status: 400 }
		);
	}

	return NextResponse.json({ tableList, availableTables }, { status: 200 });
}
