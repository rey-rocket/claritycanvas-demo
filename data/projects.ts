import { prisma } from "@/lib/prisma";
import { ProjectStatusType } from "@/lib/types";

/**
 * For MVP we ignore auth/team and just return all projects.
 * Later, pass a teamId/userId and scope queries appropriately.
 */

export type ProjectFilters = {
  designer?: string;
  status?: ProjectStatusType;
};

export async function getAllProjects(filters?: ProjectFilters) {
  const where: Record<string, unknown> = {};

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

export async function getProjectById(id: string) {
  return prisma.project.findUnique({
    where: { id },
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
