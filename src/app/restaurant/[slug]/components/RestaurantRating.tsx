import Star from "@/app/components/Star";
import { CalculateReviewAvg } from "@/utils/CalculateReviewAvg";
import { Review } from "@prisma/client";

interface RestaurantRatingType {
	reviews: Review[];
}
const RestaurantRating = ({ reviews }: RestaurantRatingType) => {
	return (
		<div className="flex items-end">
			<div className="ratings mt-2 flex items-center">
				<Star reviews={reviews} />
				<p className="text-reg ml-3">{CalculateReviewAvg(reviews)}</p>
			</div>
			<div>
				<p className="text-reg ml-4">
					{reviews.length} {reviews.length === 1 ? "Review" : "Reviews"}
				</p>
			</div>
		</div>
	);
};

export default RestaurantRating;
