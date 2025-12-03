"use client";

import { useFormStatus } from "react-dom";
import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ProjectStatus, ProjectStatusType } from "@/lib/types";
import { createProject, updateProject, type ActionResult } from "@/app/actions/projects";
import { Info, Sparkles } from "lucide-react";

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

// Project templates for quick setup
const PROJECT_TEMPLATES = [
  {
    name: "Standard Course",
    description: "Typical e-learning course (10-20 hrs)",
    estimatedHours: 15,
    mediaBudget: "Videos: 3 hrs, Images: 1 hr"
  },
  {
    name: "Microlearning Module",
    description: "Short learning module (5-10 hrs)",
    estimatedHours: 7,
    mediaBudget: "Videos: 2 hrs"
  },
  {
    name: "Compliance Training",
    description: "Regulatory/compliance course (20-40 hrs)",
    estimatedHours: 30,
    mediaBudget: "Videos: 5 hrs, Interactive scenarios: 3 hrs"
  },
  {
    name: "Leadership Program",
    description: "Executive/leadership content (40+ hrs)",
    estimatedHours: 60,
    mediaBudget: "Videos: 8 hrs, Podcast Series: 10 hrs, Interactive: 5 hrs"
  }
];

function SubmitButton({ isEdit }: { isEdit: boolean }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-pill bg-gradient-cc-primary px-6 py-2.5 text-sm font-display font-semibold text-white shadow-btn-primary transition-all hover:shadow-btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {pending ? "Saving..." : isEdit ? "Update Project" : "Create Project"}
    </button>
  );
}

export function ProjectFormEnhanced({ project, designers = [], onSuccess }: ProjectFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [estimatedWeeks, setEstimatedWeeks] = useState(0);
  const isEdit = !!project;

  const handleAction = async (formData: FormData) => {
    setError(null);
    const result: ActionResult = isEdit
      ? await updateProject(formData)
      : await createProject(formData);

    if (result.success) {
      setSuccess(true);
      if (!isEdit) {
        formRef.current?.reset();
        // Redirect to projects list after 1.5 seconds
        setTimeout(() => {
          router.push("/projects");
        }, 1500);
      }
      onSuccess?.();
    } else {
      setError(result.error || "An error occurred");
    }
  };

  const handleTemplateSelect = (template: typeof PROJECT_TEMPLATES[0]) => {
    const form = formRef.current;
    if (!form) return;

    const hoursInput = form.querySelector<HTMLInputElement>('[name="estimatedScopedHours"]');
    const budgetInput = form.querySelector<HTMLInputElement>('[name="mediaBudget"]');

    if (hoursInput) hoursInput.value = String(template.estimatedHours);
    if (budgetInput) budgetInput.value = template.mediaBudget;

    calculateDuration(template.estimatedHours);
  };

  const calculateDuration = (hours: number) => {
    // Assuming 40 hrs per week average capacity
    const weeks = Math.ceil(hours / 40);
    setEstimatedWeeks(weeks);
  };

  const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const hours = parseFloat(e.target.value) || 0;
    calculateDuration(hours);
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  const getDefaultDueDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 14); // 2 weeks from now
    return date.toISOString().split("T")[0];
  };

  const getDefaultReminderDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 7); // 1 week from now
    return date.toISOString().split("T")[0];
  };

  useEffect(() => {
    if (project?.estimatedScopedHours) {
      calculateDuration(project.estimatedScopedHours);
    }
  }, [project]);

  return (
    <div className="space-y-6">
      {/* Templates Section - Only for new projects */}
      {!isEdit && (
        <div className="rounded-lg bg-gradient-to-br from-teal-50 to-lime-50 p-4 dark:from-teal-950/20 dark:to-lime-950/20">
          <div className="mb-3 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-teal-600 dark:text-teal-400" />
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Quick Start Templates
            </h3>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {PROJECT_TEMPLATES.map((template) => (
              <button
                key={template.name}
                type="button"
                onClick={() => handleTemplateSelect(template)}
                className="rounded-lg border border-teal-200 bg-white p-3 text-left transition-all hover:border-teal-400 hover:shadow-sm dark:border-teal-800 dark:bg-slate-800/50 dark:hover:border-teal-600"
              >
                <div className="font-medium text-sm text-slate-900 dark:text-slate-100">
                  {template.name}
                </div>
                <div className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                  {template.description}
                </div>
                <div className="mt-2 text-xs font-medium text-teal-600 dark:text-teal-400">
                  {template.estimatedHours} hours
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      <form ref={formRef} action={handleAction} className="space-y-6">
        {isEdit && <input type="hidden" name="id" value={project.id} />}

        {error && (
          <div className="rounded-lg bg-red-100 p-4 text-sm text-red-700 dark:bg-red-500/20 dark:text-red-300">
            <strong>Error:</strong> {error}
          </div>
        )}

        {success && (
          <div className="rounded-lg bg-green-100 p-4 text-sm text-green-700 dark:bg-green-500/20 dark:text-green-300">
            <strong>Success!</strong> {isEdit ? "Project updated successfully!" : "Project created! Redirecting..."}
          </div>
        )}

        {/* Project Details Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Project Details</h3>

          <div>
            <label htmlFor="title" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Project Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              placeholder="e.g., New Hire Onboarding 2024"
              defaultValue={project?.title}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="client" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Client/Department <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="client"
                name="client"
                required
                placeholder="e.g., HR Department"
                defaultValue={project?.client}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>

            <div>
              <label
                htmlFor="instructionalDesigner"
                className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Instructional Designer <span className="text-red-500">*</span>
              </label>
              {designers.length > 0 ? (
                <select
                  id="instructionalDesigner"
                  name="instructionalDesigner"
                  required
                  defaultValue={project?.instructionalDesigner || ""}
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
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
                  placeholder="Designer name"
                  defaultValue={project?.instructionalDesigner}
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                />
              )}
            </div>
          </div>
        </div>

        {/* Scope & Timeline Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Scope & Timeline</h3>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label htmlFor="status" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                id="status"
                name="status"
                required
                defaultValue={project?.status || "PLANNING"}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
              >
                <option value="PLANNING">📋 Planning</option>
                <option value="IN_PROGRESS">🚀 In Progress</option>
                <option value="REVIEW">👀 Review</option>
                <option value="HANDOVER">✅ Handover</option>
              </select>
            </div>

            <div>
              <label htmlFor="priority" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Priority
              </label>
              <select
                id="priority"
                name="priority"
                defaultValue={project?.priority || ""}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
              >
                <option value="">None</option>
                <option value="A">🔴 Priority A (High)</option>
                <option value="B">🟡 Priority B (Medium)</option>
                <option value="C">🔵 Priority C (Low)</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="estimatedScopedHours"
                className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Scoped Hours <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="estimatedScopedHours"
                name="estimatedScopedHours"
                required
                min="0.5"
                step="0.5"
                placeholder="15"
                defaultValue={project?.estimatedScopedHours}
                onChange={handleHoursChange}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
              />
              {estimatedWeeks > 0 && (
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  ≈ {estimatedWeeks} week{estimatedWeeks > 1 ? "s" : ""} at full capacity
                </p>
              )}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="dueDate" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Due Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="dueDate"
                name="dueDate"
                required
                defaultValue={project ? formatDate(project.dueDate) : getDefaultDueDate()}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>

            <div>
              <label htmlFor="earlyReminderDate" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Early Reminder Date
              </label>
              <input
                type="date"
                id="earlyReminderDate"
                name="earlyReminderDate"
                defaultValue={project?.earlyReminderDate ? formatDate(project.earlyReminderDate) : getDefaultReminderDate()}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
              />
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Get notified before the due date
              </p>
            </div>
          </div>

          {isEdit && (
            <div>
              <label
                htmlFor="hoursWorked"
                className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
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
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
              />
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Managed automatically via time tracking
              </p>
            </div>
          )}
        </div>

        {/* Additional Information Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Additional Information</h3>

          <div>
            <label htmlFor="mediaBudget" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Media Budget
            </label>
            <input
              type="text"
              id="mediaBudget"
              name="mediaBudget"
              placeholder="e.g., Videos: 4 hrs, Podcast Series: 10 hrs"
              defaultValue={project?.mediaBudget || ""}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
            />
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Specify media production requirements
            </p>
          </div>

          <div>
            <label htmlFor="notes" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={4}
              placeholder="Add any additional context, requirements, or stakeholder information..."
              defaultValue={project?.notes || ""}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-slate-200 pt-6 dark:border-slate-700">
          <div className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400">
            <Info className="h-4 w-4 shrink-0 mt-0.5" />
            <span>Fields marked with <span className="text-red-500">*</span> are required</span>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="rounded-lg border border-slate-300 px-6 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <SubmitButton isEdit={isEdit} />
          </div>
        </div>
      </form>
    </div>
  );
}
