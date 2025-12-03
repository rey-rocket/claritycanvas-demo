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
  priority: z.string().optional(),
  dueDate: z.string().min(1, "Due date is required"),
  earlyReminderDate: z.string().optional(),
  estimatedScopedHours: z.coerce.number().min(0.5, "Hours must be at least 0.5"),
  mediaBudget: z.string().optional(),
  notes: z.string().optional()
});

const updateProjectSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1, "Title is required").max(200).optional(),
  client: z.string().min(1, "Client is required").max(200).optional(),
  instructionalDesigner: z.string().min(1, "Designer is required").max(200).optional(),
  status: z.enum([ProjectStatus.PLANNING, ProjectStatus.IN_PROGRESS, ProjectStatus.REVIEW, ProjectStatus.HANDOVER]).optional(),
  priority: z.string().optional(),
  dueDate: z.string().optional(),
  earlyReminderDate: z.string().optional(),
  estimatedScopedHours: z.coerce.number().min(0.5).optional(),
  hoursWorked: z.coerce.number().min(0).optional(),
  mediaBudget: z.string().optional(),
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
    priority: formData.get("priority"),
    dueDate: formData.get("dueDate"),
    earlyReminderDate: formData.get("earlyReminderDate"),
    estimatedScopedHours: formData.get("estimatedScopedHours"),
    mediaBudget: formData.get("mediaBudget"),
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
        priority: data.priority || null,
        dueDate: new Date(data.dueDate),
        earlyReminderDate: data.earlyReminderDate ? new Date(data.earlyReminderDate) : null,
        estimatedScopedHours: data.estimatedScopedHours,
        mediaBudget: data.mediaBudget || null,
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
    priority: formData.get("priority") || undefined,
    dueDate: formData.get("dueDate") || undefined,
    earlyReminderDate: formData.get("earlyReminderDate") || undefined,
    estimatedScopedHours: formData.get("estimatedScopedHours") || undefined,
    hoursWorked: formData.get("hoursWorked") || undefined,
    mediaBudget: formData.get("mediaBudget") || undefined,
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
    if (updateData.priority !== undefined) dataToUpdate.priority = updateData.priority || null;
    if (updateData.dueDate !== undefined) {
      dataToUpdate.dueDate = new Date(updateData.dueDate);
    }
    if (updateData.earlyReminderDate !== undefined) {
      dataToUpdate.earlyReminderDate = updateData.earlyReminderDate ? new Date(updateData.earlyReminderDate) : null;
    }
    if (updateData.estimatedScopedHours !== undefined) {
      dataToUpdate.estimatedScopedHours = updateData.estimatedScopedHours;
    }
    if (updateData.hoursWorked !== undefined) {
      dataToUpdate.hoursWorked = updateData.hoursWorked;
    }
    if (updateData.mediaBudget !== undefined) dataToUpdate.mediaBudget = updateData.mediaBudget || null;
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
