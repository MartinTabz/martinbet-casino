"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Button } from "../ui/button";
import { ThemeSwitch } from "../theme/ThemeSwitch";
import NavBalanceMenu from "./NavBalanceMenu";
import { useState } from "react";
import { FiLoader } from "react-icons/fi";
import { signOut } from "@/app/auth/actions";

export default function MobileMenu({
	imgUrl,
	username,
	balance,
}: {
	imgUrl: string;
	username: string;
	balance: number;
}) {
	const [isLogginOut, setIsLogginOut] = useState<boolean>(false);

	const handleSignOut = async () => {
		setIsLogginOut(true);

		const res = await signOut();

		if (res.message) {
			console.error(res.message);
			setIsLogginOut(false);
		}
	};

	return (
		<div className="block lg:hidden">
			<Sheet>
				<SheetTrigger className="flex items-center justify-center">
					<Menu />
				</SheetTrigger>
				<SheetContent>
					<div className="hidden">
						<SheetHeader>
							<SheetTitle>Are you absolutely sure?</SheetTitle>
							<SheetDescription>
								This action cannot be undone. This will permanently delete your
								account and remove your data from our servers.
							</SheetDescription>
						</SheetHeader>
					</div>
					<div className="relative w-full top-12 px-5 grid gap-2">
						<div className="flex items-center justify-center gap-3 pb-3">
							<Avatar>
								<AvatarImage src={imgUrl} />
								<AvatarFallback>MB</AvatarFallback>
							</Avatar>
							<span className="font-bold uppercase">{username}</span>
						</div>
						<hr className="mb-3" />
						<NavBalanceMenu balance={balance} />
						<Button
							onClick={() => handleSignOut()}
							disabled={isLogginOut}
							variant={"destructive"}
						>
							{isLogginOut ? (
								<FiLoader className="animate-spin" />
							) : (
								"Odhlásit se"
							)}
						</Button>
						<div className="w-full flex items-center justify-center">
							<ThemeSwitch />
						</div>
					</div>
				</SheetContent>
			</Sheet>
		</div>
	);
}
