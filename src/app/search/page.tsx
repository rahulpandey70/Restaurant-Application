import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Card from "./components/Card";

const Search = () => {
	return (
		<>
			<Header />
			<div className="flex py-4 m-auto w-2/3 justify-between items-start">
				<Sidebar />
				<div className="w-5/6">
					<Card />
				</div>
			</div>
		</>
	);
};

export default Search;
