import RestaurantNavbar from "../components/RestaurantNavbar";
import RestaurantMenu from "../components/RestaurantMenu";

const Menu = () => {
	return (
		<>
			<div className="bg-white w-[100%] rounded p-3 shadow">
				<RestaurantNavbar />
				<RestaurantMenu />
			</div>
		</>
	);
};

export default Menu;
