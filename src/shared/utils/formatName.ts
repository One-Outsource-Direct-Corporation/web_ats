export default function formatName(name?: string | null) {
  const normalized = typeof name === "string" ? name : "";

  return normalized
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function formatNameBySpace(name?: string | null) {
  const normalized = typeof name === "string" ? name : "";

  return normalized
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function formatForJSON(name?: string | null) {
  const normalized = typeof name === "string" ? name : "";
  return normalized.toLowerCase().trim().replace(/ /g, "_");
}
