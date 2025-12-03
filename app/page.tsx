import { calculateTeamWorkload } from "@/domain/workload";
import { calculateRiskFlags } from "@/domain/risk";
import { selectFocusProjectForDesigner } from "@/domain/focus";
import { getAllProjects } from "@/data/projects";
import { getAllDesignerCapacities } from "@/data/capacities";
import { getCurrentTeamId } from "@/lib/team-context";
import { CapacityRing } from "@/components/CapacityRing";
import { WorkloadChart } from "@/components/WorkloadChart";
import { ExportButton } from "@/components/ExportButton";

export const dynamic = 'force-dynamic';
export const revalidate = 0; // always fresh in MVP

export default async function DashboardPage() {
  const teamId = await getCurrentTeamId();

  const [projects, capacities] = await Promise.all([
    getAllProjects(teamId),
    getAllDesignerCapacities(teamId)
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
    <div className="space-y-12 animate-[fadeIn_0.5s_ease-in-out]">
      <div className="flex items-center justify-between pb-6 border-b border-cc-border-subtle">
        <div>
          <h1 className="font-display text-5xl font-bold tracking-tight text-cc-teal-dark mb-3">
            Dashboard
          </h1>
          <p className="text-base text-cc-text-muted leading-relaxed">
            Team capacity, workload distribution, and project risk overview
          </p>
        </div>
        <ExportButton projects={projects} designers={workload.designers} />
      </div>

      <section className="animate-[fadeInUp_0.6s_ease-in-out]">
        <h2 className="mb-8 font-display text-3xl font-semibold text-cc-teal-dark">
          Team Workload
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-lg border-0 bg-cc-surface p-6 shadow-tile card-hover">
            <p className="mb-3 text-xs font-medium uppercase tracking-wider text-cc-text-muted">Total capacity</p>
            <p className="text-3xl font-display font-bold text-cc-teal-dark leading-tight">
              {workload.totalCapacity.toFixed(1)} <span className="text-xl text-cc-text-muted">hrs</span>
            </p>
          </div>
          <div className="rounded-lg border-0 bg-cc-surface p-6 shadow-tile card-hover">
            <p className="mb-3 text-xs font-medium uppercase tracking-wider text-cc-text-muted">Planned this week</p>
            <p className="text-3xl font-display font-bold text-cc-teal-dark leading-tight">
              {workload.totalEstimatedHours.toFixed(1)} <span className="text-xl text-cc-text-muted">hrs</span>
            </p>
          </div>
          <div className="rounded-lg border-0 bg-cc-surface p-6 shadow-tile card-hover">
            <p className="mb-3 text-xs font-medium uppercase tracking-wider text-cc-text-muted">Remaining</p>
            <p className="text-3xl font-display font-bold text-cc-green-good leading-tight">
              {workload.totalHoursRemaining.toFixed(1)} <span className="text-xl text-cc-text-muted">hrs</span>
            </p>
          </div>
        </div>

        <div className="mt-8 rounded-lg border-0 bg-cc-surface p-8 shadow-card animate-[fadeInUp_0.7s_ease-in-out]">
          <h3 className="mb-6 font-display text-xl font-semibold text-cc-teal-dark">
            Team Capacity Distribution
          </h3>
          <WorkloadChart designers={workload.designers} />
        </div>
      </section>

      <section className="animate-[fadeInUp_0.8s_ease-in-out]">
        <h2 className="mb-8 font-display text-3xl font-semibold text-cc-teal-dark">
          Designer Workload
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {workload.designers.map((designer, index) => (
            <div
              key={designer.designerName}
              className="rounded-lg border-0 bg-cc-surface p-6 shadow-tile card-hover"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="mb-5 flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-display text-lg font-semibold text-cc-text-main mb-2">
                    {designer.designerName}
                  </h3>
                  <span
                    className={
                      "inline-flex items-center gap-1 rounded-pill px-3 py-1 text-xs font-medium " +
                      (designer.hoursRemaining < 0
                        ? "bg-cc-red-pill/10 text-cc-red-pill"
                        : "bg-cc-green-good/10 text-cc-green-good")
                    }
                  >
                    {designer.hoursRemaining.toFixed(1)} hrs remaining
                  </span>
                </div>
                <CapacityRing
                  capacity={designer.capacity}
                  used={designer.estimatedHours}
                  size={100}
                />
              </div>
              <div className="space-y-2 text-sm text-cc-text-muted border-t border-cc-border-subtle pt-4">
                <div className="flex justify-between">
                  <span>Capacity:</span>
                  <span className="font-medium text-cc-text-main">{designer.capacity.toFixed(1)} hrs</span>
                </div>
                <div className="flex justify-between">
                  <span>Planned:</span>
                  <span className="font-medium text-cc-text-main">{designer.estimatedHours.toFixed(1)} hrs</span>
                </div>
                <div className="flex justify-between">
                  <span>Active projects:</span>
                  <span className="font-medium text-cc-text-main">{designer.activeProjects.length}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="animate-[fadeInUp_0.9s_ease-in-out]">
        <h2 className="mb-8 font-display text-3xl font-semibold text-cc-teal-dark">
          Designer Focus
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {focusList.map(({ designerName, project }, index) => (
            <div
              key={designerName}
              className="rounded-lg border-0 bg-cc-surface p-6 shadow-tile card-hover"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <h3 className="mb-3 font-display text-lg font-semibold text-cc-text-main">
                {designerName}
              </h3>
              {project ? (
                <>
                  <p className="text-base text-cc-text-main font-medium leading-relaxed">{project.title}</p>
                  <p className="mt-2 text-sm text-cc-text-muted">
                    Due {project.dueDate.toDateString()}
                  </p>
                </>
              ) : (
                <p className="text-sm text-cc-text-muted leading-relaxed">
                  No active projects assigned.
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="animate-[fadeInUp_1s_ease-in-out]">
        <h2 className="mb-8 font-display text-3xl font-semibold text-cc-teal-dark">
          At-risk & Over-budget
        </h2>
        {riskyProjects.length === 0 ? (
          <div className="rounded-lg bg-cc-surface-soft p-8 text-center shadow-soft">
            <p className="text-base text-cc-text-muted leading-relaxed">
              No projects currently flagged as at-risk or over-budget.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {riskyProjects.map(({ project, risk }, index) => (
              <div
                key={project.id}
                className="rounded-lg border-0 bg-cc-surface p-6 shadow-tile card-hover"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <h3 className="mb-2 font-display text-lg font-semibold text-cc-text-main">
                  {project.title}
                </h3>
                <p className="mb-2 text-sm text-cc-text-muted">
                  {project.client} • {project.instructionalDesigner}
                </p>
                <p className="mb-4 text-sm text-cc-text-muted">
                  Due {project.dueDate.toDateString()}
                </p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {risk.isOverBudget && (
                    <span className="rounded-pill bg-cc-red-pill/10 px-3 py-1 text-xs font-medium text-cc-red-pill">
                      Over budget
                    </span>
                  )}
                  {risk.isAtRisk && (
                    <span className="rounded-pill bg-cc-coral/10 px-3 py-1 text-xs font-medium text-cc-coral">
                      At risk
                    </span>
                  )}
                </div>
                {risk.reason && (
                  <p className="text-sm text-cc-text-muted leading-relaxed border-t border-cc-border-subtle pt-3">
                    {risk.reason}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
