import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center">
      <div className="text-center">
        <h2 className="mb-2 text-4xl font-bold text-slate-400">404</h2>
        <p className="mb-4 text-lg text-slate-500">Page not found</p>
        <p className="mb-6 text-sm text-slate-600">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-slate-950 hover:bg-emerald-400"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
