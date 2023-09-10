import Image from "next/image";
import fullStar from "../../../public/icons/full-star.png";
import halfStar from "../../../public/icons/half-star.png";
import emptyStar from "../../../public/icons/empty-star.png";
import { Review } from "@prisma/client";
import { CalculateReviewAvg } from "@/utils/CalculateReviewAvg";

interface StarProps {
	reviews: Review[];
}

const Star = ({ reviews }: StarProps) => {
	const rating = CalculateReviewAvg(reviews);

	const renderStar = () => {
		const stars = [];

		for (let i = 0; i < 5; i++) {
			const diff = parseFloat((rating - i).toFixed(1));
			if (diff >= 1) stars.push(fullStar);
			else if (diff < 1 && diff > 0) {
				if (diff <= 0.2) stars.push(emptyStar);
				else if (diff > 0.2 && diff <= 0.6) stars.push(halfStar);
			} else stars.push(emptyStar);
		}

		return stars.map((star, idx) => (
			<Image src={star} alt="" key={idx} className="w-4 h-4 mr-1" />
		));
	};

	return <div className="flex">{renderStar()}</div>;
};

export default Star;
