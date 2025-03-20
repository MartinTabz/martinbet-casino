"use server";

import { createClient } from "@/utils/supabase/server";
import { stripe } from "@/utils/stripe/config";

export async function getEmbeddedCheckout(amount: number, returnPath: string) {
	const supabase = await createClient();

	const { data: auth, error: authErr } = await supabase.auth.getUser();

	if (authErr || !auth?.user) {
		return { error: "Není přihlášený uživatel", checkout: null };
	}

	const { data: profile } = await supabase
		.from("profiles")
		.select("stripe_customer_id")
		.eq("id", auth.user.id)
		.single();

	if (!profile || !profile.stripe_customer_id) {
		return {
			error: "U vašeho účtu chybí propojení se Stripe. Kontaktujte Martina.",
			checkout: null,
		};
	}

	if (!amount || amount < 15 || amount > 500000) {
		return {
			error: "Částka musí být mezi 15 až 500 000 Martinů",
			checkout: null,
		};
	}

	try {
		const session = await stripe.checkout.sessions.create({
			ui_mode: "embedded",
			payment_method_types: ["card"],
			line_items: [
				{
					price: process.env.NEXT_PUBLIC_STRIPE_BALANCE_PRICE_ID,
					quantity: amount,
				},
			],
			mode: "payment",
			return_url: `${process.env.NEXT_PUBLIC_URL}${returnPath}`,
			customer: profile.stripe_customer_id,
		});

		return {
			error: null,
			checkout: { id: session.id, client_secret: session.client_secret },
		};
	} catch (error) {
		console.error(error);
		return { error: "Něco se pokazilo při vytváření pokladny", checkout: null };
	}
}
