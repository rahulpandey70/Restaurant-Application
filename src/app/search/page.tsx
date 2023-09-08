import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Card from "./components/Card";
import { PRICE, PrismaClient } from "@prisma/client";

interface SearchProps {
	searchParams: {
		city?: string;
		region?: string;
		price?: PRICE;
	};
}

interface searchParams {
	city?: string;
	region?: string;
	price?: PRICE;
}

const prisma = new PrismaClient();

const fetchRestaurants = (searchParams: searchParams) => {
	const where: any = {};

	if (searchParams.city) {
		const location = {
			name: {
				equals: searchParams.city.toLocaleLowerCase(),
			},
		};
		where.location = location;
	}

	if (searchParams.region) {
		const region = {
			name: {
				equals: searchParams.region.toLocaleLowerCase(),
			},
		};
		where.region = region;
	}

	if (searchParams.price) {
		const price = {
			equals: searchParams.price,
		};
		where.price = price;
	}

	const select = {
		id: true,
		name: true,
		main_image: true,
		price: true,
		location: true,
		region: true,
		slug: true,
		reviews: true,
	};

	return prisma.restaurant.findMany({
		where,
		select,
	});
};

const fetchLocation = () => {
	return prisma.location.findMany();
};

const fetchRegion = () => {
	return prisma.region.findMany();
};

const Search = async ({ searchParams }: SearchProps) => {
	const restaurants = await fetchRestaurants(searchParams);
	const locations = await fetchLocation();
	const regions = await fetchRegion();

	return (
		<>
			<Header />
			<div className="flex py-4 m-auto w-2/3 justify-between items-start">
				<Sidebar
					locations={locations}
					regions={regions}
					searchParams={searchParams}
				/>
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
