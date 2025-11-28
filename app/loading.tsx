export default function Loading() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="space-y-4">
        <div className="h-8 w-48 rounded bg-slate-800" />
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-24 rounded-xl border border-slate-800 bg-slate-900/60"
            />
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="h-8 w-48 rounded bg-slate-800" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-32 rounded-xl border border-slate-800 bg-slate-900/60"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
