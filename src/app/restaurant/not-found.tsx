import Image from "next/image";
import errorImage from "../../../public/icons/error.png";

export default function NotFound() {
	return (
		<div className="h-screen bg-gray-200 flex flex-col justify-center items-center">
			<Image src={errorImage} alt="error-image" />
			<div className="bg-white px-9 py-14 shadow rounded">
				<h3 className="text-2xl font-bold">Well, this is not good</h3>
				<p className="text-reg font-bold">No restaurant found</p>
				<p className="mt-6 text-sm font-light">404</p>
			</div>
		</div>
	);
}
