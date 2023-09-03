import RestaurantNavbar from "./components/RestaurantNavbar";
import RestaurantTitle from "./components/RestaurantTitle";
import RestaurantRating from "./components/RestaurantRating";
import RestaurantDescription from "./components/RestaurantDescription";
import RestaurantImages from "./components/RestaurantImages";
import RestaurantReviews from "./components/RestaurantReviews";
import ReservationCard from "./components/ReservationCard";

const Restaurant = () => {
	return (
		<>
			<div className="bg-white w-[70%] rounded p-3 shadow">
				<RestaurantNavbar />
				<RestaurantTitle />
				<RestaurantRating />
				<RestaurantDescription />
				<RestaurantImages />
				<RestaurantReviews />
			</div>
			<ReservationCard />
		</>
	);
};

export default Restaurant;
