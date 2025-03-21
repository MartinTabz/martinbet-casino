import DiscordSignInButton from "@/components/auth/DiscordSignInButton";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function SignInPage() {
	const supabase = await createClient();

	const { data: user } = await supabase.auth.getUser();

	if (user.user) {
		redirect("/");
	}

	return (
		<div className="w-full h-[calc(100dvh-80px)] flex items-center justify-center">
			<DiscordSignInButton />
		</div>
	);
}
