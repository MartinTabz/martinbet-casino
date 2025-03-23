// @components/mines/MineBox.tsx
"use client";

import Diamond from "@/public/Diamond";
import Bomb from "@/public/Bomb";

type Mine = {
	index: number;
	bomb: boolean;
	revealed: boolean;
	multiplier: string | null;
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
			} w-full border-2 aspect-square overflow-hidden sm:overflow-visible rounded-sm relative flex items-center justify-center z-20`}
		>
			{mine.revealed && (
				<>
					{mine.bomb ? (
						<div className="scale-75 sm:scale-100">
							<Bomb />
						</div>
					) : (
						<div className="scale-75 sm:scale-none">
							<Diamond />
							{mine.multiplier && (
								<div className="absolute left-1/2 -translate-x-1/2 bg-sky-600 border-sky-800 border-2 rounded-md font-bold px-3 text-sm bottom-[-15px] sm:bottom-[-5px]">
									{mine.multiplier}
								</div>
							)}
						</div>
					)}
				</>
			)}
		</div>
	);
}
