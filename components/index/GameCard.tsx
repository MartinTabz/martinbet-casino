import Link from "next/link";
import type { GameMenuItem } from "@/utils/types";

export default function GameCard({
	name,
	link,
	icon: Icon,
	bgColor,
	borderColor,
}: GameMenuItem) {
	return (
		<Link
			href={link}
			className="w-24 h-40 sm:w-28 sm:h-44 md:w-32 md:h-48 lg:w-36 lg:h-52 text-center duration-200 ease-in-out hover:opacity-80 text-xl md:text-2xl relative rounded-2xl font-bold flex items-center justify-center"
			style={{ backgroundColor: bgColor, border: `3px solid ${borderColor}` }}
		>
			<h2>{name}</h2>
			<Icon className="absolute text-8xl opacity-10 text-white" />
		</Link>
	);
}
