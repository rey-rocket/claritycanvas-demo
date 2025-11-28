export default function CapacityLoading() {
  return (
    <div className="max-w-2xl space-y-6 animate-pulse">
      <div className="space-y-2">
        <div className="h-8 w-48 rounded bg-slate-800" />
        <div className="h-4 w-80 rounded bg-slate-800" />
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900/60">
        <div className="border-b border-slate-800 p-4">
          <div className="flex gap-8">
            <div className="h-4 w-24 rounded bg-slate-700" />
            <div className="h-4 w-24 rounded bg-slate-700" />
            <div className="h-4 w-16 rounded bg-slate-700" />
          </div>
        </div>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="border-t border-slate-800 p-4">
            <div className="flex gap-8">
              <div className="h-4 w-32 rounded bg-slate-800" />
              <div className="h-4 w-16 rounded bg-slate-800" />
              <div className="h-4 w-16 rounded bg-slate-800" />
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
        <div className="h-5 w-28 rounded bg-slate-800 mb-4" />
        <div className="space-y-4">
          <div className="h-10 rounded-lg bg-slate-800" />
          <div className="h-10 rounded-lg bg-slate-800" />
          <div className="h-10 w-32 rounded-lg bg-slate-800 ml-auto" />
        </div>
      </div>
    </div>
  );
}
