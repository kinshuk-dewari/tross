export function extractPublicIdentifier(url: string): string {
  const parsed = new URL(url);
  const parts = parsed.pathname.split("/").filter(Boolean);
  if (parts.length < 2 || parts[0].toLowerCase() !== "in")
    throw new Error("Invalid LinkedIn profile URL");
  return decodeURIComponent(parts[1]);
}
