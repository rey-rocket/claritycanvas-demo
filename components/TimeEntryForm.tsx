"use client";

import { useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { createTimeEntry, type ActionResult } from "@/app/actions/timeEntries";

type TimeEntryFormProps = {
  projectId: string;
  designerName: string;
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg bg-teal-500 px-4 py-2 text-sm font-medium text-slate-950 hover:bg-teal-400 disabled:opacity-50"
    >
      {pending ? "Adding..." : "Add Time"}
    </button>
  );
}

export function TimeEntryForm({ projectId, designerName }: TimeEntryFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAction = async (formData: FormData) => {
    setError(null);
    const result: ActionResult = await createTimeEntry(formData);

    if (result.success) {
      formRef.current?.reset();
      // Set date to today by default
      const dateInput = formRef.current?.querySelector<HTMLInputElement>('[name="date"]');
      if (dateInput) {
        dateInput.value = new Date().toISOString().split("T")[0];
      }
    } else {
      setError(result.error || "An error occurred");
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <form ref={formRef} action={handleAction} className="space-y-3">
      <input type="hidden" name="projectId" value={projectId} />
      <input type="hidden" name="designerName" value={designerName} />

      {error && (
        <div className="rounded-lg bg-red-100 p-3 text-sm text-red-700 dark:bg-red-500/20 dark:text-red-300">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="hours" className="mb-1 block text-sm text-slate-600 dark:text-slate-400">
            Hours *
          </label>
          <input
            type="number"
            id="hours"
            name="hours"
            required
            min="0.1"
            step="0.1"
            placeholder="2.5"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />
        </div>

        <div>
          <label htmlFor="date" className="mb-1 block text-sm text-slate-600 dark:text-slate-400">
            Date *
          </label>
          <input
            type="date"
            id="date"
            name="date"
            required
            defaultValue={today}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />
        </div>
      </div>

      <div>
        <label htmlFor="description" className="mb-1 block text-sm text-slate-600 dark:text-slate-400">
          Description (optional)
        </label>
        <input
          type="text"
          id="description"
          name="description"
          placeholder="What did you work on?"
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
        />
      </div>

      <div className="flex justify-end">
        <SubmitButton />
      </div>
    </form>
  );
}
