"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const capacitySchema = z.object({
  designerName: z.string().min(1, "Designer name is required").max(200),
  weeklyAvailableHours: z.coerce.number().min(0).max(168, "Cannot exceed 168 hours per week")
});

const updateCapacitySchema = z.object({
  id: z.string().min(1),
  weeklyAvailableHours: z.coerce.number().min(0).max(168, "Cannot exceed 168 hours per week")
});

export type ActionResult = {
  success: boolean;
  error?: string;
  data?: unknown;
};

export async function createCapacity(formData: FormData): Promise<ActionResult> {
  const rawData = {
    designerName: formData.get("designerName"),
    weeklyAvailableHours: formData.get("weeklyAvailableHours")
  };

  const result = capacitySchema.safeParse(rawData);

  if (!result.success) {
    return {
      success: false,
      error: result.error.errors.map((e) => e.message).join(", ")
    };
  }

  const data = result.data;

  try {
    // For MVP, we use a default team
    let team = await prisma.team.findFirst();
    if (!team) {
      team = await prisma.team.create({
        data: { name: "Default Team" }
      });
    }

    // Check if designer already exists
    const existing = await prisma.designerCapacity.findUnique({
      where: {
        teamId_designerName: {
          teamId: team.id,
          designerName: data.designerName
        }
      }
    });

    if (existing) {
      return {
        success: false,
        error: `Designer "${data.designerName}" already exists`
      };
    }

    const capacity = await prisma.designerCapacity.create({
      data: {
        teamId: team.id,
        designerName: data.designerName,
        weeklyAvailableHours: data.weeklyAvailableHours
      }
    });

    revalidatePath("/");
    revalidatePath("/capacity");

    return { success: true, data: capacity };
  } catch (error) {
    console.error("Failed to create capacity:", error);
    return { success: false, error: "Failed to create capacity record" };
  }
}

export async function updateCapacity(formData: FormData): Promise<ActionResult> {
  const rawData = {
    id: formData.get("id"),
    weeklyAvailableHours: formData.get("weeklyAvailableHours")
  };

  const result = updateCapacitySchema.safeParse(rawData);

  if (!result.success) {
    return {
      success: false,
      error: result.error.errors.map((e) => e.message).join(", ")
    };
  }

  const { id, weeklyAvailableHours } = result.data;

  try {
    const capacity = await prisma.designerCapacity.update({
      where: { id },
      data: { weeklyAvailableHours }
    });

    revalidatePath("/");
    revalidatePath("/capacity");

    return { success: true, data: capacity };
  } catch (error) {
    console.error("Failed to update capacity:", error);
    return { success: false, error: "Failed to update capacity" };
  }
}

export async function deleteCapacity(id: string): Promise<ActionResult> {
  try {
    await prisma.designerCapacity.delete({
      where: { id }
    });

    revalidatePath("/");
    revalidatePath("/capacity");

    return { success: true };
  } catch (error) {
    console.error("Failed to delete capacity:", error);
    return { success: false, error: "Failed to delete capacity record" };
  }
}
