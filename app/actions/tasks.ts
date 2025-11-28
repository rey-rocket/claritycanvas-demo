"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createTaskSchema = z.object({
  projectId: z.string().min(1),
  name: z.string().min(1, "Task name is required").max(500),
  estimatedHours: z.coerce.number().min(0).optional()
});

const toggleTaskSchema = z.object({
  id: z.string().min(1),
  completed: z.coerce.boolean()
});

export type ActionResult = {
  success: boolean;
  error?: string;
  data?: unknown;
};

export async function createTask(formData: FormData): Promise<ActionResult> {
  const rawData = {
    projectId: formData.get("projectId"),
    name: formData.get("name"),
    estimatedHours: formData.get("estimatedHours") || undefined
  };

  const result = createTaskSchema.safeParse(rawData);

  if (!result.success) {
    return {
      success: false,
      error: result.error.errors.map((e) => e.message).join(", ")
    };
  }

  const data = result.data;

  try {
    const task = await prisma.task.create({
      data: {
        projectId: data.projectId,
        name: data.name,
        estimatedHours: data.estimatedHours || null,
        completed: false
      }
    });

    revalidatePath(`/projects/${data.projectId}`);

    return { success: true, data: task };
  } catch (error) {
    console.error("Failed to create task:", error);
    return { success: false, error: "Failed to create task" };
  }
}

export async function toggleTask(formData: FormData): Promise<ActionResult> {
  const rawData = {
    id: formData.get("id"),
    completed: formData.get("completed")
  };

  const result = toggleTaskSchema.safeParse(rawData);

  if (!result.success) {
    return {
      success: false,
      error: result.error.errors.map((e) => e.message).join(", ")
    };
  }

  const { id, completed } = result.data;

  try {
    const task = await prisma.task.update({
      where: { id },
      data: { completed }
    });

    // Get project ID to revalidate the correct path
    const taskWithProject = await prisma.task.findUnique({
      where: { id },
      select: { projectId: true }
    });

    if (taskWithProject) {
      revalidatePath(`/projects/${taskWithProject.projectId}`);
    }

    return { success: true, data: task };
  } catch (error) {
    console.error("Failed to toggle task:", error);
    return { success: false, error: "Failed to update task" };
  }
}

export async function deleteTask(id: string, projectId: string): Promise<ActionResult> {
  try {
    await prisma.task.delete({
      where: { id }
    });

    revalidatePath(`/projects/${projectId}`);

    return { success: true };
  } catch (error) {
    console.error("Failed to delete task:", error);
    return { success: false, error: "Failed to delete task" };
  }
}
