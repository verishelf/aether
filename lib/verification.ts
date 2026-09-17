import crypto from "node:crypto";

export { isVerificationException } from "@/lib/verification-exception";

function encryptionKey() {
  const value = process.env.PLAID_ACCESS_TOKEN_ENCRYPTION_KEY;
  if (!value) throw new Error("PLAID_ACCESS_TOKEN_ENCRYPTION_KEY is not configured");
  return crypto.createHash("sha256").update(value).digest();
}

export function encryptPlaidToken(token: string) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", encryptionKey(), iv);
  const encrypted = Buffer.concat([cipher.update(token, "utf8"), cipher.final()]);
  return [iv.toString("base64url"), cipher.getAuthTag().toString("base64url"), encrypted.toString("base64url")].join(".");
}

export function decryptPlaidToken(payload: string) {
  const [iv, authTag, encrypted] = payload.split(".");
  const decipher = crypto.createDecipheriv("aes-256-gcm", encryptionKey(), Buffer.from(iv, "base64url"));
  decipher.setAuthTag(Buffer.from(authTag, "base64url"));
  return Buffer.concat([decipher.update(Buffer.from(encrypted, "base64url")), decipher.final()]).toString("utf8");
}

export function netWorthRange(netWorth: number) {
  if (netWorth >= 25_000_000) return "25M+";
  if (netWorth >= 10_000_000) return "10M-25M";
  return "5M-10M";
}
