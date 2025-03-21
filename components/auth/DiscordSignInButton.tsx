"use client";

import { createClient } from "@/utils/supabase/client";
import { useState } from "react";
import { FaDiscord } from "react-icons/fa6";
import { FiLoader } from "react-icons/fi";

export default function DiscordSignInButton() {
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const handleSignIn = async () => {
		setIsLoading(true);

		const supabase = createClient();

		await supabase.auth.signInWithOAuth({
			provider: "discord",
			options: {
				redirectTo: `${process.env.NEXT_PUBLIC_URL}/auth/callback`,
			},
		});
	};

	return (
		<button
			disabled={isLoading}
			onClick={handleSignIn}
			className="flex items-center gap-3 bg-[#5865F2] text-[#E0E3FF] font-bold px-5 py-2 rounded-full cursor-pointer text-sm duration-200 ease-in-out hover:bg-[#4957e7] disabled:hover:bg-[#5865F2] disabled:cursor-not-allowed"
		>
			{isLoading ? (
				<FiLoader className="animate-spin text-xl" />
			) : (
				<FaDiscord className="text-xl" />
			)}
			<div>
				Přihlásit se <span className="hidden lg:inline-block">přes Discord</span>
			</div>
		</button>
	);
}
