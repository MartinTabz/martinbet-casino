// @/components/mines/MineContainer.tsx
"use client";

import { Slider } from "@/components/ui/slider";
import { FaBomb, FaDiamond } from "react-icons/fa6";
import { useState } from "react";
import { useNotifications } from "@/utils/notification-context";
import { useBalance } from "@/utils/balance-context";
import { cashOut, createNewGame } from "@/app/miny/actions";
import { FiLoader } from "react-icons/fi";
import MinesGrid from "./MinesGrid";

type WinInfo = {
	multiplier: string;
	winAmount: number;
};

export default function MineContainer({
	currentGame,
	currentGameRevealedBoxes,
	currentGameMineCount,
}: {
	currentGame: GameMines | null;
	currentGameRevealedBoxes: GameMinesBoxes[] | [];
	currentGameMineCount: number;
}) {
	const [numberOfMines, setNumberOfMines] = useState<number[]>([
		24 - currentGameMineCount,
	]);
	const [betAmout, setBetAmount] = useState<string>(
		currentGame
			? String(
					currentGame.bet_amount
						? currentGame.bet_amount / 100
						: currentGame.bet_amount
			  )
			: ""
	);

	const [winInfo, setWinInfo] = useState<WinInfo | null>(null);

	const [pendingGame, setPendingGame] = useState<boolean>(
		currentGame == null ? false : true
	);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [gridResetKey, setGridResetKey] = useState<number>(0);

	const { newError } = useNotifications();
	const { balance, setBalance } = useBalance();

	const handlePlay = async () => {
		if (pendingGame === true) {
			setIsLoading(true);
			const res = await cashOut();
			if (res.error) {
				newError(res.error);
			} else if (res.success && res.info) {
				setBalance(res.info.newBalance);
				setWinInfo({
					multiplier: res.info.multiplier ?? "",
					winAmount: res.info.winAmout ?? 0,
				});
				const audio = new Audio("/win.wav");
				audio.play().catch((err) => {
					console.error("Failed to play audio:", err);
				});
				setPendingGame(false);
			} else {
				newError("Něco se pokazilo");
			}
		} else {
			const actualNumberOfMines: number = 24 - numberOfMines[0];
			if (actualNumberOfMines < 1 || actualNumberOfMines > 24) {
				return newError("Počet min musí být celé číslo mezi 1 a 24.");
			}
			if (!Number.isInteger(parseInt(betAmout)) || parseInt(betAmout) <= 0) {
				return newError("Vsazená částka musí být kladné celé číslo.");
			}

			if(parseInt(betAmout) > 70000) {
				return newError("Maximální možná vsaditelná částka je z technických důvodů 70 000 Martinů")
			}

			setIsLoading(true);
			const res = await createNewGame(
				24 - numberOfMines[0],
				parseInt(betAmout) * 100
			);

			if (res.error) {
				newError(res.error);
			} else if (res.success) {
				setBalance(balance - parseInt(betAmout) * 100);
				setPendingGame(true);
				setGridResetKey((prev) => prev + 1);
				setWinInfo(null);
			} else {
				setIsLoading(false);
				return newError("Něco se pokazilo! Zkus to později.");
			}
		}

		setIsLoading(false);
	};

	return (
		<div className="w-full max-w-[1000px] h-auto border bg-primary-foreground rounded-xl md:grid md:grid-cols-6">
			<div className="md:col-span-4 md:order-2">
				<MinesGrid
					revealedMines={currentGameRevealedBoxes}
					resetKey={gridResetKey}
					setPendingGame={setPendingGame}
					pendingGame={pendingGame}
					winInfo={winInfo}
					setWinInfo={setWinInfo}
				/>
			</div>
			<hr className="block md:hidden" />
			<div className="p-4 flex flex-col gap-5 md:col-span-2 md:pt-5 relative w-full">
				<div className="absolute h-full w-[1px] border-r right-0 top-0"></div>
				<button
					disabled={isLoading}
					onClick={() => handlePlay()}
					className="bg-green-600 disabled:opacity-70 font-bold text-white h-[50px] w-full border-2 rounded-md border-green-500 md:order-3 md:mt-3 cursor-pointer hover:bg-green-700 duration-200 ease-in-out flex items-center justify-center"
				>
					{isLoading ? (
						<FiLoader className="animate-spin" />
					) : pendingGame ? (
						"Vybrat"
					) : (
						"Hrát"
					)}
				</button>
				<div className="flex flex-col gap-1">
					<label className="text-sm font-bold">Výše sázky</label>
					<div
						className={`flex items-center gap-3 border p-3 rounded-md bg-accent ${
							pendingGame && "opacity-60"
						}`}
					>
						<div className="bg-main border border-main-foreground text-white w-4 text-[10px] font-bold rounded-full h-4 flex items-center justify-center">
							M
						</div>
						<input
							disabled={pendingGame}
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
					<div
						className={`flex items-center gap-3 border p-3 rounded-md bg-accent ${
							pendingGame && "opacity-60"
						}`}
					>
						<div className="border bg-blue-900 flex items-center justify-center w-[50px] gap-1 py-1 rounded text-xs font-bold text-white">
							<FaDiamond />
							{numberOfMines[0] + 1}
						</div>
						<div className="w-[calc(100%-100px)]">
							<Slider
								disabled={pendingGame}
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
