import { getAllDesignerCapacities } from "@/data/capacities";
import { CapacityTable } from "@/components/CapacityTable";
import { CapacityForm } from "@/components/CapacityForm";

export const revalidate = 0;

export default async function CapacityPage() {
  const capacities = await getAllDesignerCapacities();

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Designer Capacity</h1>
        <p className="mt-1 text-sm text-slate-400">
          Manage weekly available hours for each instructional designer.
        </p>
      </div>

      <CapacityTable capacities={capacities} />

      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
        <h2 className="mb-4 text-sm font-semibold">Add Designer</h2>
        <CapacityForm />
      </div>
    </div>
  );
}
