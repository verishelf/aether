import { plaid } from "@/lib/plaid";
import { createClient } from "@/lib/supabase/server";
import { decryptPlaidToken, isVerificationException, netWorthRange } from "@/lib/verification";
import { NextResponse } from "next/server";

function sum(values: Array<number | null | undefined>) { return values.reduce<number>((total, value) => total + (value ?? 0), 0); }

export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (isVerificationException(user.email)) return NextResponse.json({ verified: true, range: "25M+" });
  const { data: item } = await supabase.from("plaid_items").select("encrypted_access_token").eq("user_id", user.id).single();
  if (!item) return NextResponse.json({ error: "Connect an account first." }, { status: 400 });
  try {
    const accessToken = decryptPlaidToken(item.encrypted_access_token);
    const [{ data: accounts }, { data: investments }, { data: liabilities }] = await Promise.all([plaid.accountsGet({ access_token: accessToken }), plaid.investmentsHoldingsGet({ access_token: accessToken }), plaid.liabilitiesGet({ access_token: accessToken })]);
    const accountAssets = sum(accounts.accounts?.map((account) => account.balances?.current) ?? []);
    const investmentAssets = sum(investments.accounts?.map((account) => account.balances?.current) ?? []);
    const credit = sum(liabilities.liabilities?.credit?.map((entry) => entry.last_payment_amount) ?? []);
    const mortgage = sum((liabilities.liabilities?.mortgage ?? []).map((entry) => (entry as unknown as { principal_balance?: number | null; current_principal_balance?: number | null }).principal_balance ?? (entry as unknown as { current_principal_balance?: number | null }).current_principal_balance));
    const student = sum(liabilities.liabilities?.student?.map((entry) => entry.outstanding_interest_amount) ?? []);
    const netWorth = accountAssets + investmentAssets - credit - mortgage - student;
    const minimum = Number(process.env.NET_WORTH_MINIMUM ?? 5000000);
    if (netWorth < minimum) return NextResponse.json({ error: "We could not verify the required membership threshold." }, { status: 403 });
    const range = netWorthRange(netWorth);
    const { error } = await supabase.from("profiles").update({ net_worth_verified: true, net_worth_range: range, plaid_verified_at: new Date().toISOString(), updated_at: new Date().toISOString() }).eq("id", user.id);
    if (error) throw error;
    return NextResponse.json({ verified: true, range });
  } catch { return NextResponse.json({ error: "Verification could not be completed. You can request manual review." }, { status: 502 }); }
}
