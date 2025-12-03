"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { updateCapacity, deleteCapacity } from "@/app/actions/capacities";
import { Pencil, Trash2, Check, X } from "lucide-react";

type Capacity = {
  id: string;
  designerName: string;
  weeklyAvailableHours: number;
};

type CapacityTableProps = {
  capacities: Capacity[];
};

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="text-teal-600 hover:text-teal-700 disabled:opacity-50 dark:text-teal-400 dark:hover:text-teal-300"
      title="Save"
    >
      <Check className="h-4 w-4" />
    </button>
  );
}

function CapacityRow({ capacity }: { capacity: Capacity }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [hours, setHours] = useState(capacity.weeklyAvailableHours);

  const handleUpdate = async (formData: FormData) => {
    const result = await updateCapacity(formData);
    if (result.success) {
      setIsEditing(false);
    }
  };

  const handleDelete = async () => {
    if (isDeleting) return;
    if (!confirm(`Delete capacity record for ${capacity.designerName}?`)) return;
    setIsDeleting(true);
    await deleteCapacity(capacity.id);
  };

  if (isEditing) {
    return (
      <tr className="border-t border-slate-200 dark:border-slate-800">
        <td className="px-4 py-2 text-slate-900 dark:text-slate-100">{capacity.designerName}</td>
        <td className="px-4 py-2">
          <form action={handleUpdate} className="flex items-center gap-2">
            <input type="hidden" name="id" value={capacity.id} />
            <input
              type="number"
              name="weeklyAvailableHours"
              value={hours}
              onChange={(e) => setHours(Number(e.target.value))}
              min="0"
              max="168"
              step="0.5"
              className="w-24 rounded border border-slate-300 bg-white px-2 py-1 text-sm text-slate-900 focus:border-teal-500 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
            />
            <SaveButton />
            <button
              type="button"
              onClick={() => {
                setHours(capacity.weeklyAvailableHours);
                setIsEditing(false);
              }}
              className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
              title="Cancel"
            >
              <X className="h-4 w-4" />
            </button>
          </form>
        </td>
        <td className="px-4 py-2" />
      </tr>
    );
  }

  return (
    <tr className="border-t border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900">
      <td className="px-4 py-2 text-slate-900 dark:text-slate-100">{capacity.designerName}</td>
      <td className="px-4 py-2 text-slate-900 dark:text-slate-100">{capacity.weeklyAvailableHours.toFixed(1)}</td>
      <td className="px-4 py-2">
        <div className="flex gap-2">
          <button
            onClick={() => setIsEditing(true)}
            className="text-slate-600 hover:text-teal-600 dark:text-slate-400 dark:hover:text-teal-400"
            title="Edit"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-slate-600 hover:text-red-600 disabled:opacity-50 dark:text-slate-400 dark:hover:text-red-400"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}

export function CapacityTable({ capacities }: CapacityTableProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/60">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-100 text-slate-600 dark:bg-slate-900/80 dark:text-slate-400">
          <tr>
            <th className="px-4 py-2 text-left">Designer</th>
            <th className="px-4 py-2 text-left">Weekly hours</th>
            <th className="w-24 px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {capacities.map((cap) => (
            <CapacityRow key={cap.id} capacity={cap} />
          ))}
          {capacities.length === 0 && (
            <tr>
              <td
                colSpan={3}
                className="px-4 py-8 text-center text-sm text-slate-500 dark:text-slate-400"
              >
                No capacity records yet. Add a designer below.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
