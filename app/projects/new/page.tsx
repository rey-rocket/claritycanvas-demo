import Link from "next/link";
import { ProjectForm } from "@/components/ProjectForm";
import { getAllDesignerCapacities } from "@/data/capacities";

export const dynamic = "force-dynamic";

export default async function NewProjectPage() {
  const capacities = await getAllDesignerCapacities();
  const designers = capacities.map((c) => c.designerName);

  return (
    <div className="max-w-2xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">New Project</h1>
        <Link
          href="/projects"
          className="text-sm text-slate-400 hover:text-slate-200"
        >
          Cancel
        </Link>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
        <ProjectForm designers={designers} />
      </div>
    </div>
  );
}
