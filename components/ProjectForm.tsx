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
    dueDate: Date;
    estimatedScopedHours: number;
    hoursWorked: number;
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
      className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-slate-950 hover:bg-emerald-400 disabled:opacity-50"
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
        <div className="rounded-lg bg-red-500/20 p-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="title" className="mb-1 block text-sm text-slate-400">
          Title *
        </label>
        <input
          type="text"
          id="title"
          name="title"
          required
          defaultValue={project?.title}
          className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 focus:border-emerald-500 focus:outline-none"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="client" className="mb-1 block text-sm text-slate-400">
            Client *
          </label>
          <input
            type="text"
            id="client"
            name="client"
            required
            defaultValue={project?.client}
            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 focus:border-emerald-500 focus:outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="instructionalDesigner"
            className="mb-1 block text-sm text-slate-400"
          >
            Instructional Designer *
          </label>
          {designers.length > 0 ? (
            <select
              id="instructionalDesigner"
              name="instructionalDesigner"
              required
              defaultValue={project?.instructionalDesigner || ""}
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 focus:border-emerald-500 focus:outline-none"
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
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 focus:border-emerald-500 focus:outline-none"
            />
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <label htmlFor="status" className="mb-1 block text-sm text-slate-400">
            Status *
          </label>
          <select
            id="status"
            name="status"
            required
            defaultValue={project?.status || "PLANNING"}
            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 focus:border-emerald-500 focus:outline-none"
          >
            <option value="PLANNING">Planning</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="REVIEW">Review</option>
            <option value="HANDOVER">Handover</option>
          </select>
        </div>

        <div>
          <label htmlFor="dueDate" className="mb-1 block text-sm text-slate-400">
            Due Date *
          </label>
          <input
            type="date"
            id="dueDate"
            name="dueDate"
            required
            defaultValue={project ? formatDate(project.dueDate) : ""}
            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 focus:border-emerald-500 focus:outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="estimatedScopedHours"
            className="mb-1 block text-sm text-slate-400"
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
            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 focus:border-emerald-500 focus:outline-none"
          />
        </div>
      </div>

      {isEdit && (
        <div>
          <label
            htmlFor="hoursWorked"
            className="mb-1 block text-sm text-slate-400"
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
            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 focus:border-emerald-500 focus:outline-none"
          />
        </div>
      )}

      <div>
        <label htmlFor="notes" className="mb-1 block text-sm text-slate-400">
          Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={4}
          defaultValue={project?.notes || ""}
          className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 focus:border-emerald-500 focus:outline-none"
        />
      </div>

      <div className="flex justify-end gap-2">
        <SubmitButton isEdit={isEdit} />
      </div>
    </form>
  );
}
