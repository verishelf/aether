import { Configuration, CountryCode, PlaidApi, PlaidEnvironments, Products } from "plaid";

const configuration = new Configuration({
  basePath: PlaidEnvironments[process.env.PLAID_ENV === "production" ? "production" : "sandbox"],
  baseOptions: { headers: { "PLAID-CLIENT-ID": process.env.PLAID_CLIENT_ID ?? "", "PLAID-SECRET": process.env.PLAID_SECRET ?? "" } },
});

export const plaid = new PlaidApi(configuration);
export const plaidProducts = [Products.Assets, Products.Investments, Products.Liabilities];
export const plaidCountryCodes = [CountryCode.Us];
