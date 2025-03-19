import DiscordSignInButton from "./DiscordSignInButton";
import UserNav from "./UserNav";

export default function Navigation({ user }: any | null) {
	return (
		<header className="w-full h-[80px] flex justify-center items-center px-2 border-b">
			<div className="flex w-full max-w-[1000px] items-center justify-between">
				<h1>MartinBet</h1>
				{user ? (
					<UserNav
						username={user.user_metadata.full_name}
						imgUrl={user.user_metadata.avatar_url}
					/>
				) : (
					<DiscordSignInButton />
				)}
			</div>
		</header>
	);
}
