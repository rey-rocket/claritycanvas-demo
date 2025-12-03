"use client";

import { useFormStatus } from "react-dom";
import { useRef, useState } from "react";
import { ProjectStatus, ProjectStatusType } from "@/lib/types";
import { createProject, updateProject, type ActionResult } from "@/app/actions/projects";

type ProjectFormProps = {
  project?: {
    id: string;
    title: string;
    client: string;
    instructionalDesigner: string;
    status: string;
    priority: string | null;
    dueDate: Date;
    earlyReminderDate: Date | null;
    estimatedScopedHours: number;
    hoursWorked: number;
    mediaBudget: string | null;
    notes: string | null;
  };
  designers?: string[];
  onSuccess?: () => void;
};

function SubmitButton({ isEdit }: { isEdit: boolean }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="btn-primary rounded-pill bg-gradient-cc-primary px-8 py-3 text-sm font-display font-semibold text-white shadow-btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {pending ? "Saving..." : isEdit ? "Update Project" : "Create Project"}
    </button>
  );
}

export function ProjectForm({ project, designers = [], onSuccess }: ProjectFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState<string | null>(null);
  const isEdit = !!project;

  const handleAction = async (formData: FormData) => {
    setError(null);
    const result: ActionResult = isEdit
      ? await updateProject(formData)
      : await createProject(formData);

    if (result.success) {
      if (!isEdit) {
        formRef.current?.reset();
      }
      onSuccess?.();
    } else {
      setError(result.error || "An error occurred");
    }
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  return (
    <form ref={formRef} action={handleAction} className="space-y-4">
      {isEdit && <input type="hidden" name="id" value={project.id} />}

      {error && (
        <div className="rounded-lg bg-cc-red-pill/10 p-4 text-sm font-medium text-cc-red-pill border border-cc-red-pill/20">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="title" className="mb-2 block text-sm font-medium text-cc-text-muted">
          Title *
        </label>
        <input
          type="text"
          id="title"
          name="title"
          required
          defaultValue={project?.title}
          className="w-full rounded-lg border-2 border-cc-border-subtle bg-cc-surface px-4 py-2.5 text-sm text-cc-text-main transition-all focus:border-cc-teal focus:outline-none focus:ring-2 focus:ring-cc-teal/20"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="client" className="mb-2 block text-sm font-medium text-cc-text-muted">
            Client *
          </label>
          <input
            type="text"
            id="client"
            name="client"
            required
            defaultValue={project?.client}
            className="w-full rounded-lg border-2 border-cc-border-subtle bg-cc-surface px-4 py-2.5 text-sm text-cc-text-main transition-all focus:border-cc-teal focus:outline-none focus:ring-2 focus:ring-cc-teal/20"
          />
        </div>

        <div>
          <label
            htmlFor="instructionalDesigner"
            className="mb-1 block text-sm font-medium text-cc-text-muted"
          >
            Instructional Designer *
          </label>
          {designers.length > 0 ? (
            <select
              id="instructionalDesigner"
              name="instructionalDesigner"
              required
              defaultValue={project?.instructionalDesigner || ""}
              className="w-full rounded-lg border-2 border-cc-border-subtle bg-cc-surface px-4 py-2.5 text-sm text-cc-text-main transition-all focus:border-cc-teal focus:outline-none focus:ring-2 focus:ring-cc-teal/20"
            >
              <option value="">Select designer...</option>
              {designers.map((designer) => (
                <option key={designer} value={designer}>
                  {designer}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              id="instructionalDesigner"
              name="instructionalDesigner"
              required
              defaultValue={project?.instructionalDesigner}
              className="w-full rounded-lg border-2 border-cc-border-subtle bg-cc-surface px-4 py-2.5 text-sm text-cc-text-main transition-all focus:border-cc-teal focus:outline-none focus:ring-2 focus:ring-cc-teal/20"
            />
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <label htmlFor="status" className="mb-1 block text-sm font-medium text-cc-text-muted">
            Status *
          </label>
          <select
            id="status"
            name="status"
            required
            defaultValue={project?.status || "PLANNING"}
            className="w-full rounded-lg border-2 border-cc-border-subtle bg-cc-surface px-4 py-2.5 text-sm text-cc-text-main transition-all focus:border-cc-teal focus:outline-none focus:ring-2 focus:ring-cc-teal/20"
          >
            <option value="PLANNING">Planning</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="REVIEW">Review</option>
            <option value="HANDOVER">Handover</option>
          </select>
        </div>

        <div>
          <label htmlFor="priority" className="mb-1 block text-sm font-medium text-cc-text-muted">
            Priority
          </label>
          <select
            id="priority"
            name="priority"
            defaultValue={project?.priority || ""}
            className="w-full rounded-lg border-2 border-cc-border-subtle bg-cc-surface px-4 py-2.5 text-sm text-cc-text-main transition-all focus:border-cc-teal focus:outline-none focus:ring-2 focus:ring-cc-teal/20"
          >
            <option value="">None</option>
            <option value="A">Priority A</option>
            <option value="B">Priority B</option>
            <option value="C">Priority C</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="estimatedScopedHours"
            className="mb-1 block text-sm font-medium text-cc-text-muted"
          >
            Scoped Hours *
          </label>
          <input
            type="number"
            id="estimatedScopedHours"
            name="estimatedScopedHours"
            required
            min="0.5"
            step="0.5"
            defaultValue={project?.estimatedScopedHours}
            className="w-full rounded-lg border-2 border-cc-border-subtle bg-cc-surface px-4 py-2.5 text-sm text-cc-text-main transition-all focus:border-cc-teal focus:outline-none focus:ring-2 focus:ring-cc-teal/20"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="dueDate" className="mb-1 block text-sm font-medium text-cc-text-muted">
            Due Date *
          </label>
          <input
            type="date"
            id="dueDate"
            name="dueDate"
            required
            defaultValue={project ? formatDate(project.dueDate) : ""}
            className="w-full rounded-lg border-2 border-cc-border-subtle bg-cc-surface px-4 py-2.5 text-sm text-cc-text-main transition-all focus:border-cc-teal focus:outline-none focus:ring-2 focus:ring-cc-teal/20"
          />
        </div>

        <div>
          <label htmlFor="earlyReminderDate" className="mb-1 block text-sm font-medium text-cc-text-muted">
            Early Reminder Date
          </label>
          <input
            type="date"
            id="earlyReminderDate"
            name="earlyReminderDate"
            defaultValue={project?.earlyReminderDate ? formatDate(project.earlyReminderDate) : ""}
            className="w-full rounded-lg border-2 border-cc-border-subtle bg-cc-surface px-4 py-2.5 text-sm text-cc-text-main transition-all focus:border-cc-teal focus:outline-none focus:ring-2 focus:ring-cc-teal/20"
          />
        </div>
      </div>

      {isEdit && (
        <div>
          <label
            htmlFor="hoursWorked"
            className="mb-1 block text-sm font-medium text-cc-text-muted"
          >
            Hours Worked
          </label>
          <input
            type="number"
            id="hoursWorked"
            name="hoursWorked"
            min="0"
            step="0.5"
            defaultValue={project.hoursWorked}
            className="w-full rounded-lg border-2 border-cc-border-subtle bg-cc-surface px-4 py-2.5 text-sm text-cc-text-main transition-all focus:border-cc-teal focus:outline-none focus:ring-2 focus:ring-cc-teal/20"
          />
        </div>
      )}

      <div>
        <label htmlFor="mediaBudget" className="mb-1 block text-sm font-medium text-cc-text-muted">
          Media Budget
        </label>
        <input
          type="text"
          id="mediaBudget"
          name="mediaBudget"
          placeholder="e.g., Videos: 4 hrs, Podcast Series: 10 hrs"
          defaultValue={project?.mediaBudget || ""}
          className="w-full rounded-lg border-2 border-cc-border-subtle bg-cc-surface px-4 py-2.5 text-sm text-cc-text-main transition-all focus:border-cc-teal focus:outline-none focus:ring-2 focus:ring-cc-teal/20"
        />
      </div>

      <div>
        <label htmlFor="notes" className="mb-1 block text-sm font-medium text-cc-text-muted">
          Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={4}
          defaultValue={project?.notes || ""}
          className="w-full rounded-lg border-2 border-cc-border-subtle bg-cc-surface px-4 py-2.5 text-sm text-cc-text-main transition-all focus:border-cc-teal focus:outline-none focus:ring-2 focus:ring-cc-teal/20"
        />
      </div>

      <div className="flex justify-end gap-2">
        <SubmitButton isEdit={isEdit} />
      </div>
    </form>
  );
}
