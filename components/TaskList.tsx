"use client";

import { useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { createTask, toggleTask, deleteTask } from "@/app/actions/tasks";
import { Trash2 } from "lucide-react";

type Task = {
  id: string;
  name: string;
  completed: boolean;
  estimatedHours: number | null;
};

type TaskListProps = {
  projectId: string;
  tasks: Task[];
};

function AddTaskButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-medium text-slate-950 hover:bg-emerald-400 disabled:opacity-50"
    >
      {pending ? "Adding..." : "Add"}
    </button>
  );
}

function TaskItem({
  task,
  projectId
}: {
  task: Task;
  projectId: string;
}) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleToggle = async (formData: FormData) => {
    await toggleTask(formData);
  };

  const handleDelete = async () => {
    if (isDeleting) return;
    setIsDeleting(true);
    await deleteTask(task.id, projectId);
  };

  return (
    <li className="flex items-center justify-between gap-2 rounded-lg bg-slate-800/50 px-3 py-2">
      <form action={handleToggle} className="flex items-center gap-2 flex-1">
        <input type="hidden" name="id" value={task.id} />
        <input type="hidden" name="completed" value={String(!task.completed)} />
        <button
          type="submit"
          className={
            "h-4 w-4 rounded border flex-shrink-0 " +
            (task.completed
              ? "border-emerald-500 bg-emerald-500"
              : "border-slate-500 hover:border-emerald-400")
          }
        >
          {task.completed && (
            <svg
              className="h-4 w-4 text-slate-950"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
        </button>
        <span
          className={
            "text-sm " +
            (task.completed ? "text-slate-500 line-through" : "text-slate-200")
          }
        >
          {task.name}
        </span>
      </form>
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="text-slate-500 hover:text-red-400 disabled:opacity-50"
        title="Delete task"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </li>
  );
}

export function TaskList({ projectId, tasks }: TaskListProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAddTask = async (formData: FormData) => {
    setError(null);
    const result = await createTask(formData);
    if (result.success) {
      formRef.current?.reset();
    } else {
      setError(result.error || "Failed to add task");
    }
  };

  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-400">
          {completedCount} of {tasks.length} completed
        </span>
      </div>

      {error && (
        <div className="rounded-lg bg-red-500/20 p-2 text-xs text-red-300">
          {error}
        </div>
      )}

      <form ref={formRef} action={handleAddTask} className="flex gap-2">
        <input type="hidden" name="projectId" value={projectId} />
        <input
          type="text"
          name="name"
          placeholder="Add a new task..."
          required
          className="flex-1 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none"
        />
        <AddTaskButton />
      </form>

      {tasks.length > 0 ? (
        <ul className="space-y-2">
          {tasks.map((task) => (
            <TaskItem key={task.id} task={task} projectId={projectId} />
          ))}
        </ul>
      ) : (
        <p className="text-xs text-slate-500">No tasks have been added yet.</p>
      )}
    </div>
  );
}
