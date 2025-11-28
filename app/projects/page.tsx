import Link from "next/link";
import { getAllProjects, type ProjectFilters } from "@/data/projects";
import { getAllDesignerCapacities } from "@/data/capacities";
import { calculateRiskFlags } from "@/domain/risk";
import { ProjectFilters as FilterComponent } from "@/components/ProjectFilters";
import { ProjectStatus } from "@/lib/types";

export const revalidate = 0;

type Props = {
  searchParams: { designer?: string; status?: string };
};

export default async function ProjectsPage({ searchParams }: Props) {
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
    getAllProjects(filters),
    getAllDesignerCapacities()
  ]);

  const designers = [...new Set([
    ...capacities.map((c) => c.designerName),
    ...projects.map((p) => p.instructionalDesigner)
  ])].sort();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Projects</h1>
        <Link
          href="/projects/new"
          className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-slate-950 hover:bg-emerald-400"
        >
          New Project
        </Link>
      </div>

      <FilterComponent designers={designers} />

      <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-900/80 text-slate-400">
            <tr>
              <th className="px-4 py-2 text-left">Title</th>
              <th className="px-4 py-2 text-left">Client</th>
              <th className="px-4 py-2 text-left">Designer</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Due</th>
              <th className="px-4 py-2 text-left">Flags</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => {
              const risk = calculateRiskFlags(project);
              return (
                <tr
                  key={project.id}
                  className="border-t border-slate-800 hover:bg-slate-900"
                >
                  <td className="px-4 py-2">
                    <Link
                      href={`/projects/${project.id}`}
                      className="text-emerald-300 hover:underline"
                    >
                      {project.title}
                    </Link>
                  </td>
                  <td className="px-4 py-2">{project.client}</td>
                  <td className="px-4 py-2">
                    {project.instructionalDesigner}
                  </td>
                  <td className="px-4 py-2">
                    <span
                      className={
                        "rounded-full px-2 py-0.5 text-xs " +
                        (project.status === ProjectStatus.HANDOVER
                          ? "bg-slate-700 text-slate-300"
                          : project.status === ProjectStatus.REVIEW
                          ? "bg-blue-500/20 text-blue-300"
                          : project.status === ProjectStatus.IN_PROGRESS
                          ? "bg-emerald-500/20 text-emerald-300"
                          : "bg-amber-500/20 text-amber-300")
                      }
                    >
                      {project.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-xs text-slate-400">
                    {project.dueDate.toDateString()}
                  </td>
                  <td className="px-4 py-2 text-xs">
                    <div className="flex gap-2">
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
                  </td>
                </tr>
              );
            })}
            {projects.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-sm text-slate-500"
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
