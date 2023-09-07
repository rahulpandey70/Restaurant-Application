import { Location, PRICE, Region } from "@prisma/client";
import Link from "next/link";

interface SidebarProps {
	locations: Location[];
	regions: Region[];
	searchParams: {
		city?: string;
		region?: string;
		price?: PRICE;
	};
}

const Sidebar = ({ locations, regions, searchParams }: SidebarProps) => {
	const price = [
		{
			price: PRICE.CHEAP,
			label: "$",
			className: "border w-full text-center text-reg font-light rounded-1 p-2",
		},
		{
			price: PRICE.REGULAR,
			label: "$$",
			className:
				"border-r border-t text-center border-b w-full text-reg font-light p-2",
		},
		{
			price: PRICE.EXPENSIVE,
			label: "$$$",
			className:
				"border-r border-t border-b text-center w-full text-reg font-light p-2 rounded-r",
		},
	];

	return (
		<div className="w-1/5">
			<div className="border-b pb-4">
				<h1 className="mb-2">Location</h1>
				{locations.map((location) => (
					<Link
						href={{
							pathname: "/search",
							query: { ...searchParams, city: location.name },
						}}
						className="flex font-light text-reg capitalize"
					>
						{location.name}
					</Link>
				))}
			</div>
			<div className="border-b pb-4 mt-3">
				<h1 className="mb-2">Region</h1>
				{regions.map((region) => (
					<Link
						href={{
							pathname: "/search",
							query: { ...searchParams, region: region.name },
						}}
						className="flex font-light text-reg capitalize"
					>
						{region.name}
					</Link>
				))}
			</div>
			<div className="mt-3 pb-4">
				<h1 className="mb-2">Price</h1>
				<div className="flex">
					{price.map(({ price, label, className }) => (
						<Link
							href={{
								pathname: "/search",
								query: {
									...searchParams,
									price,
								},
							}}
							className={className}
						>
							{label}
						</Link>
					))}
				</div>
			</div>
		</div>
	);
};

export default Sidebar;
