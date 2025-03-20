import { User } from "@supabase/supabase-js";
import DiscordSignInButton from "./auth/DiscordSignInButton";
import UserNav from "./auth/UserNav";
import NavBalance from "./auth/NavBalance";
import { ThemeSwitch } from "./theme/ThemeSwitch";
import { createClient } from "@/utils/supabase/server";

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
				<h1>MartinBet</h1>
				<NavBalance balance={balance} />
				<div className="flex items-center justify-end gap-5">
					<ThemeSwitch />
					{user ? (
						<UserNav
							username={user.user_metadata.full_name}
							imgUrl={user.user_metadata.avatar_url}
						/>
					) : (
						<DiscordSignInButton />
					)}
				</div>
			</div>
		</header>
	);
}
