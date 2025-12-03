import { notFound } from "next/navigation";
import { ProjectFormEnhanced } from "@/components/ProjectFormEnhanced";
import { getProjectById } from "@/data/projects";
import { getAllDesignerCapacities } from "@/data/capacities";
import { getCurrentTeamId } from "@/lib/team-context";

export const dynamic = "force-dynamic";

type Props = {
  params: { id: string };
};

export default async function EditProjectPage({ params }: Props) {
  const teamId = await getCurrentTeamId();

  const [project, capacities] = await Promise.all([
    getProjectById(params.id, teamId),
    getAllDesignerCapacities(teamId)
  ]);

  if (!project) return notFound();

  const designers = capacities.map((c) => c.designerName);

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Edit Project
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Update project details, timeline, and configuration
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
        <ProjectFormEnhanced project={project} designers={designers} />
      </div>
    </div>
  );
}
