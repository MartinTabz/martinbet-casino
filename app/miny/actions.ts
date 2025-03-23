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

export async function revealMine(mineIndex: number) {
	const supabaseAuth = await createClient();

	const { data: auth, error: authErr } = await supabaseAuth.auth.getUser();

	if (authErr || !auth?.user) {
		return { error: "Není přihlášený uživatel", info: null };
	}

	if (mineIndex < 0 || mineIndex > 24) {
		return { error: "Nebylo vybráno validní políčko", info: null };
	}

	const { data: currentGame } = await supabaseAuth
		.from("game_mines")
		.select("*")
		.eq("finished", false)
		.eq("id_profile", auth.user.id)
		.order("created_at", { ascending: false })
		.limit(1)
		.single();

	if (!currentGame) {
		return { error: "Nemáš rozehranou žádnou hru", info: null };
	}

	const supabase = getServiceSupabase();

	const { data: gameMinesBoxes } = await supabase
		.from("game_mines_boxes")
		.select("*")
		.eq("id_game", currentGame.id)
		.eq("id_box", mineIndex)
		.single();

	if (!gameMinesBoxes) {
		return { error: "Vybrané políčko neexistuje", info: null };
	}

	if (gameMinesBoxes.revealed === true) {
		return { error: "Vybrané políčko již bylo odhaleno", info: null };
	}

	if (gameMinesBoxes.bomb === true) {
		const { error: updateGameErr } = await supabase
			.from("game_mines")
			.update({ won: false, finished: true })
			.eq("id", currentGame.id)
			.select();

		if (updateGameErr) {
			return { error: "Něco se pokazilo při změně hry", info: null };
		}

		const { error: updateGameBoxesErr } = await supabase
			.from("game_mines_boxes")
			.update({ revealed: true })
			.eq("id_game", currentGame.id)
			.select();

		if (updateGameBoxesErr) {
			return { error: "Něco se pokazilo při změně políček hry", info: null };
		}

		return { error: null, info: { bomb: true, multiplier: null, won: false } };
	} else {
		const { error: updateGameBoxesErr } = await supabase
			.from("game_mines_boxes")
			.update({ revealed: true })
			.eq("id_game", currentGame.id)
			.eq("id_box", mineIndex)
			.select();

		if (updateGameBoxesErr) {
			return { error: "Něco se pokazilo při změně políček hry", info: null };
		}

		const { data: nonBombBoxes, error: nonBombErr } = await supabase
			.from("game_mines_boxes")
			.select("*")
			.eq("id_game", currentGame.id)
			.eq("bomb", false);

		if (nonBombErr) {
			return { error: "Chyba při načítání políček", info: null };
		}

		const allRevealed = nonBombBoxes?.every((box) => box.revealed === true);

		if (allRevealed) {
			// All safe boxes are revealed: update game as won.
			const { error: updateGameWinErr } = await supabase
				.from("game_mines")
				.update({ won: true, finished: true })
				.eq("id", currentGame.id)
				.select();

			if (updateGameWinErr) {
				return {
					error: "Něco se pokazilo při aktualizaci hry jako vyhrané",
					info: null,
				};
			}

			// Reveal all boxes.
			const { error: revealAllErr } = await supabase
				.from("game_mines_boxes")
				.update({ revealed: true })
				.eq("id_game", currentGame.id)
				.select();

			if (revealAllErr) {
				return {
					error: "Něco se pokazilo při aktualizaci hry jako vyhrané",
					info: null,
				};
			}

			const multiplier = 25;
			const betAmount = currentGame.bet_amount || 0;
			const winAmount = Math.round(betAmount * multiplier);

			const { data: profileData, error: profileErr } = await supabase
				.from("profiles")
				.select("balance")
				.eq("id", currentGame.id_profile)
				.single();

			if (profileErr || !profileData) {
				return { error: "Chyba při načítání profilu", info: null };
			}

			const newBalance = profileData.balance + winAmount;
			const { error: updateProfileErr } = await supabase
				.from("profiles")
				.update({ balance: newBalance })
				.eq("id", currentGame.id_profile);

			if (updateProfileErr) {
				return { error: "Chyba při aktualizaci zůstatku", info: null };
			}

			return {
				error: null,
				info: { bomb: false, multiplier: "1.3x", won: true, newBalance },
			};
		} else {
			return {
				error: null,
				info: { bomb: false, multiplier: "1.3x", won: false },
			};
		}
	}
}

export async function cashOut() {
	// 1. Get authenticated user
	const supabaseAuth = await createClient();
	const { data: auth, error: authErr } = await supabaseAuth.auth.getUser();

	if (authErr || !auth?.user) {
		return { error: "Není přihlášený uživatel", info: null };
	}

	// 2. Get the current (unfinished) game for the user.
	const { data: currentGame } = await supabaseAuth
		.from("game_mines")
		.select("*")
		.eq("finished", false)
		.eq("id_profile", auth.user.id)
		.order("created_at", { ascending: false })
		.limit(1)
		.single();

	if (!currentGame) {
		return { error: "Nemáš rozehranou žádnou hru", info: null };
	}

	// 3. Use service Supabase to fetch all boxes for the current game.
	const supabase = getServiceSupabase();
	const { data: boxes, error: boxesErr } = await supabase
		.from("game_mines_boxes")
		.select("*")
		.eq("id_game", currentGame.id);

	if (boxesErr || !boxes) {
		return { error: "Chyba při načítání políček hry", info: null };
	}

	// 4. Count bombs, safe boxes, and revealed safe boxes.
	const totalBoxes = 25;
	const bombCount = boxes.filter((box) => box.bomb === true).length;
	const safeTotal = totalBoxes - bombCount;
	const revealedSafe = boxes.filter(
		(box) => box.bomb === false && box.revealed === true
	).length;

	// 5. Compute multiplier.
	let multiplier: number;
	if (revealedSafe <= 0) {
		multiplier = 1;
	} else if (revealedSafe >= safeTotal) {
		multiplier = safeTotal; // cap at safeTotal
	} else {
		multiplier = safeTotal / (safeTotal - revealedSafe);
	}

	// 6. Calculate cash out amount.
	// Assumes currentGame.bet_amount is in the same unit as profile.balance.
	const cashOutAmount = (currentGame.bet_amount || 0) * multiplier;

	// 7. Retrieve user's profile.
	const { data: profile, error: profileErr } = await supabase
		.from("profiles")
		.select("balance")
		.eq("id", auth.user.id)
		.single();

	if (profileErr || !profile) {
		return { error: "Chyba při načítání profilu", info: null };
	}

	// 8. Update user's balance.
	const newBalance = profile.balance + Math.round(cashOutAmount);
	const { error: updateErr } = await supabase
		.from("profiles")
		.update({ balance: newBalance })
		.eq("id", auth.user.id);

	if (updateErr) {
		console.error(updateErr);
		return { error: "Chyba při aktualizaci zůstatku", info: null };
	}

	// 9. Mark the game as finished and won.
	const { error: finishErr } = await supabase
		.from("game_mines")
		.update({ finished: true, won: true })
		.eq("id", currentGame.id);

	if (finishErr) {
		return { error: "Chyba při uzavírání hry", info: null };
	}

	return { error: null, success: true, info: { multiplier, newBalance } };
}
