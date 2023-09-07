import Search from "@/app/components/Search";

const Header = () => {
	return (
		<div className="bg-gradient-to-r to-[#5f6984] from-[#0f1f47] p-2">
			<div className="text-left text-lg py-3 m-auto flex justify-center">
				<Search />
			</div>
		</div>
	);
};

export default Header;
