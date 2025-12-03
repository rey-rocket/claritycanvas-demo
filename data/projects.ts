import { prisma } from "@/lib/prisma";
import { ProjectStatusType } from "@/lib/types";

/**
 * All queries are now team-scoped for proper multi-tenancy
 */

export type ProjectFilters = {
  designer?: string;
  status?: ProjectStatusType;
};

export async function getAllProjects(teamId: string, filters?: ProjectFilters) {
  const where: Record<string, unknown> = {
    teamId // Always filter by team
  };

  if (filters?.designer) {
    where.instructionalDesigner = filters.designer;
  }
  if (filters?.status) {
    where.status = filters.status;
  }

  return prisma.project.findMany({
    where,
    orderBy: { dueDate: "asc" }
  });
}

export async function getProjectById(id: string, teamId: string) {
  return prisma.project.findFirst({
    where: {
      id,
      teamId // Ensure project belongs to team
    },
    include: { tasks: true }
  });
}

export async function getProjectsForTeam(teamId: string) {
  return prisma.project.findMany({
    where: { teamId },
    orderBy: { dueDate: "asc" }
  });
}

// Example placeholder for creating a project via server actions later
export type CreateProjectInput = {
  teamId: string;
  title: string;
  client: string;
  instructionalDesigner: string;
  status?: ProjectStatusType;
  dueDate: Date;
  estimatedScopedHours: number;
  notes?: string | null;
  createdBy: string;
};

export async function createProject(input: CreateProjectInput) {
  const {
    teamId,
    title,
    client,
    instructionalDesigner,
    status = "PLANNING" as const,
    dueDate,
    estimatedScopedHours,
    notes,
    createdBy
  } = input;

  return prisma.project.create({
    data: {
      teamId,
      title,
      client,
      instructionalDesigner,
      status,
      dueDate,
      estimatedScopedHours,
      notes,
      createdBy
    }
  });
}
