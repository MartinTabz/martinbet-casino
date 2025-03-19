"use client";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FaChevronDown } from "react-icons/fa6";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { signOut } from "@/app/auth/actions";

export default function UserNavDropDown() {
	const [isOpened, setIsOpened] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const handleLogOut = async () => {
		setIsLoading(true);

		const res = await signOut();

		if (res.message) {
			console.error(res.message);
			setIsLoading(false);
		}
	};

	return (
		<DropdownMenu open={isOpened} onOpenChange={setIsOpened}>
			<DropdownMenuTrigger>
				<FaChevronDown
					className={`text-sm cursor-pointer duration-150 ease-in-out ${
						isOpened && "top-[2px] rotate-180"
					}`}
				/>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuLabel>Můj účet</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem disabled={isLoading} onClick={handleLogOut}>
					{isLoading ? "Odhlašuji..." : "Odhlásit se"}
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
