const exceptionEmail = "frankposada4@icloud.com";

export function isVerificationException(email?: string | null) {
  return email?.toLowerCase() === exceptionEmail;
}
