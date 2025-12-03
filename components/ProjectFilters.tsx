"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ProjectStatus } from "@/lib/types";

type ProjectFiltersProps = {
  designers: string[];
};

export function ProjectFilters({ designers }: ProjectFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentDesigner = searchParams.get("designer") || "";
  const currentStatus = searchParams.get("status") || "";

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push(pathname);
  };

  const hasFilters = currentDesigner || currentStatus;

  return (
    <div className="flex flex-wrap items-center gap-3">
      <select
        value={currentDesigner}
        onChange={(e) => updateFilter("designer", e.target.value)}
        className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-900 focus:border-teal-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
      >
        <option value="">All Designers</option>
        {designers.map((designer) => (
          <option key={designer} value={designer}>
            {designer}
          </option>
        ))}
      </select>

      <select
        value={currentStatus}
        onChange={(e) => updateFilter("status", e.target.value)}
        className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-900 focus:border-teal-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
      >
        <option value="">All Statuses</option>
        {Object.values(ProjectStatus).map((status) => (
          <option key={status} value={status}>
            {status.replace("_", " ")}
          </option>
        ))}
      </select>

      {hasFilters && (
        <button
          onClick={clearFilters}
          className="text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
