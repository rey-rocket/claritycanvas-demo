import { notFound } from "next/navigation";
import Link from "next/link";
import { getProjectById } from "@/data/projects";
import { getCurrentTeamId } from "@/lib/team-context";
import { calculateRiskFlags } from "@/domain/risk";
import { TaskList } from "@/components/TaskList";
import { ProjectTimer } from "@/components/ProjectTimer";
import { TimeEntryForm } from "@/components/TimeEntryForm";
import { TimeEntriesList } from "@/components/TimeEntriesList";
import { getActiveTimer } from "@/app/actions/timeEntries";
import { Pencil } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

type Props = {
  params: { id: string };
};

export const revalidate = 0;

export default async function ProjectDetailPage({ params }: Props) {
  const teamId = await getCurrentTeamId();
  const project = await getProjectById(params.id, teamId);

  if (!project) return notFound();

  // Get time entries for this project
  const timeEntries = await prisma.timeEntry.findMany({
    where: { projectId: params.id },
    orderBy: { date: "desc" }
  });

  // Get active timer for the designer (using first designer from project for now)
  const activeTimer = await getActiveTimer(project.instructionalDesigner);

  const risk = calculateRiskFlags(project);

  return (
    <div className="max-w-3xl space-y-section">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-3xl font-bold tracking-tight text-cc-teal-dark">{project.title}</h1>
            {project.priority && (
              <span
                className={
                  "rounded-pill px-2 py-0.5 text-xs font-medium " +
                  (project.priority === "A"
                    ? "bg-cc-red-pill/10 text-cc-red-pill"
                    : project.priority === "B"
                    ? "bg-cc-coral/10 text-cc-coral"
                    : "bg-cc-blue-pill text-cc-blue-pill-text")
                }
              >
                Priority {project.priority}
              </span>
            )}
          </div>
          <p className="text-sm text-cc-text-muted">
            {project.client} &bull; {project.instructionalDesigner}
          </p>
          <p className="text-xs text-cc-text-soft">
            Status: {project.status} &bull; Due {project.dueDate.toDateString()}
            {project.earlyReminderDate && (
              <> &bull; Reminder {project.earlyReminderDate.toDateString()}</>
            )}
          </p>
        </div>
        <Link
          href={`/projects/${project.id}/edit`}
          className="flex items-center gap-1 rounded-sm border border-cc-border-subtle px-3 py-1.5 text-sm text-cc-text-muted transition-colors hover:bg-cc-surface-soft hover:text-cc-teal"
        >
          <Pencil className="h-4 w-4" />
          Edit
        </Link>
      </div>

      <div className="flex gap-2 text-xs">
        {risk.isOverBudget && (
          <span className="rounded-pill bg-cc-red-pill/10 px-2 py-0.5 font-medium text-cc-red-pill">
            Over budget
          </span>
        )}
        {risk.isAtRisk && (
          <span className="rounded-pill bg-cc-coral/10 px-2 py-0.5 font-medium text-cc-coral">
            At risk
          </span>
        )}
      </div>
      {risk.reason && (
        <p className="text-xs text-cc-text-muted">{risk.reason}</p>
      )}

      <section className="mt-4 space-y-2 rounded-md border-0 bg-cc-surface p-card shadow-card">
        <h2 className="font-display text-sm font-semibold text-cc-teal-dark">Hours</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-cc-text-muted">Scoped</p>
            <p className="font-display text-lg font-bold text-cc-teal-dark">
              {project.estimatedScopedHours.toFixed(1)} hrs
            </p>
          </div>
          <div>
            <p className="text-cc-text-muted">Worked</p>
            <p className="font-display text-lg font-bold text-cc-text-main">
              {project.hoursWorked.toFixed(1)} hrs
            </p>
          </div>
        </div>
        <div className="mt-2">
          <div className="h-2 w-full overflow-hidden rounded-pill bg-cc-border-subtle">
            <div
              className={
                "h-full rounded-pill " +
                (project.hoursWorked > project.estimatedScopedHours
                  ? "bg-cc-red-pill"
                  : "bg-cc-teal")
              }
              style={{
                width: `${Math.min(
                  100,
                  (project.hoursWorked / project.estimatedScopedHours) * 100
                )}%`
              }}
            />
          </div>
          <p className="mt-1 text-xs text-cc-text-soft">
            {((project.hoursWorked / project.estimatedScopedHours) * 100).toFixed(0)}%
            complete
          </p>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        <ProjectTimer
          projectId={project.id}
          designerName={project.instructionalDesigner}
          activeTimer={activeTimer}
        />

        <div className="rounded-md border-0 bg-cc-surface p-card shadow-tile">
          <h3 className="mb-3 font-display text-sm font-semibold text-cc-teal-dark">
            Quick Time Entry
          </h3>
          <TimeEntryForm projectId={project.id} designerName={project.instructionalDesigner} />
        </div>
      </div>

      <section className="space-y-2 rounded-md border-0 bg-cc-surface p-card shadow-tile">
        <h2 className="font-display text-sm font-semibold text-cc-teal-dark">Time Entries</h2>
        <TimeEntriesList projectId={project.id} entries={timeEntries} />
      </section>

      {project.mediaBudget && (
        <section className="space-y-2 rounded-md border-0 bg-cc-surface p-card shadow-tile">
          <h2 className="font-display text-sm font-semibold text-cc-teal-dark">Media Budget</h2>
          <p className="text-sm text-cc-text-main">
            {project.mediaBudget}
          </p>
        </section>
      )}

      <section className="space-y-2 rounded-md border-0 bg-cc-surface p-card shadow-tile">
        <h2 className="font-display text-sm font-semibold text-cc-teal-dark">Tasks</h2>
        <TaskList projectId={project.id} tasks={project.tasks} />
      </section>

      <section className="space-y-2 rounded-md border-0 bg-cc-surface p-card shadow-tile">
        <h2 className="font-display text-sm font-semibold text-cc-teal-dark">Notes</h2>
        <p className="whitespace-pre-wrap text-sm text-cc-text-main">
          {project.notes || "No notes yet."}
        </p>
      </section>

      <div className="pt-4">
        <Link
          href="/projects"
          className="text-sm text-cc-text-muted transition-colors hover:text-cc-teal"
        >
          &larr; Back to Projects
        </Link>
      </div>
    </div>
  );
}
