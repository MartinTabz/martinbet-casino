"use server";

import { createClient } from "@/utils/supabase/server";
import { getServiceSupabase } from "@/utils/supabase/service";

export async function createNewGame(numberOfMines: number, betAmout: number) {
	const supabaseAuth = await createClient();

	const { data: auth, error: authErr } = await supabaseAuth.auth.getUser();

	if (authErr || !auth?.user) {
		return { error: "Není přihlášený uživatel", success: false };
	}

	if (
		!Number.isInteger(numberOfMines) ||
		numberOfMines < 1 ||
		numberOfMines > 24
	) {
		return {
			error: "Počet min musí být celé číslo mezi 1 a 24.",
			success: false,
		};
	}

	if (!Number.isInteger(betAmout) || betAmout <= 0) {
		return {
			error: "Vsazená částka musí být kladné celé číslo.",
			success: false,
		};
	}

	const { data: profile, error: profileErr } = await supabaseAuth
		.from("profiles")
		.select("balance")
		.eq("id", auth.user.id)
		.single();

	if (profileErr || !profile) {
		return {
			error: "Nebyl nalezen profil! Kontaktuj Martina",
			success: false,
		};
	}

	if (betAmout > profile.balance) {
		return {
			error: "Nemáš dostatek Martinů",
			success: false,
		};
	}

	const supabase = getServiceSupabase();

	const { data: unfinishedGames, error: gamesErr } = await supabase
		.from("game_mines")
		.select("id")
		.eq("finished", false)
		.eq("id_profile", auth.user.id);

	if (gamesErr) {
		return { error: "Chyba při ověřování neukončených her", success: false };
	}
	if (unfinishedGames && unfinishedGames.length !== 0) {
		return {
			error: "Nelze vytvořit novou hru, protože jsi nedohrál tu poslední.",
			success: false,
		};
	}

	const { data: newGameData, error: newGameErr } = await supabase
		.from("game_mines")
		.insert({
			id_profile: auth.user.id,
			bet_amount: betAmout,
			finished: false,
		})
		.select()
		.single();

	if (newGameErr || !newGameData) {
		return { error: "Chyba při vytváření nové hry", success: false };
	}

	const gameId = newGameData.id;

	const totalBoxes = 25;
	const boxIndices = Array.from({ length: totalBoxes }, (_, i) => i);

	for (let i = boxIndices.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[boxIndices[i], boxIndices[j]] = [boxIndices[j], boxIndices[i]];
	}

	const bombIndices = new Set(boxIndices.slice(0, numberOfMines));

	const boxesToInsert = [];
	for (let i = 0; i < totalBoxes; i++) {
		boxesToInsert.push({
			id_game: gameId,
			id_box: i,
			bomb: bombIndices.has(i),
			revealed: false,
		});
	}

	const { error: boxesErr } = await supabase
		.from("game_mines_boxes")
		.insert(boxesToInsert);

	if (boxesErr) {
		return { error: "Chyba při vytváření políček hry", success: false };
	}

	const newBalance = profile.balance - betAmout;
	const { error: updateErr } = await supabase
		.from("profiles")
		.update({ balance: newBalance })
		.eq("id", auth.user.id);

	if (updateErr) {
		return { error: "Chyba při aktualizaci zůstatku", success: false };
	}

	return { error: null, success: true };
}
