// @components/mines/MinesGrid.tsx
"use client";

import { useState, useEffect } from "react";
import MineBox from "./MineBox";
import { revealMine } from "@/app/miny/actions";
import { useNotifications } from "@/utils/notification-context";
import { useBalance } from "@/utils/balance-context";

type Mine = {
	index: number;
	bomb: boolean;
	revealed: boolean;
};

interface Props {
	revealedMines: GameMinesBoxes[] | [];
	resetKey: number;
	setPendingGame: (pendingGame: boolean) => void;
	pendingGame: boolean;
}

export default function MinesGrid({
	revealedMines,
	resetKey,
	setPendingGame,
	pendingGame,
}: Props) {
	const [mines, setMines] = useState<Mine[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const { newError, newSuccess } = useNotifications();
	const { balance, setBalance } = useBalance();

	useEffect(() => {
		const initialMines: Mine[] = Array.from({ length: 25 }, (_, index) => {
			const revealedEntry = revealedMines.find((box) => box.id_box === index);
			return {
				index,
				bomb: revealedEntry ? revealedEntry.bomb : false,
				revealed: revealedEntry ? revealedEntry.revealed : false,
			};
		});
		setMines(initialMines);
	}, [revealedMines, resetKey]);

	const handleRevealMine = async (mineIndex: number) => {
		const currentMine = mines.find((m) => m.index === mineIndex);
		if (!currentMine || currentMine.revealed || isLoading) return;

		const audio = new Audio("/click.wav");
		audio.play().catch((err) => {
			console.error("Failed to play audio:", err);
		});

		setIsLoading(true);
		const res = await revealMine(mineIndex);
		if (res.error) {
			newError(res.error);
			setIsLoading(false);
			return;
		} else if (!res.info) {
			newError("Něco se pokazilo");
			setIsLoading(false);
			return;
		}

		setMines((prevMines) =>
			prevMines.map((mine) =>
				mine.index === mineIndex
					? { ...mine, revealed: true, bomb: res.info.bomb }
					: mine
			)
		);
		if (res.info.bomb) {
			setPendingGame(false);
			const audio = new Audio("/bomb.wav");
			audio.play().catch((err) => {
				console.error("Failed to play audio:", err);
			});
		} else {
			const audio = new Audio("/diamond.wav");
			audio.play().catch((err) => {
				console.error("Failed to play audio:", err);
			});
			console.log(res);
			if (res.info.won == true) {
				setPendingGame(false);
				newSuccess("Vyhrál jsi");
				setBalance(res.info.newBalance ? res.info.newBalance : 0);
			}
		}

		setIsLoading(false);
		return res.info;
	};

	return (
		<div className="grid grid-cols-5 gap-1.5 w-full p-4 sm:gap-2.5 lg:p-10">
			{mines.map((mine) => (
				<MineBox
					key={mine.index}
					mine={mine}
					isLoading={isLoading}
					onReveal={handleRevealMine}
					pendingGame={pendingGame}
				/>
			))}
		</div>
	);
}
