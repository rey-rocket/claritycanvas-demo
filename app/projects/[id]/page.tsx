import { notFound } from "next/navigation";
import Link from "next/link";
import { getProjectById } from "@/data/projects";
import { calculateRiskFlags } from "@/domain/risk";
import { TaskList } from "@/components/TaskList";
import { Pencil } from "lucide-react";

type Props = {
  params: { id: string };
};

export const revalidate = 0;

export default async function ProjectDetailPage({ params }: Props) {
  const project = await getProjectById(params.id);

  if (!project) return notFound();

  const risk = calculateRiskFlags(project);

  return (
    <div className="max-w-3xl space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{project.title}</h1>
          <p className="text-sm text-slate-400">
            {project.client} &bull; {project.instructionalDesigner}
          </p>
          <p className="text-xs text-slate-500">
            Status: {project.status} &bull; Due {project.dueDate.toDateString()}
          </p>
        </div>
        <Link
          href={`/projects/${project.id}/edit`}
          className="flex items-center gap-1 rounded-lg border border-slate-700 px-3 py-1.5 text-sm text-slate-300 hover:bg-slate-800"
        >
          <Pencil className="h-4 w-4" />
          Edit
        </Link>
      </div>

      <div className="flex gap-2 text-xs">
        {risk.isOverBudget && (
          <span className="rounded-full bg-red-500/20 px-2 py-0.5 text-red-300">
            Over budget
          </span>
        )}
        {risk.isAtRisk && (
          <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-amber-300">
            At risk
          </span>
        )}
      </div>
      {risk.reason && (
        <p className="text-xs text-slate-400">{risk.reason}</p>
      )}

      <section className="mt-4 space-y-2 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
        <h2 className="text-sm font-semibold">Hours</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-slate-400">Scoped</p>
            <p className="text-lg font-medium">
              {project.estimatedScopedHours.toFixed(1)} hrs
            </p>
          </div>
          <div>
            <p className="text-slate-400">Worked</p>
            <p className="text-lg font-medium">
              {project.hoursWorked.toFixed(1)} hrs
            </p>
          </div>
        </div>
        <div className="mt-2">
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-700">
            <div
              className={
                "h-full rounded-full " +
                (project.hoursWorked > project.estimatedScopedHours
                  ? "bg-red-500"
                  : "bg-emerald-500")
              }
              style={{
                width: `${Math.min(
                  100,
                  (project.hoursWorked / project.estimatedScopedHours) * 100
                )}%`
              }}
            />
          </div>
          <p className="mt-1 text-xs text-slate-500">
            {((project.hoursWorked / project.estimatedScopedHours) * 100).toFixed(0)}%
            complete
          </p>
        </div>
      </section>

      <section className="space-y-2 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
        <h2 className="text-sm font-semibold">Tasks</h2>
        <TaskList projectId={project.id} tasks={project.tasks} />
      </section>

      <section className="space-y-2 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
        <h2 className="text-sm font-semibold">Notes</h2>
        <p className="whitespace-pre-wrap text-sm text-slate-200">
          {project.notes || "No notes yet."}
        </p>
      </section>

      <div className="pt-4">
        <Link
          href="/projects"
          className="text-sm text-slate-400 hover:text-slate-200"
        >
          &larr; Back to Projects
        </Link>
      </div>
    </div>
  );
}
