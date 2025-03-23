// @components/mines/MineBox.tsx
"use client";

import Diamond from "@/public/Diamond";
import Bomb from "@/public/Bomb";

type Mine = {
	index: number;
	bomb: boolean;
	revealed: boolean;
};

interface Props {
	mine: Mine;
	isLoading: boolean;
	onReveal: (mineIndex: number) => void;
	pendingGame: boolean;
}

export default function MineBox({
	mine,
	isLoading,
	onReveal,
	pendingGame,
}: Props) {
	return (
		<div
			onClick={() => {
				if (!isLoading && !mine.revealed && pendingGame) {
					onReveal(mine.index);
				}
			}}
			className={`${pendingGame ? "duration-100 ease-in-out" : "opacity-65"} ${
				!mine.revealed && pendingGame && "hover:bottom-[3px] cursor-pointer"
			} ${!mine.revealed && "bg-accent border-accent group hover:shadow-lg"} ${
				mine.revealed && mine.bomb && "border-red-900"
			} ${
				mine.revealed && !mine.bomb && "border-sky-800 bg-sky-950"
			} w-full border-2 aspect-square rounded-sm relative flex items-center justify-center z-20`}
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
