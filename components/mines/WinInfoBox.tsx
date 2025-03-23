export default function WinInfoBox({
	multiplier,
	winAmount,
}: {
	multiplier: string;
	winAmount: number;
}) {
	const formattedBalance =
		winAmount % 100 === 0
			? winAmount.toLocaleString("cs-CZ", {
					minimumFractionDigits: 0,
					maximumFractionDigits: 0,
			  })
			: winAmount.toLocaleString("cs-CZ", {
					minimumFractionDigits: 2,
					maximumFractionDigits: 2,
			  });

	return (
		<div className="z-30 absolute w-full h-full flex items-center justify-center">
			<div className="py-5 px-10 rounded-2xl border-2 border-green-600 bg-green-950 flex flex-col gap-2 text-center">
				<span className="font-bold text-2xl">{multiplier}</span>
				<div className="w-full h-[2px] bg-gray-600"></div>
				<span className="flex font-medium text-sm items-center justify-center gap-1">
					{formattedBalance}
					<div className="bg-main border border-main-foreground text-white w-4 text-[10px] font-bold rounded-full h-4 flex items-center justify-center">
						M
					</div>
				</span>
			</div>
		</div>
	);
}
