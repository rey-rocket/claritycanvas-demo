export default function ProjectDetailLoading() {
  return (
    <div className="max-w-3xl space-y-4 animate-pulse">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="h-8 w-64 rounded bg-slate-800" />
          <div className="h-4 w-48 rounded bg-slate-800" />
          <div className="h-3 w-40 rounded bg-slate-800" />
        </div>
        <div className="h-9 w-20 rounded-lg bg-slate-800" />
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
        <div className="h-5 w-16 rounded bg-slate-800 mb-3" />
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="h-4 w-16 rounded bg-slate-800" />
            <div className="h-6 w-24 rounded bg-slate-800" />
          </div>
          <div className="space-y-2">
            <div className="h-4 w-16 rounded bg-slate-800" />
            <div className="h-6 w-24 rounded bg-slate-800" />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
        <div className="h-5 w-16 rounded bg-slate-800 mb-3" />
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-10 rounded-lg bg-slate-800/50" />
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
        <div className="h-5 w-16 rounded bg-slate-800 mb-3" />
        <div className="h-20 rounded bg-slate-800" />
      </div>
    </div>
  );
}
