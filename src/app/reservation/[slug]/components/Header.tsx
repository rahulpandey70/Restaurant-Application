import { Time, convertToDisplayTime } from "@/utils/convertToDisplayTime";
import { format } from "date-fns";
import { RestaurantDataType, searchParams } from "../page";

const Header = ({
	searchParams,
	restaurant,
}: {
	searchParams: searchParams;
	restaurant: RestaurantDataType;
}) => {
	const { date, time, partySize } = searchParams;

	return (
		<div>
			<h3 className="font-bold">You're almost done!</h3>
			<div className="mt-5 flex">
				<img src={restaurant.main_image} alt="" className="w-32 h-18 rounded" />
				<div className="ml-4">
					<h1 className="text-3xl font-bold">{restaurant.name}</h1>
					<div className="flex mt-3">
						<p className="mr-6">{format(new Date(date), "ccc LLL d")}</p>
						<p className="mr-6">{convertToDisplayTime(time as Time)}</p>
						<p className="mr-6">{partySize}</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Header;
