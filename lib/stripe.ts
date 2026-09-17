import Stripe from "stripe";

export function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) throw new Error("STRIPE_SECRET_KEY is not configured");
  return new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2026-08-26.dahlia" });
}

export const PRICE_IDS = {
  monthly: process.env.STRIPE_MONTHLY_PRICE_ID!,
  yearly: process.env.STRIPE_YEARLY_PRICE_ID!,
} as const;
