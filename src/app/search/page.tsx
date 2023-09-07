import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Card from "./components/Card";
import { PrismaClient } from "@prisma/client";

interface SearchProps {
	searchParams: {
		city: string;
	};
}

const prisma = new PrismaClient();

const fetchRestaurants = (city: string | undefined) => {
	const select = {
		id: true,
		name: true,
		main_image: true,
		price: true,
		location: true,
		region: true,
		slug: true,
	};

	if (!city) return prisma.restaurant.findMany({ select });

	return prisma.restaurant.findMany({
		where: {
			location: {
				name: {
					equals: city.toLocaleLowerCase(),
				},
			},
		},
		select,
	});
};

const Search = async ({ searchParams }: SearchProps) => {
	const restaurants = await fetchRestaurants(searchParams.city);

	return (
		<>
			<Header />
			<div className="flex py-4 m-auto w-2/3 justify-between items-start">
				<Sidebar />
				<div className="w-5/6">
					{restaurants.length ? (
						restaurants.map((restaurant) => <Card restaurant={restaurant} />)
					) : (
						<p>Sorry, No Restaurant Found At This Location.</p>
					)}
				</div>
			</div>
		</>
	);
};

export default Search;
