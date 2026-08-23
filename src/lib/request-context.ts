import { headers } from "next/headers";

export async function requestClientIdentifier(): Promise<string> {
  const values = await headers();
  const forwarded = values.get("x-forwarded-for")?.split(",")[0]?.trim();
  const ip = forwarded || values.get("x-real-ip") || "unknown";
  return ip.slice(0, 128);
}

export async function requestFingerprint(scope: string): Promise<string> {
  return `${scope}:${await requestClientIdentifier()}`;
}
