"use client";

import { useState, useEffect } from "react";
import { Play, Square } from "lucide-react";
import { startTimer, stopTimer } from "@/app/actions/timeEntries";

type ProjectTimerProps = {
  projectId: string;
  designerName: string;
  activeTimer?: {
    id: string;
    timerStartedAt: Date | null;
    description: string | null;
  } | null;
};

export function ProjectTimer({ projectId, designerName, activeTimer }: ProjectTimerProps) {
  const [isRunning, setIsRunning] = useState(!!activeTimer);
  const [elapsed, setElapsed] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (activeTimer && activeTimer.timerStartedAt) {
      const startTime = new Date(activeTimer.timerStartedAt).getTime();
      const updateElapsed = () => {
        const now = Date.now();
        setElapsed(Math.floor((now - startTime) / 1000));
      };

      updateElapsed();
      const interval = setInterval(updateElapsed, 1000);
      return () => clearInterval(interval);
    }
  }, [activeTimer]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const handleStart = async () => {
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("projectId", projectId);
    formData.append("designerName", designerName);
    if (description) {
      formData.append("description", description);
    }

    const result = await startTimer(formData);

    if (result.success) {
      setIsRunning(true);
      setDescription("");
    } else {
      alert(result.error || "Failed to start timer");
    }
    setIsSubmitting(false);
  };

  const handleStop = async () => {
    if (!activeTimer) return;

    setIsSubmitting(true);
    const result = await stopTimer(activeTimer.id);

    if (result.success) {
      setIsRunning(false);
      setElapsed(0);
    } else {
      alert(result.error || "Failed to stop timer");
    }
    setIsSubmitting(false);
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900/60">
      <h3 className="mb-3 text-sm font-semibold text-slate-900 dark:text-slate-100">Time Tracker</h3>

      {isRunning && activeTimer ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-mono font-semibold text-teal-600 dark:text-teal-400">
                {formatTime(elapsed)}
              </div>
              {activeTimer.description && (
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                  {activeTimer.description}
                </p>
              )}
            </div>
            <button
              onClick={handleStop}
              disabled={isSubmitting}
              className="flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-50"
            >
              <Square className="h-4 w-4" />
              Stop
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What are you working on? (optional)"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />
          <button
            onClick={handleStart}
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-teal-500 px-4 py-2 text-sm font-medium text-slate-950 hover:bg-teal-400 disabled:opacity-50"
          >
            <Play className="h-4 w-4" />
            Start Timer
          </button>
        </div>
      )}
    </div>
  );
}
