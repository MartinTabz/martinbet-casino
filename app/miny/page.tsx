import MineContainer from "@/components/mines/MineContainer";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { getServiceSupabase } from "@/utils/supabase/service";

export default async function MinesPage() {
	const supabase = await createClient();

	const { data: user } = await supabase.auth.getUser();

	if (user.user == null) {
		redirect("/prihlasit");
	}

	const { data: unfinishedGame } = await supabase
		.from("game_mines")
		.select("*")
		.eq("finished", false)
		.eq("id_profile", user.user.id)
		.order("created_at", { ascending: false })
		.limit(1)
		.single();

	let currentGameRevealedBoxes: GameMinesBoxes[] | [] = [];
	let numberOfMines: number = 7;

	if (unfinishedGame != null) {
		const { data: gameMinesBoxes } = await supabase
			.from("game_mines_boxes")
			.select("*")
			.eq("id_game", unfinishedGame.id);

		currentGameRevealedBoxes = gameMinesBoxes ?? [];

		const supabaseService = getServiceSupabase();

		const { count } = await supabaseService
			.from("game_mines_boxes")
			.select("*", { count: "exact", head: true })
			.eq("id_game", unfinishedGame.id)
			.eq("bomb", true);

		numberOfMines = count ? count : 7;
	}

	return (
		<section className="w-full flex justify-center py-5 px-4 md:py-10 lg:py-20">
			<MineContainer
				currentGame={unfinishedGame}
				currentGameRevealedBoxes={currentGameRevealedBoxes}
				currentGameMineCount={numberOfMines}
			/>
		</section>
	);
}
