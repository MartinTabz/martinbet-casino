import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
	appInfo: {
		name: "MartinBet Web",
		version: "0.0.0",
		url: "https://github.com/MartinTabz/martinbet-casino.git",
	},
});
