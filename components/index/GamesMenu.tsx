"use client";

import { motion, AnimatePresence } from "framer-motion";
import { FaChevronDown } from "react-icons/fa6";
import { useState } from "react";
import GameCard from "./GameCard";
import { GamesMenuItems } from "@/utils/data";
import { GameMenuItem } from "@/utils/types";

export default function GamesMenu() {
	const [opened, setOpened] = useState<boolean>(true);

	// Define container variants to stagger children animations
	const containerVariants = {
		hidden: {},
		show: {
			transition: {
				staggerChildren: 0.1,
				delayChildren: 0.2,
			},
		},
	};

	// Define child variants for each GameCard
	const cardVariants = {
		hidden: { opacity: 0, y: -20 },
		show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
	};

	return (
		<div className="flex flex-col gap-5 border rounded-2xl p-4 bg-primary-foreground">
			<button
				onClick={() => setOpened(!opened)}
				className="w-full cursor-pointer flex items-center justify-between p-0"
			>
				<h1 className="font-bold text-lg">Všechny hry</h1>
				<FaChevronDown
					className={`${opened && "rotate-180"} duration-100 ease-in-out`}
				/>
			</button>
			<AnimatePresence>
				{opened && (
					<motion.div
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: "auto" }}
						exit={{ opacity: 0, height: 0 }}
					>
						<hr className="mb-5" />
						<div className="w-auto h-auto flex items-center gap-5 overflow-x-scroll">
							{/* Wrap the cards in a motion.div with container variants */}
							<motion.div
								className="flex gap-2"
								variants={containerVariants}
								initial="hidden"
								animate="show"
							>
								{GamesMenuItems.map((item: GameMenuItem, index: number) => (
									<motion.div key={index} variants={cardVariants}>
										<GameCard
											bgColor={item.bgColor}
											borderColor={item.borderColor}
											icon={item.icon}
											link={item.link}
											name={item.name}
										/>
									</motion.div>
								))}
							</motion.div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}