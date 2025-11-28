export default function ProjectsLoading() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-8 w-32 rounded bg-slate-800" />
        <div className="h-10 w-28 rounded-lg bg-slate-800" />
      </div>

      <div className="flex gap-3">
        <div className="h-9 w-40 rounded-lg bg-slate-800" />
        <div className="h-9 w-36 rounded-lg bg-slate-800" />
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900/60">
        <div className="border-b border-slate-800 p-4">
          <div className="flex gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-4 w-20 rounded bg-slate-700" />
            ))}
          </div>
        </div>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="border-t border-slate-800 p-4">
            <div className="flex gap-8">
              {[1, 2, 3, 4, 5, 6].map((j) => (
                <div key={j} className="h-4 w-20 rounded bg-slate-800" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
