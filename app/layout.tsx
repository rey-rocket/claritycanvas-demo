import "./globals.css";
import type { ReactNode } from "react";
import { Navigation } from "@/components/Navigation";

export const metadata = {
  title: "ClarityCanvas",
  description: "Capacity and risk dashboard for instructional design teams"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-slate-100">
        <div className="flex min-h-screen">
          <aside className="hidden w-64 border-r border-slate-800 bg-slate-900/60 p-4 md:block">
            <h1 className="mb-6 text-xl font-bold tracking-tight">
              <span className="text-emerald-400">Clarity</span>Canvas
            </h1>
            <Navigation />
          </aside>
          <main className="flex-1 p-4 md:p-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
