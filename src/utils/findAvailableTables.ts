import { times } from "@/data";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const findAvailableTables = async ({
	bookingTime,
	bookingDate,
	restaurant,
}: {
	bookingTime: string;
	bookingDate: string;
	restaurant: {
		tables: {
			id: number;
			seats: number;
			restaurant_id: number;
		}[];
		open_time: string;
		closing_time: string;
	};
}) => {
	const searchedTimes = times.find((t) => {
		return t.time == bookingTime;
	})?.searchTimes;

	if (!searchedTimes) {
		return null;
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

	return tableList;
};
