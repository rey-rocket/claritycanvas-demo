import { prisma } from "@/lib/prisma";

/**
 * All capacity queries are now team-scoped
 */

export async function getAllDesignerCapacities(teamId: string) {
  return prisma.designerCapacity.findMany({
    where: { teamId },
    orderBy: { designerName: "asc" }
  });
}

export async function getDesignerCapacitiesForTeam(teamId: string) {
  return prisma.designerCapacity.findMany({
    where: { teamId },
    orderBy: { designerName: "asc" }
  });
}
