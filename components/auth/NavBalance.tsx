"use client";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Input } from "../ui/input";
import { FiLoader } from "react-icons/fi";
import { usePathname } from "next/navigation";
import { getEmbeddedCheckout } from "@/app/api/stripe/actions";
import { loadStripe } from "@stripe/stripe-js";
import {
	EmbeddedCheckoutProvider,
	EmbeddedCheckout,
} from "@stripe/react-stripe-js";

interface CheckoutSession {
	id: string;
	client_secret: string | null;
}

export default function NavBalance({ balance }: { balance: number }) {
	const formattedBalance = balance.toLocaleString("cs-CZ");
	const stripePromise = loadStripe(
		process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
	);

	const [isOpened, setIsOpened] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [value, setValue] = useState<string>("15");

	const [checkout, setCheckout] = useState<CheckoutSession | null>(null);

	const pathname = usePathname();

	const handleBalanceDeposit = async () => {
		const depositAmount = parseFloat(value);
		if (isNaN(depositAmount)) {
			console.error("Zadejte platné číslo");
			return;
		}
		if (depositAmount < 15 || depositAmount > 500000) {
			console.error("Číslo musí být mezi 15 a 500000");
			return;
		}

		setIsLoading(true);

		const res = await getEmbeddedCheckout(depositAmount, pathname);

		if (res.error) {
			console.log(res.error);
			setIsLoading(false);
			return;
		} else if (!res.checkout) {
			console.log("Něco se pokazilo");
			setIsLoading(false);
			return;
		}

		setCheckout(res.checkout);
		setIsLoading(false);
	};

	return (
		<>
			<div className="flex items-center justify-between h-[40px]">
				<div className="min-w-32 bg-accent text-accent-foreground h-full rounded-l-md flex gap-2 items-center justify-end p-3">
					{formattedBalance}
					<div className="bg-main border border-main-foreground text-white w-5 text-xs font-bold rounded-full h-5 flex items-center justify-center">
						M
					</div>
				</div>
				<div
					onClick={() => setIsOpened(true)}
					className="cursor-pointer rounded-r-md duration-200 text-sm ease-in-out hover:bg-main-foreground bg-main color-slate-50 font-black h-full w-auto px-3 flex items-center justify-center"
				>
					Nabít
				</div>
			</div>
			<Dialog open={isOpened} onOpenChange={setIsOpened}>
				<DialogContent>
					{checkout ? (
						<div className="pb-5 overflow-y-scroll overflow-x-hidden">
							<div className="hidden">
								<DialogHeader>
									<DialogTitle>Dobít Martiny na účet</DialogTitle>
									<DialogDescription>
										Zadej, kolik si přeješ dobít Martinů (Minimálně 15 a
										maximálně půl míče ty žebráku)
									</DialogDescription>
								</DialogHeader>
							</div>
							<EmbeddedCheckoutProvider
								stripe={stripePromise}
								options={{ clientSecret: checkout.client_secret }}
							>
								<EmbeddedCheckout />
							</EmbeddedCheckoutProvider>
						</div>
					) : (
						<>
							<DialogHeader>
								<DialogTitle>Dobít Martiny na účet</DialogTitle>
								<DialogDescription>
									Zadej, kolik si přeješ dobít Martinů (Minimálně 15 a maximálně
									půl míče ty žebráku)
								</DialogDescription>
							</DialogHeader>
							<div className="w-full">
								<div className="">
									<div className="grid grid-cols-4 gap-2 py-5">
										<Input
											className="col-span-3"
											type="number"
											disabled={isLoading}
											min={15}
											max={500000}
											value={value}
											onChange={(e) => setValue(e.target.value)}
										/>
										<div
											onClick={() => {
												if (!isLoading) {
													handleBalanceDeposit();
												}
											}}
											className={`${
												isLoading
													? "cursor-not-allowed"
													: "cursor-pointer hover:bg-main-foreground"
											} w-full h-full rounded-md border border-main-foreground font-bold text-sm flex items-center justify-center bg-main`}
										>
											{isLoading ? (
												<FiLoader className="animate-spin" />
											) : (
												"Nabít"
											)}
										</div>
									</div>
								</div>
							</div>
						</>
					)}
				</DialogContent>
			</Dialog>
		</>
	);
}
