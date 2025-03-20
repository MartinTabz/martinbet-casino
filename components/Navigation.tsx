import { User } from "@supabase/supabase-js";
import DiscordSignInButton from "./auth/DiscordSignInButton";
import UserNav from "./auth/UserNav";
import NavBalance from "./auth/NavBalance";
import { ThemeSwitch } from "./theme/ThemeSwitch";
import { createClient } from "@/utils/supabase/server";
import Logo from "@/public/Logo";
import Link from "next/link";
import MobileMenu from "./auth/MobileMenu";

interface NavigationProps {
	user: User | null;
}

export default async function Navigation({ user }: NavigationProps) {
	let balance = 0;

	if (user) {
		const supabase = await createClient();
		const { data: profile } = await supabase
			.from("profiles")
			.select("balance")
			.eq("id", user.id)
			.single();

		if (profile) {
			balance = profile.balance;
		}
	}

	return (
		<header className="w-full h-[80px] flex justify-center items-center px-2 border-b">
			<div className="flex w-full max-w-[1000px] items-center justify-between">
				<Link href={"/"}>
					<Logo fill="var(--primary)" />
				</Link>
				<div className="flex items-center justify-end gap-2">
					<div className={`${user ? "block" : "hidden lg:block"}`}>
						<NavBalance balance={balance} isUser={user ? true : false} />
					</div>
					{user && (
						<MobileMenu
							username={user.user_metadata.full_name}
							imgUrl={user.user_metadata.avatar_url}
							balance={balance}
						/>
					)}
				</div>
				<div
					className={`items-center justify-end gap-5 ${
						user ? "hidden lg:flex" : "flex"
					}`}
				>
					<div className="hidden lg:block">
						<ThemeSwitch />
					</div>
					{user ? (
						<div className="hidden lg:block">
							<UserNav
								username={user.user_metadata.full_name}
								imgUrl={user.user_metadata.avatar_url}
							/>
						</div>
					) : (
						<DiscordSignInButton />
					)}
				</div>
			</div>
		</header>
	);
}
