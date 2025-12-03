import { ProjectFormEnhanced } from "@/components/ProjectFormEnhanced";
import { getAllDesignerCapacities } from "@/data/capacities";
import { getCurrentTeamId } from "@/lib/team-context";

export const dynamic = "force-dynamic";

export default async function NewProjectPage() {
  const teamId = await getCurrentTeamId();
  const capacities = await getAllDesignerCapacities(teamId);
  const designers = capacities.map((c) => c.designerName);

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Create New Project
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Set up a new instructional design project with templates or custom configuration
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
        <ProjectFormEnhanced designers={designers} />
      </div>
    </div>
  );
}
