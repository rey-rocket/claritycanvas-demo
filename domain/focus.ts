import type { Project } from "@prisma/client";
import { calculateRiskFlags } from "./risk";

export function selectFocusProjectForDesigner(
  projectsForDesigner: Project[]
): Project | null {
  if (!projectsForDesigner.length) return null;

  const scored = projectsForDesigner
    .filter((p) => p.status !== "HANDOVER")
    .map((project) => {
      const risk = calculateRiskFlags(project);
      const today = new Date();
      const diffMs = project.dueDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

      let score = 0;
      if (risk.isAtRisk) score += 100;
      if (risk.isOverBudget) score += 50;
      score += Math.max(0, 30 - diffDays);

      return { project, score };
    });

  if (!scored.length) return null;

  scored.sort((a, b) => b.score - a.score);
  return scored[0].project;
}
