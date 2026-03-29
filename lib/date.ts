export function formatDate(isoDate: string) {
  // Deterministic across server/client to avoid hydration mismatches.
  // Use a fixed locale and UTC timezone.
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    timeZone: "UTC"
  }).format(new Date(isoDate));
}

