// @components/mines/MinesGrid.tsx
"use client";

import { useState, useEffect } from "react";
import MineBox from "./MineBox";

// Define a local type for our mine state.
type Mine = {
	index: number;
	bomb: boolean;
	revealed: boolean;
};

interface Props {
	revealedMines: GameMinesBoxes[] | [];
}

export default function MinesGrid({ revealedMines }: Props) {
	const [mines, setMines] = useState<Mine[]>([]);

	useEffect(() => {
		// Create an array of 25 boxes (indexes 0 to 24)
		const initialMines: Mine[] = Array.from({ length: 25 }, (_, index) => {
			// Find a revealed box with matching index (id_box)
			const revealedEntry = revealedMines.find((box) => box.id_box === index);
			return {
				index,
				bomb: revealedEntry ? revealedEntry.bomb : false,
				revealed: revealedEntry ? revealedEntry.revealed : false,
			};
		});
		setMines(initialMines);
	}, [revealedMines]);

	return (
		<div className="grid grid-cols-5 gap-1.5 w-full p-4 sm:gap-2.5 lg:p-10">
			{mines.map((mine) => (
				<MineBox key={mine.index} mine={mine} />
			))}
		</div>
	);
}
