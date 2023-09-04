import RestaurantNavbar from "./components/RestaurantNavbar";
import RestaurantTitle from "./components/RestaurantTitle";
import RestaurantRating from "./components/RestaurantRating";
import RestaurantDescription from "./components/RestaurantDescription";
import RestaurantImages from "./components/RestaurantImages";
import RestaurantReviews from "./components/RestaurantReviews";
import ReservationCard from "./components/ReservationCard";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface Props {
	params: {
		slug: string;
	};
}

interface RestaurantDataType {
	id: number;
	name: string;
	images: string[];
	description: string;
	slug: string;
}

const fetchRestaurant = async (slug: string): Promise<RestaurantDataType> => {
	const restaurant = await prisma.restaurant.findUnique({
		where: {
			slug,
		},
		select: {
			id: true,
			name: true,
			description: true,
			images: true,
			slug: true,
		},
	});

	if (!restaurant) {
		throw new Error();
	}

	return restaurant;
};

const Restaurant = async ({ params }: Props) => {
	const restaurant = await fetchRestaurant(params.slug);

	return (
		<>
			<div className="bg-white w-[70%] rounded p-3 shadow">
				<RestaurantNavbar slug={restaurant.slug} />
				<RestaurantTitle title={restaurant.name} />
				<RestaurantRating />
				<RestaurantDescription description={restaurant.description} />
				<RestaurantImages images={restaurant.images} />
				<RestaurantReviews />
			</div>
			<ReservationCard />
		</>
	);
};

export default Restaurant;
