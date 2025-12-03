"use client";

import { Download } from "lucide-react";

type Project = {
  id: string;
  title: string;
  client: string;
  instructionalDesigner: string;
  status: string;
  priority: string | null;
  dueDate: Date;
  earlyReminderDate: Date | null;
  estimatedScopedHours: number;
  hoursWorked: number;
  mediaBudget: string | null;
};

type Designer = {
  designerName: string;
  capacity: number;
  estimatedHours: number;
  hoursRemaining: number;
  activeProjects: Project[];
};

type ExportButtonProps = {
  projects: Project[];
  designers: Designer[];
};

export function ExportButton({ projects, designers }: ExportButtonProps) {
  const handleExport = () => {
    // Generate CSV content
    const csvRows: string[] = [];

    // Header
    csvRows.push("ClarityCanvas Project Report");
    csvRows.push(`Generated: ${new Date().toLocaleString()}`);
    csvRows.push("");

    // Team Summary
    csvRows.push("TEAM SUMMARY");
    csvRows.push("Designer,Capacity (hrs),Planned (hrs),Remaining (hrs),Active Projects");
    designers.forEach((d) => {
      csvRows.push(
        `"${d.designerName}",${d.capacity.toFixed(1)},${d.estimatedHours.toFixed(1)},${d.hoursRemaining.toFixed(1)},${d.activeProjects.length}`
      );
    });
    csvRows.push("");

    // Projects
    csvRows.push("ALL PROJECTS");
    csvRows.push("Title,Client,Designer,Priority,Status,Due Date,Early Reminder,Scoped Hours,Hours Worked,% Complete,Media Budget");
    projects.forEach((p) => {
      const percentComplete = ((p.hoursWorked / p.estimatedScopedHours) * 100).toFixed(0);
      csvRows.push(
        `"${p.title}","${p.client}","${p.instructionalDesigner}","${p.priority || "None"}","${p.status}","${p.dueDate.toDateString()}","${p.earlyReminderDate ? p.earlyReminderDate.toDateString() : "None"}",${p.estimatedScopedHours.toFixed(1)},${p.hoursWorked.toFixed(1)},${percentComplete}%,"${p.mediaBudget || "None"}"`
      );
    });

    const csvContent = csvRows.join("\n");

    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `claritycanvas-report-${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button
      onClick={handleExport}
      className="group flex items-center gap-2 rounded-pill bg-cc-teal px-6 py-2.5 text-sm font-display font-semibold text-white shadow-btn-secondary transition-all duration-200 hover:bg-cc-teal-dark hover:shadow-btn-primary hover:-translate-y-0.5"
    >
      <Download className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
      Export Report
    </button>
  );
}
