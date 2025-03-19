import { getServiceSupabase } from "@/utils/supabase/service";
import { stripe } from "@/utils/stripe/config";
import { type NextRequest } from "next/server";

export async function POST(req: NextRequest) {
	const searchParams = req.nextUrl.searchParams;
	const key = searchParams.get("api-route-secret");

	if (key !== process.env.NEW_STRIPE_CUSTOMER_API_KEY!) {
		return new Response("You are not allowed to call this API", {
			status: 401,
		});
	}

	const { record } = await req.json();

	const customer = await stripe.customers.create({
		email: record.email,
		name: record.name,
	});

	const supabase = getServiceSupabase();

	await supabase
		.from("profiles")
		.update({ stripe_customer: customer.id })
		.eq("id", record.id);

	return new Response(`Stripe customer created: ${customer.id}`);
}
