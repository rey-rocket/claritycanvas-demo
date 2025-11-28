import { notFound } from "next/navigation";
import Link from "next/link";
import { ProjectForm } from "@/components/ProjectForm";
import { getProjectById } from "@/data/projects";
import { getAllDesignerCapacities } from "@/data/capacities";

export const dynamic = "force-dynamic";

type Props = {
  params: { id: string };
};

export default async function EditProjectPage({ params }: Props) {
  const [project, capacities] = await Promise.all([
    getProjectById(params.id),
    getAllDesignerCapacities()
  ]);

  if (!project) return notFound();

  const designers = capacities.map((c) => c.designerName);

  return (
    <div className="max-w-2xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Edit Project</h1>
        <Link
          href={`/projects/${params.id}`}
          className="text-sm text-slate-400 hover:text-slate-200"
        >
          Cancel
        </Link>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
        <ProjectForm project={project} designers={designers} />
      </div>
    </div>
  );
}
