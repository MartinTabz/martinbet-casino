"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function signOut() {
	const supabase = await createClient();

	const { error } = await supabase.auth.signOut();

	if (error) {
		console.error(error.message);
		return {
			message: "Něco se pokazilo při odhlašování. Zkus to znovu později!",
		};
	}

	revalidatePath("/", "layout");
	redirect("/");
}
