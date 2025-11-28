import { prisma } from "@/lib/prisma";

export async function getAllDesignerCapacities() {
  return prisma.designerCapacity.findMany({
    orderBy: { designerName: "asc" }
  });
}

export async function getDesignerCapacitiesForTeam(teamId: string) {
  return prisma.designerCapacity.findMany({
    where: { teamId },
    orderBy: { designerName: "asc" }
  });
}
