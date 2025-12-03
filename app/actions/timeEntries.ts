"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createTimeEntrySchema = z.object({
  projectId: z.string().min(1),
  designerName: z.string().min(1),
  hours: z.coerce.number().min(0.1, "Hours must be at least 0.1"),
  date: z.string().min(1),
  description: z.string().optional()
});

const startTimerSchema = z.object({
  projectId: z.string().min(1),
  designerName: z.string().min(1),
  description: z.string().optional()
});

export type ActionResult = {
  success: boolean;
  error?: string;
  data?: unknown;
};

/**
 * Add a manual time entry
 */
export async function createTimeEntry(formData: FormData): Promise<ActionResult> {
  const rawData = {
    projectId: formData.get("projectId"),
    designerName: formData.get("designerName"),
    hours: formData.get("hours"),
    date: formData.get("date"),
    description: formData.get("description") || undefined
  };

  const result = createTimeEntrySchema.safeParse(rawData);

  if (!result.success) {
    return {
      success: false,
      error: result.error.errors.map((e) => e.message).join(", ")
    };
  }

  const data = result.data;

  try {
    const timeEntry = await prisma.timeEntry.create({
      data: {
        projectId: data.projectId,
        designerName: data.designerName,
        hours: data.hours,
        date: new Date(data.date),
        description: data.description,
        isTimerEntry: false
      }
    });

    // Update project hours worked
    await updateProjectHours(data.projectId);

    revalidatePath(`/projects/${data.projectId}`);
    revalidatePath("/projects");
    revalidatePath("/");

    return { success: true, data: timeEntry };
  } catch (error) {
    console.error("Failed to create time entry:", error);
    return { success: false, error: "Failed to create time entry" };
  }
}

/**
 * Start a timer for a project
 */
export async function startTimer(formData: FormData): Promise<ActionResult> {
  const rawData = {
    projectId: formData.get("projectId"),
    designerName: formData.get("designerName"),
    description: formData.get("description") || undefined
  };

  const result = startTimerSchema.safeParse(rawData);

  if (!result.success) {
    return {
      success: false,
      error: result.error.errors.map((e) => e.message).join(", ")
    };
  }

  const data = result.data;

  try {
    // Check if there's already an active timer for this designer
    const activeTimer = await prisma.timeEntry.findFirst({
      where: {
        designerName: data.designerName,
        isTimerEntry: true,
        timerEndedAt: null
      }
    });

    if (activeTimer) {
      return {
        success: false,
        error: "You already have an active timer. Please stop it first."
      };
    }

    const timeEntry = await prisma.timeEntry.create({
      data: {
        projectId: data.projectId,
        designerName: data.designerName,
        description: data.description,
        hours: 0,
        date: new Date(),
        isTimerEntry: true,
        timerStartedAt: new Date()
      }
    });

    revalidatePath(`/projects/${data.projectId}`);
    revalidatePath("/projects");

    return { success: true, data: timeEntry };
  } catch (error) {
    console.error("Failed to start timer:", error);
    return { success: false, error: "Failed to start timer" };
  }
}

/**
 * Stop an active timer
 */
export async function stopTimer(timerId: string): Promise<ActionResult> {
  try {
    const timeEntry = await prisma.timeEntry.findUnique({
      where: { id: timerId }
    });

    if (!timeEntry || !timeEntry.isTimerEntry || timeEntry.timerEndedAt) {
      return { success: false, error: "Timer not found or already stopped" };
    }

    const now = new Date();
    const durationMs = now.getTime() - (timeEntry.timerStartedAt?.getTime() || now.getTime());
    const hours = Math.round((durationMs / (1000 * 60 * 60)) * 100) / 100; // Round to 2 decimals

    const updated = await prisma.timeEntry.update({
      where: { id: timerId },
      data: {
        timerEndedAt: now,
        hours: Math.max(0.1, hours) // Minimum 0.1 hours
      }
    });

    // Update project hours worked
    await updateProjectHours(timeEntry.projectId);

    revalidatePath(`/projects/${timeEntry.projectId}`);
    revalidatePath("/projects");
    revalidatePath("/");

    return { success: true, data: updated };
  } catch (error) {
    console.error("Failed to stop timer:", error);
    return { success: false, error: "Failed to stop timer" };
  }
}

/**
 * Delete a time entry
 */
export async function deleteTimeEntry(id: string, projectId: string): Promise<ActionResult> {
  try {
    await prisma.timeEntry.delete({
      where: { id }
    });

    // Update project hours worked
    await updateProjectHours(projectId);

    revalidatePath(`/projects/${projectId}`);
    revalidatePath("/projects");
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Failed to delete time entry:", error);
    return { success: false, error: "Failed to delete time entry" };
  }
}

/**
 * Helper function to recalculate and update project hours worked from time entries
 */
async function updateProjectHours(projectId: string) {
  const timeEntries = await prisma.timeEntry.findMany({
    where: { projectId }
  });

  const totalHours = timeEntries.reduce((sum, entry) => sum + entry.hours, 0);

  await prisma.project.update({
    where: { id: projectId },
    data: { hoursWorked: totalHours }
  });
}

/**
 * Get active timer for a designer
 */
export async function getActiveTimer(designerName: string) {
  return prisma.timeEntry.findFirst({
    where: {
      designerName,
      isTimerEntry: true,
      timerEndedAt: null
    },
    include: {
      project: true
    }
  });
}
