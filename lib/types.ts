// Project status constants (SQLite doesn't support native enums)
export const ProjectStatus = {
  PLANNING: "PLANNING",
  IN_PROGRESS: "IN_PROGRESS",
  REVIEW: "REVIEW",
  HANDOVER: "HANDOVER"
} as const;

export type ProjectStatusType = typeof ProjectStatus[keyof typeof ProjectStatus];
