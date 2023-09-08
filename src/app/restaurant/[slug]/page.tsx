import RestaurantNavbar from "./components/RestaurantNavbar";
import RestaurantTitle from "./components/RestaurantTitle";
import RestaurantRating from "./components/RestaurantRating";
import RestaurantDescription from "./components/RestaurantDescription";
import RestaurantImages from "./components/RestaurantImages";
import RestaurantReviews from "./components/RestaurantReviews";
import ReservationCard from "./components/ReservationCard";
import { PrismaClient, Review } from "@prisma/client";
import { notFound } from "next/navigation";

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
	reviews: Review[];
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
			reviews: true,
		},
	});

	if (!restaurant) {
		notFound();
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
				<RestaurantRating reviews={restaurant.reviews} />
				<RestaurantDescription description={restaurant.description} />
				<RestaurantImages images={restaurant.images} />
				<RestaurantReviews reviews={restaurant.reviews} />
			</div>
			<ReservationCard />
		</>
	);
};

export default Restaurant;
