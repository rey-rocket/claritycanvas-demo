import type { Project } from "@prisma/client";

export type RiskFlags = {
  isOverBudget: boolean;
  isAtRisk: boolean;
  reason: string | null;
};

export function calculateRiskFlags(
  project: Project,
  options?: { daysThreshold?: number; minRemainingHours?: number }
): RiskFlags {
  const daysThreshold = options?.daysThreshold ?? 7;
  const minRemainingHours = options?.minRemainingHours ?? 8;

  const scopedHours = project.estimatedScopedHours;
  const remainingHours = scopedHours - project.hoursWorked;
  const isOverBudget = project.hoursWorked > scopedHours;

  const today = new Date();
  const diffMs = project.dueDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  const isActive =
    project.status !== "HANDOVER" && diffDays >= 0;

  const isAtRisk =
    isActive &&
    diffDays <= daysThreshold &&
    remainingHours > minRemainingHours &&
    !isOverBudget;

  let reason: string | null = null;
  if (isOverBudget) {
    reason = `Hours worked (${project.hoursWorked.toFixed(
      1
    )}) exceed scoped hours (${scopedHours.toFixed(1)}).`;
  } else if (isAtRisk) {
    reason = `Due in ${diffDays} day(s) with ${remainingHours.toFixed(
      1
    )} hours remaining.`;
  }

  return {
    isOverBudget,
    isAtRisk,
    reason
  };
}
