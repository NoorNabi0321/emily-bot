export const PROJECT_STATUSES = [
  "Review",
  "Shop Drawings",
  "Fabrication",
  "On-Site",
  "Installed",
  "Inspection Passed"
] as const;

export type ProjectStatus =
  typeof PROJECT_STATUSES[number];