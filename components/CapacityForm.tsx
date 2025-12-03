"use client";

import { useFormStatus } from "react-dom";
import { useRef, useState } from "react";
import { createCapacity, updateCapacity, type ActionResult } from "@/app/actions/capacities";

type CapacityFormProps = {
  capacity?: {
    id: string;
    designerName: string;
    weeklyAvailableHours: number;
  };
  onSuccess?: () => void;
};

function SubmitButton({ isEdit }: { isEdit: boolean }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg bg-teal-500 px-4 py-2 text-sm font-medium text-slate-950 hover:bg-teal-400 disabled:opacity-50"
    >
      {pending ? "Saving..." : isEdit ? "Update" : "Add Designer"}
    </button>
  );
}

export function CapacityForm({ capacity, onSuccess }: CapacityFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState<string | null>(null);
  const isEdit = !!capacity;

  const handleAction = async (formData: FormData) => {
    setError(null);
    const result: ActionResult = isEdit
      ? await updateCapacity(formData)
      : await createCapacity(formData);

    if (result.success) {
      if (!isEdit) {
        formRef.current?.reset();
      }
      onSuccess?.();
    } else {
      setError(result.error || "An error occurred");
    }
  };

  return (
    <form ref={formRef} action={handleAction} className="space-y-4">
      {isEdit && <input type="hidden" name="id" value={capacity.id} />}

      {error && (
        <div className="rounded-lg bg-red-100 p-3 text-sm text-red-700 dark:bg-red-500/20 dark:text-red-300">
          {error}
        </div>
      )}

      {!isEdit && (
        <div>
          <label
            htmlFor="designerName"
            className="mb-1 block text-sm text-slate-600 dark:text-slate-400"
          >
            Designer Name *
          </label>
          <input
            type="text"
            id="designerName"
            name="designerName"
            required
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />
        </div>
      )}

      <div>
        <label
          htmlFor="weeklyAvailableHours"
          className="mb-1 block text-sm text-slate-600 dark:text-slate-400"
        >
          Weekly Available Hours *
        </label>
        <input
          type="number"
          id="weeklyAvailableHours"
          name="weeklyAvailableHours"
          required
          min="0"
          max="168"
          step="0.5"
          defaultValue={capacity?.weeklyAvailableHours ?? 40}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
        />
      </div>

      <div className="flex justify-end">
        <SubmitButton isEdit={isEdit} />
      </div>
    </form>
  );
}
