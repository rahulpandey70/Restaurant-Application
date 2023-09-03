import Card from "./components/Card";
import Header from "./components/Header";

import { Location, PRICE, PrismaClient, Region } from "@prisma/client";

export interface RestaurantCardType {
	id: number;
	name: string;
	main_image: string;
	slug: string;
	price: PRICE;
	location: Location;
	region: Region;
}

const prisma = new PrismaClient();

const fetchRestaurant = async (): Promise<RestaurantCardType[]> => {
	let restaurants = await prisma.restaurant.findMany({
		select: {
			id: true,
			name: true,
			main_image: true,
			price: true,
			slug: true,
			location: true,
			region: true,
		},
	});
	return restaurants;
};

export default async function Home() {
	const restaurants = await fetchRestaurant();

	return (
		<main>
			<Header />
			<div className="py-3 px-36 mt-10 flex flex-wrap justify-center">
				{restaurants.map((restaurant) => (
					<Card restaurant={restaurant} />
				))}
			</div>
		</main>
	);
}
