"use client";

import { Slider } from "@/components/ui/slider";
import { FaBomb, FaDiamond } from "react-icons/fa6";
import { useState } from "react";

export default function MineContainer() {
	const [numberOfMines, setNumberOfMines] = useState<number[]>([17]);
	const [betAmout, setBetAmount] = useState<string>("");

	const handlePlay = async () => {
		console.log("Min: ", 24 - numberOfMines[0]);
		console.log("Částka: ", betAmout);
	};

	return (
		<div className="w-full max-w-[1000px] h-auto border bg-primary-foreground rounded-xl md:grid md:grid-cols-6">
			<div className="md:col-span-4 md:order-2">
				<div className="grid grid-cols-5 gap-1.5 w-full p-4 sm:gap-2.5 lg:p-10">
					<div className="w-full aspect-square bg-accent rounded-sm"></div>
					<div className="w-full aspect-square bg-accent rounded-sm"></div>
					<div className="w-full aspect-square bg-accent rounded-sm"></div>
					<div className="w-full aspect-square bg-accent rounded-sm"></div>
					<div className="w-full aspect-square bg-accent rounded-sm"></div>
					<div className="w-full aspect-square bg-accent rounded-sm"></div>
					<div className="w-full aspect-square bg-accent rounded-sm"></div>
					<div className="w-full aspect-square bg-accent rounded-sm"></div>
					<div className="w-full aspect-square bg-accent rounded-sm"></div>
					<div className="w-full aspect-square bg-accent rounded-sm"></div>
					<div className="w-full aspect-square bg-accent rounded-sm"></div>
					<div className="w-full aspect-square bg-accent rounded-sm"></div>
					<div className="w-full aspect-square bg-accent rounded-sm"></div>
					<div className="w-full aspect-square bg-accent rounded-sm"></div>
					<div className="w-full aspect-square bg-accent rounded-sm"></div>
					<div className="w-full aspect-square bg-accent rounded-sm"></div>
					<div className="w-full aspect-square bg-accent rounded-sm"></div>
					<div className="w-full aspect-square bg-accent rounded-sm"></div>
					<div className="w-full aspect-square bg-accent rounded-sm"></div>
					<div className="w-full aspect-square bg-accent rounded-sm"></div>
					<div className="w-full aspect-square bg-accent rounded-sm"></div>
					<div className="w-full aspect-square bg-accent rounded-sm"></div>
					<div className="w-full aspect-square bg-accent rounded-sm"></div>
					<div className="w-full aspect-square bg-accent rounded-sm"></div>
					<div className="w-full aspect-square bg-accent rounded-sm"></div>
				</div>
			</div>
			<hr className="block md:hidden" />
			<div className="p-4 flex flex-col gap-5 md:col-span-2 md:pt-5 relative w-full">
				<div className="absolute h-full w-[1px] border-r right-0 top-0"></div>
				<button
					onClick={() => handlePlay()}
					className="bg-green-600 font-bold text-white py-3 w-full border-2 rounded-md border-green-500 md:order-3 md:mt-3 cursor-pointer hover:bg-green-700 duration-200 ease-in-out"
				>
					Hrát
				</button>
				<div className="flex flex-col gap-1">
					<label className="text-sm font-bold">Výše sázky</label>
					<div className="flex items-center gap-3 border p-3 rounded-md bg-accent">
						<div className="bg-main border border-main-foreground text-white w-4 text-[10px] font-bold rounded-full h-4 flex items-center justify-center">
							M
						</div>
						<input
							value={betAmout}
							placeholder="0,00"
							onChange={(e) => setBetAmount(e.target.value)}
							className="w-[calc(100%-16px)] focus:outline-0"
							type="number"
						/>
					</div>
				</div>
				<div className="flex flex-col gap-1">
					<label className="text-sm font-bold">Počet min</label>
					<div className="flex items-center gap-3 border p-3 rounded-md bg-accent">
						<div className="border bg-blue-900 flex items-center justify-center w-[50px] gap-1 py-1 rounded text-xs font-bold text-white">
							<FaDiamond />
							{numberOfMines[0] + 1}
						</div>
						<div className="w-[calc(100%-100px)]">
							<Slider
								value={numberOfMines}
								onValueChange={setNumberOfMines}
								defaultValue={[17]}
								max={23}
								step={1}
							/>
						</div>
						<div className="border bg-red-950 text-white flex items-center justify-center w-[50px] gap-1 py-1 rounded text-xs font-bold">
							{25 - (numberOfMines[0] + 1)}
							<FaBomb />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
