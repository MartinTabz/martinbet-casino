"use client";

import { FaBomb, FaDiamond } from "react-icons/fa6";
import Diamond from "@/public/Diamond";
import Bomb from "@/public/Bomb";

type Mine = {
	index: number;
	bomb: boolean;
	revealed: boolean;
};

interface Props {
	mine: Mine;
}

export default function MineBox({ mine }: Props) {
	return (
		<div
			className={`${
				!mine.revealed &&
				"bg-accent border-accent group hover:bottom-[3px] cursor-pointer hover:shadow-lg"
			} ${mine.revealed && mine.bomb && "border-red-900"} ${
				mine.revealed && !mine.bomb && "border-sky-800 bg-sky-950"
			} w-full border-2 aspect-square rounded-sm relative flex items-center justify-center z-20 duration-100 ease-in-out`}
		>
			{mine.revealed && (
				<>
					{mine.bomb ? (
						<div>
							<Bomb />
						</div>
					) : (
						<Diamond />
					)}
				</>
			)}
		</div>
	);
}
