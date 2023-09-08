import Star from "@/app/components/Star";
import { CalculateReviewAvg } from "@/utils/CalculateReviewAvg";
import { Location, PRICE, Region, Review } from "@prisma/client";
import Link from "next/link";

interface CardProps {
	restaurant: {
		location: Location;
		id: number;
		name: string;
		main_image: string;
		slug: string;
		price: PRICE;
		region: Region;
		reviews: Review[];
	};
}

const Card = ({ restaurant }: CardProps) => {
	const renderReview = () => {
		const rating = CalculateReviewAvg(restaurant.reviews);
		if (rating > 4) return "Awesome";
		else if (rating <= 4 && rating > 3) return "Good";
		else if (rating <= 3 && rating > 0) return "Average";
		else return "";
	};

	return (
		<div className="border-b flex pb-5">
			<img src={restaurant.main_image} alt="" className="w-44 rounded" />
			<div className="pl-5">
				<h2 className="text-3xl">{restaurant.name}</h2>
				<div className="flex items-start">
					<Star reviews={restaurant.reviews} />
					<p className="ml-2 text-sm">{renderReview()}</p>
				</div>
				<div className="mb-9">
					<div className="font-light flex text-reg">
						<p className="mr-4">{restaurant.price}</p>
						<p className="mr-4">{restaurant.region.name}</p>
						<p className="mr-4">{restaurant.location.name}</p>
					</div>
				</div>
				<div className="text-red-600">
					<Link href={`/restaurant/${restaurant.slug}`}>
						View more information
					</Link>
				</div>
			</div>
		</div>
	);
};

export default Card;
