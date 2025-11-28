"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { ProjectStatus } from "@/lib/types";
import { z } from "zod";

const createProjectSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  client: z.string().min(1, "Client is required").max(200),
  instructionalDesigner: z.string().min(1, "Designer is required").max(200),
  status: z.enum([ProjectStatus.PLANNING, ProjectStatus.IN_PROGRESS, ProjectStatus.REVIEW, ProjectStatus.HANDOVER]),
  dueDate: z.string().min(1, "Due date is required"),
  estimatedScopedHours: z.coerce.number().min(0.5, "Hours must be at least 0.5"),
  notes: z.string().optional()
});

const updateProjectSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1, "Title is required").max(200).optional(),
  client: z.string().min(1, "Client is required").max(200).optional(),
  instructionalDesigner: z.string().min(1, "Designer is required").max(200).optional(),
  status: z.enum([ProjectStatus.PLANNING, ProjectStatus.IN_PROGRESS, ProjectStatus.REVIEW, ProjectStatus.HANDOVER]).optional(),
  dueDate: z.string().optional(),
  estimatedScopedHours: z.coerce.number().min(0.5).optional(),
  hoursWorked: z.coerce.number().min(0).optional(),
  notes: z.string().optional()
});

export type ActionResult = {
  success: boolean;
  error?: string;
  data?: unknown;
};

export async function createProject(formData: FormData): Promise<ActionResult> {
  const rawData = {
    title: formData.get("title"),
    client: formData.get("client"),
    instructionalDesigner: formData.get("instructionalDesigner"),
    status: formData.get("status"),
    dueDate: formData.get("dueDate"),
    estimatedScopedHours: formData.get("estimatedScopedHours"),
    notes: formData.get("notes")
  };

  const result = createProjectSchema.safeParse(rawData);

  if (!result.success) {
    return {
      success: false,
      error: result.error.errors.map((e) => e.message).join(", ")
    };
  }

  const data = result.data;

  try {
    // For MVP, we use a default team. In production, this would come from auth context
    let team = await prisma.team.findFirst();
    if (!team) {
      team = await prisma.team.create({
        data: { name: "Default Team" }
      });
    }

    const project = await prisma.project.create({
      data: {
        teamId: team.id,
        title: data.title,
        client: data.client,
        instructionalDesigner: data.instructionalDesigner,
        status: data.status,
        dueDate: new Date(data.dueDate),
        estimatedScopedHours: data.estimatedScopedHours,
        notes: data.notes || null,
        createdBy: "user" // In production, from auth context
      }
    });

    revalidatePath("/");
    revalidatePath("/projects");

    return { success: true, data: project };
  } catch (error) {
    console.error("Failed to create project:", error);
    return { success: false, error: "Failed to create project" };
  }
}

export async function updateProject(formData: FormData): Promise<ActionResult> {
  const rawData = {
    id: formData.get("id"),
    title: formData.get("title") || undefined,
    client: formData.get("client") || undefined,
    instructionalDesigner: formData.get("instructionalDesigner") || undefined,
    status: formData.get("status") || undefined,
    dueDate: formData.get("dueDate") || undefined,
    estimatedScopedHours: formData.get("estimatedScopedHours") || undefined,
    hoursWorked: formData.get("hoursWorked") || undefined,
    notes: formData.get("notes")
  };

  const result = updateProjectSchema.safeParse(rawData);

  if (!result.success) {
    return {
      success: false,
      error: result.error.errors.map((e) => e.message).join(", ")
    };
  }

  const { id, ...updateData } = result.data;

  try {
    const dataToUpdate: Record<string, unknown> = {};

    if (updateData.title !== undefined) dataToUpdate.title = updateData.title;
    if (updateData.client !== undefined) dataToUpdate.client = updateData.client;
    if (updateData.instructionalDesigner !== undefined) {
      dataToUpdate.instructionalDesigner = updateData.instructionalDesigner;
    }
    if (updateData.status !== undefined) dataToUpdate.status = updateData.status;
    if (updateData.dueDate !== undefined) {
      dataToUpdate.dueDate = new Date(updateData.dueDate);
    }
    if (updateData.estimatedScopedHours !== undefined) {
      dataToUpdate.estimatedScopedHours = updateData.estimatedScopedHours;
    }
    if (updateData.hoursWorked !== undefined) {
      dataToUpdate.hoursWorked = updateData.hoursWorked;
    }
    if (updateData.notes !== undefined) dataToUpdate.notes = updateData.notes || null;

    const project = await prisma.project.update({
      where: { id },
      data: dataToUpdate
    });

    revalidatePath("/");
    revalidatePath("/projects");
    revalidatePath(`/projects/${id}`);

    return { success: true, data: project };
  } catch (error) {
    console.error("Failed to update project:", error);
    return { success: false, error: "Failed to update project" };
  }
}

export async function deleteProject(id: string): Promise<ActionResult> {
  try {
    // First delete all tasks associated with the project
    await prisma.task.deleteMany({
      where: { projectId: id }
    });

    await prisma.project.delete({
      where: { id }
    });

    revalidatePath("/");
    revalidatePath("/projects");

    return { success: true };
  } catch (error) {
    console.error("Failed to delete project:", error);
    return { success: false, error: "Failed to delete project" };
  }
}
