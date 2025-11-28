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
      className="text-emerald-400 hover:text-emerald-300 disabled:opacity-50"
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
      <tr className="border-t border-slate-800">
        <td className="px-4 py-2">{capacity.designerName}</td>
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
              className="w-24 rounded border border-slate-600 bg-slate-700 px-2 py-1 text-sm focus:border-emerald-500 focus:outline-none"
            />
            <SaveButton />
            <button
              type="button"
              onClick={() => {
                setHours(capacity.weeklyAvailableHours);
                setIsEditing(false);
              }}
              className="text-slate-400 hover:text-slate-200"
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
    <tr className="border-t border-slate-800 hover:bg-slate-900">
      <td className="px-4 py-2">{capacity.designerName}</td>
      <td className="px-4 py-2">{capacity.weeklyAvailableHours.toFixed(1)}</td>
      <td className="px-4 py-2">
        <div className="flex gap-2">
          <button
            onClick={() => setIsEditing(true)}
            className="text-slate-400 hover:text-emerald-400"
            title="Edit"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-slate-400 hover:text-red-400 disabled:opacity-50"
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
    <div className="rounded-xl border border-slate-800 bg-slate-900/60">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-900/80 text-slate-400">
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
                className="px-4 py-8 text-center text-sm text-slate-500"
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
