import MineContainer from "@/components/mines/MineContainer";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function MinesPage() {
	const supabase = await createClient();

	const { data: user } = await supabase.auth.getUser();

	if (user.user == null) {
		redirect("/prihlasit");
	}

	const { data: unfinishedGame } = await supabase
		.from("game_mines")
		.select(`*,game_mines_boxes("*")`)
		.eq("finished", false)
		.eq("id_profile", user.user.id)
		.order("created_at", { ascending: false })
		.limit(1)
		.single();

	console.log(unfinishedGame);

	return (
		<section className="w-full flex justify-center py-5 px-4 md:py-10 lg:py-20">
			<MineContainer currentGame={unfinishedGame} />
		</section>
	);
}
