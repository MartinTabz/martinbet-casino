import Stripe from "stripe";
import { stripe } from "@/utils/stripe/config";
import { getServiceSupabase } from "@/utils/supabase/service";

const relevantEvents = new Set(["checkout.session.completed"]);

const supabase = getServiceSupabase();

export async function POST(req: Request) {
	const body = await req.text();
	const sig = req.headers.get("stripe-signature") as string;
	const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
	let event: Stripe.Event;

	try {
		if (!sig || !webhookSecret)
			return new Response("Webhook secret not found.", { status: 400 });
		event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
	} catch (error) {
		console.error(error);
		return new Response(`Webhook Error`, { status: 400 });
	}

	if (relevantEvents.has(event.type)) {
		try {
			switch (event.type) {
				case "checkout.session.completed":
					const obj = event.data.object;
					await handleBalanceDeposit(obj);
					break;
				default:
					throw new Error("Unhandled relevant event!");
			}
		} catch (error) {
			console.error(error);
			return new Response(
				"Webhook handler failed. View your Next.js function logs.",
				{
					status: 400,
				}
			);
		}
	} else {
		return new Response(`Unsupported event type: ${event.type}`, {
			status: 400,
		});
	}
	return new Response(JSON.stringify({ received: true }));
}

async function handleBalanceDeposit(obj: Stripe.Checkout.Session) {
	console.log(obj);
	if (!obj.customer) {
		throw new Error("There is no object in digital product checkout object");
	}

	const { data: profile } = await supabase
		.from("profiles")
		.select("id,balance")
		.eq("stripe_customer_id", obj.customer)
		.single();

	if (!profile || !profile.id) {
		throw new Error(
			`Stripe customer with ID: ${obj.customer} does not have corresponding profile in database`
		);
	}

	const newBalance = profile.balance + obj.amount_total;

	const { error } = await supabase
		.from("profiles")
		.update({ balance: newBalance })
		.eq("id", profile.id)
		.select();

	if (error) {
		throw new Error(`Was not able to top up new balance.`);
	}

	return;
}
