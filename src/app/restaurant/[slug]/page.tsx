import Navbar from "@/app/components/Navbar";
import Header from "./components/Header";
import RestaurantNavbar from "./components/RestaurantNavbar";
import RestaurantTitle from "./components/RestaurantTitle";
import RestaurantRating from "./components/RestaurantRating";
import RestaurantDescription from "./components/RestaurantDescription";
import RestaurantImages from "./components/RestaurantImages";
import RestaurantReviews from "./components/RestaurantReviews";
import ReservationCard from "./components/ReservationCard";

const Restaurant = () => {
	return (
		<main className="bg-gray-100 min-h-screen w-screen">
			<main className="max-w-screen-2xl m-auto bg-white">
				<Navbar />
				<Header />
				<div className="flex m-auto w-2/3 justify-between items-start 0 -mt-11">
					<div className="bg-white w-[70%] rounded p-3 shadow">
						<RestaurantNavbar />
						<RestaurantTitle />
						<RestaurantRating />
						<RestaurantDescription />
						<RestaurantImages />
						<RestaurantReviews />
					</div>
					<ReservationCard />
				</div>
			</main>
		</main>
	);
};

export default Restaurant;
