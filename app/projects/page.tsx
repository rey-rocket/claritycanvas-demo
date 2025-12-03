import Link from "next/link";
import { getAllProjects, type ProjectFilters } from "@/data/projects";
import { getAllDesignerCapacities } from "@/data/capacities";
import { getCurrentTeamId } from "@/lib/team-context";
import { calculateRiskFlags } from "@/domain/risk";
import { ProjectFilters as FilterComponent } from "@/components/ProjectFilters";
import { ProjectStatus } from "@/lib/types";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type Props = {
  searchParams: { designer?: string; status?: string };
};

export default async function ProjectsPage({ searchParams }: Props) {
  const teamId = await getCurrentTeamId();

  const filters: ProjectFilters = {};

  if (searchParams.designer) {
    filters.designer = searchParams.designer;
  }
  if (searchParams.status) {
    const statusValues = Object.values(ProjectStatus);
    if (statusValues.includes(searchParams.status as typeof statusValues[number])) {
      filters.status = searchParams.status as typeof statusValues[number];
    }
  }

  const [projects, capacities] = await Promise.all([
    getAllProjects(teamId, filters),
    getAllDesignerCapacities(teamId)
  ]);

  const designers = [...new Set([
    ...capacities.map((c) => c.designerName),
    ...projects.map((p) => p.instructionalDesigner)
  ])].sort();

  return (
    <div className="space-y-section">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-cc-teal-dark">Projects</h1>
          <p className="mt-2 text-sm text-cc-text-muted">
            Manage and track all instructional design projects
          </p>
        </div>
        <Link
          href="/projects/new"
          className="rounded-pill bg-gradient-cc-primary px-6 py-2 text-sm font-display font-semibold text-white shadow-btn-primary transition-all hover:shadow-btn-secondary"
        >
          + New Project
        </Link>
      </div>

      <FilterComponent designers={designers} />

      <div className="overflow-x-auto rounded-md border-0 bg-cc-surface shadow-card">
        <table className="min-w-full text-sm">
          <thead className="bg-cc-surface-soft text-cc-text-muted">
            <tr>
              <th className="px-6 py-3 text-left font-display font-semibold text-xs uppercase tracking-wide">Title</th>
              <th className="px-6 py-3 text-left font-display font-semibold text-xs uppercase tracking-wide">Client</th>
              <th className="px-6 py-3 text-left font-display font-semibold text-xs uppercase tracking-wide">Designer</th>
              <th className="px-6 py-3 text-left font-display font-semibold text-xs uppercase tracking-wide">Priority</th>
              <th className="px-6 py-3 text-left font-display font-semibold text-xs uppercase tracking-wide">Status</th>
              <th className="px-6 py-3 text-left font-display font-semibold text-xs uppercase tracking-wide">Due</th>
              <th className="px-6 py-3 text-left font-display font-semibold text-xs uppercase tracking-wide">Flags</th>
            </tr>
          </thead>
          <tbody className="text-cc-text-main">
            {projects.map((project) => {
              const risk = calculateRiskFlags(project);
              return (
                <tr
                  key={project.id}
                  className="border-t border-cc-border-subtle hover:bg-cc-surface-soft/30 transition-colors"
                >
                  <td className="px-6 py-3">
                    <Link
                      href={`/projects/${project.id}`}
                      className="font-medium text-cc-teal hover:text-cc-teal-dark hover:underline"
                    >
                      {project.title}
                    </Link>
                  </td>
                  <td className="px-6 py-3">{project.client}</td>
                  <td className="px-6 py-3">
                    {project.instructionalDesigner}
                  </td>
                  <td className="px-6 py-3">
                    {project.priority ? (
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
                    ) : (
                      <span className="text-cc-text-soft">-</span>
                    )}
                  </td>
                  <td className="px-6 py-3">
                    <span
                      className={
                        "rounded-pill px-2 py-0.5 text-xs font-medium " +
                        (project.status === ProjectStatus.HANDOVER
                          ? "bg-cc-text-soft/10 text-cc-text-muted"
                          : project.status === ProjectStatus.REVIEW
                          ? "bg-cc-blue-pill text-cc-blue-pill-text"
                          : project.status === ProjectStatus.IN_PROGRESS
                          ? "bg-cc-surface-soft text-cc-teal-dark"
                          : "bg-cc-lime-soft/30 text-cc-teal-dark")
                      }
                    >
                      {project.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-xs text-cc-text-muted">
                    {project.dueDate.toDateString()}
                  </td>
                  <td className="px-6 py-3 text-xs">
                    <div className="flex gap-2">
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
                  </td>
                </tr>
              );
            })}
            {projects.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-8 text-center text-sm text-cc-text-muted"
                >
                  {Object.keys(filters).length > 0
                    ? "No projects match the current filters."
                    : "No projects yet. Create your first project to get started."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
