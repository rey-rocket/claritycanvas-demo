import type { Project, DesignerCapacity } from "@prisma/client";

export type WorkloadSummary = {
  designerName: string;
  capacity: number;
  estimatedHours: number;
  hoursRemaining: number;
  activeProjects: Project[];
};

export type TeamWorkloadSummary = {
  designers: WorkloadSummary[];
  totalCapacity: number;
  totalEstimatedHours: number;
  totalHoursRemaining: number;
};

export function calculateTeamWorkload(
  projects: Project[],
  capacities: DesignerCapacity[],
  defaultCapacity = 40
): TeamWorkloadSummary {
  const byDesigner = new Map<string, WorkloadSummary>();

  for (const project of projects) {
    if (project.status === "HANDOVER") continue;

    const name = project.instructionalDesigner;
    const capacityRecord = capacities.find(
      (c) => c.designerName === name
    );
    const capacity = capacityRecord?.weeklyAvailableHours ?? defaultCapacity;

    if (!byDesigner.has(name)) {
      byDesigner.set(name, {
        designerName: name,
        capacity,
        estimatedHours: 0,
        hoursRemaining: 0,
        activeProjects: []
      });
    }

    const summary = byDesigner.get(name)!;
    summary.estimatedHours += project.estimatedScopedHours;
    summary.activeProjects.push(project);
  }

  let totalCapacity = 0;
  let totalEstimatedHours = 0;

  for (const summary of byDesigner.values()) {
    summary.hoursRemaining = summary.capacity - summary.estimatedHours;
    totalCapacity += summary.capacity;
    totalEstimatedHours += summary.estimatedHours;
  }

  const totalHoursRemaining = totalCapacity - totalEstimatedHours;

  return {
    designers: Array.from(byDesigner.values()).sort(
      (a, b) => b.estimatedHours - a.estimatedHours
    ),
    totalCapacity,
    totalEstimatedHours,
    totalHoursRemaining
  };
}
