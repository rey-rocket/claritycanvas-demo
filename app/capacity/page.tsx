import { getAllDesignerCapacities } from "@/data/capacities";
import { getCurrentTeamId } from "@/lib/team-context";
import { CapacityTable } from "@/components/CapacityTable";
import { CapacityForm } from "@/components/CapacityForm";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function CapacityPage() {
  const teamId = await getCurrentTeamId();
  const capacities = await getAllDesignerCapacities(teamId);

  return (
    <div className="max-w-2xl space-y-section">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight text-cc-teal-dark">Designer Capacity</h1>
        <p className="mt-2 text-sm text-cc-text-muted">
          Manage weekly available hours for each instructional designer
        </p>
      </div>

      <CapacityTable capacities={capacities} />

      <div className="rounded-md border-0 bg-cc-surface p-card shadow-tile">
        <h2 className="mb-4 font-display text-sm font-semibold text-cc-teal-dark">Add Designer</h2>
        <CapacityForm />
      </div>
    </div>
  );
}
