"use client";

import { useState } from "react";
import { Trash2, Clock } from "lucide-react";
import { deleteTimeEntry } from "@/app/actions/timeEntries";

type TimeEntry = {
  id: string;
  designerName: string;
  hours: number;
  date: Date;
  description: string | null;
  isTimerEntry: boolean;
  timerStartedAt: Date | null;
  timerEndedAt: Date | null;
};

type TimeEntriesListProps = {
  projectId: string;
  entries: TimeEntry[];
};

export function TimeEntriesList({ projectId, entries }: TimeEntriesListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this time entry?")) return;

    setDeletingId(id);
    const result = await deleteTimeEntry(id, projectId);

    if (!result.success) {
      alert(result.error || "Failed to delete time entry");
    }
    setDeletingId(null);
  };

  if (entries.length === 0) {
    return (
      <p className="text-sm text-slate-500 dark:text-slate-400">
        No time entries yet. Start tracking time above!
      </p>
    );
  }

  // Group entries by date
  const entriesByDate = entries.reduce((acc, entry) => {
    const dateKey = new Date(entry.date).toDateString();
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(entry);
    return acc;
  }, {} as Record<string, TimeEntry[]>);

  const sortedDates = Object.keys(entriesByDate).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );

  return (
    <div className="space-y-4">
      {sortedDates.map((dateKey) => {
        const dayEntries = entriesByDate[dateKey];
        const dayTotal = dayEntries.reduce((sum, e) => sum + e.hours, 0);

        return (
          <div key={dateKey} className="space-y-2">
            <div className="flex items-center justify-between border-b border-slate-200 pb-1 dark:border-slate-700">
              <h4 className="text-sm font-medium text-slate-900 dark:text-slate-100">{dateKey}</h4>
              <span className="text-xs text-slate-600 dark:text-slate-400">
                {dayTotal.toFixed(1)}h total
              </span>
            </div>

            <div className="space-y-2">
              {dayEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-start justify-between rounded-lg bg-slate-50 p-2 dark:bg-slate-800/50"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-900 dark:text-slate-100">
                        {entry.hours.toFixed(1)}h
                      </span>
                      {entry.isTimerEntry && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-teal-100 px-2 py-0.5 text-xs text-teal-700 dark:bg-teal-500/20 dark:text-teal-300">
                          <Clock className="h-3 w-3" />
                          Timer
                        </span>
                      )}
                    </div>
                    {entry.description && (
                      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                        {entry.description}
                      </p>
                    )}
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-500">
                      {entry.designerName}
                    </p>
                  </div>

                  <button
                    onClick={() => handleDelete(entry.id)}
                    disabled={deletingId === entry.id}
                    className="text-slate-400 hover:text-red-600 disabled:opacity-50 dark:text-slate-600 dark:hover:text-red-400"
                    title="Delete time entry"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
