import type { Database as DB } from "@/utils/database.types";

declare global {
	type Database = DB;
	type GameMines = DB["public"]["Tables"]["game_mines"]["Row"];
	type GameMinesBoxes = DB["public"]["Tables"]["game_mines_boxes"]["Row"];
	type Profile = DB["public"]["Tables"]["profiles"]["Row"];
}
