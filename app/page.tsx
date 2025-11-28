import { calculateTeamWorkload } from "@/domain/workload";
import { calculateRiskFlags } from "@/domain/risk";
import { selectFocusProjectForDesigner } from "@/domain/focus";
import { getAllProjects } from "@/data/projects";
import { getAllDesignerCapacities } from "@/data/capacities";

export const revalidate = 0; // always fresh in MVP

export default async function DashboardPage() {
  const [projects, capacities] = await Promise.all([
    getAllProjects(),
    getAllDesignerCapacities()
  ]);

  const workload = calculateTeamWorkload(projects, capacities, 40);

  const byDesigner = new Map<string, typeof projects>();
  for (const project of projects) {
    const arr = byDesigner.get(project.instructionalDesigner) ?? [];
    arr.push(project);
    byDesigner.set(project.instructionalDesigner, arr);
  }

  const focusList = Array.from(byDesigner.entries()).map(
    ([designerName, projectsForDesigner]) => ({
      designerName,
      project: selectFocusProjectForDesigner(projectsForDesigner)
    })
  );

  const riskyProjects = projects
    .map((p) => ({ project: p, risk: calculateRiskFlags(p) }))
    .filter(({ risk }) => risk.isAtRisk || risk.isOverBudget);

  return (
    <div className="space-y-8">
      <section>
        <h2 className="mb-4 text-2xl font-semibold">Team Workload</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <p className="text-sm text-slate-400">Total capacity</p>
            <p className="text-2xl font-semibold">
              {workload.totalCapacity.toFixed(1)} hrs
            </p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <p className="text-sm text-slate-400">Planned this week</p>
            <p className="text-2xl font-semibold">
              {workload.totalEstimatedHours.toFixed(1)} hrs
            </p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <p className="text-sm text-slate-400">Remaining</p>
            <p className="text-2xl font-semibold">
              {workload.totalHoursRemaining.toFixed(1)} hrs
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-semibold">Designer Workload</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {workload.designers.map((designer) => (
            <div
              key={designer.designerName}
              className="rounded-xl border border-slate-800 bg-slate-900/60 p-4"
            >
              <div className="mb-2 flex items-center justify-between">
                <h3 className="font-medium">{designer.designerName}</h3>
                <span
                  className={
                    "rounded-full px-2 py-0.5 text-xs " +
                    (designer.hoursRemaining < 0
                      ? "bg-red-500/20 text-red-300"
                      : "bg-emerald-500/20 text-emerald-300")
                  }
                >
                  {designer.hoursRemaining.toFixed(1)} hrs remaining
                </span>
              </div>
              <p className="mb-1 text-xs text-slate-400">
                Capacity: {designer.capacity.toFixed(1)} hrs
              </p>
              <p className="mb-3 text-xs text-slate-400">
                Planned: {designer.estimatedHours.toFixed(1)} hrs
              </p>
              <p className="text-xs text-slate-400">
                Active projects: {designer.activeProjects.length}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-semibold">Designer Focus</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {focusList.map(({ designerName, project }) => (
            <div
              key={designerName}
              className="rounded-xl border border-slate-800 bg-slate-900/60 p-4"
            >
              <h3 className="mb-1 font-medium">{designerName}</h3>
              {project ? (
                <>
                  <p className="text-sm">{project.title}</p>
                  <p className="mt-1 text-xs text-slate-400">
                    Due {project.dueDate.toDateString()}
                  </p>
                </>
              ) : (
                <p className="text-sm text-slate-400">
                  No active projects assigned.
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-semibold">At-risk & Over-budget</h2>
        {riskyProjects.length === 0 ? (
          <p className="text-sm text-slate-400">
            No projects currently flagged as at-risk or over-budget.
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {riskyProjects.map(({ project, risk }) => (
              <div
                key={project.id}
                className="rounded-xl border border-slate-800 bg-slate-900/60 p-4"
              >
                <h3 className="mb-1 font-medium">{project.title}</h3>
                <p className="mb-1 text-xs text-slate-400">
                  {project.client} • {project.instructionalDesigner}
                </p>
                <p className="mb-2 text-xs text-slate-400">
                  Due {project.dueDate.toDateString()}
                </p>
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
                  <p className="mt-2 text-xs text-slate-400">{risk.reason}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
