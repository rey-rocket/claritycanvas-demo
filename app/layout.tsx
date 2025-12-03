import "./globals.css";
import type { ReactNode } from "react";
import { Navigation } from "@/components/Navigation";
import { ThemeProvider } from "@/lib/theme-context";

export const metadata = {
  title: "ClarityCanvas",
  description: "Capacity and risk dashboard for instructional design teams"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-cc-bg font-body text-cc-text-main">
        <ThemeProvider>
          <div className="flex min-h-screen">
            <aside className="hidden w-72 border-r border-cc-border-subtle bg-cc-surface p-8 md:block shadow-soft">
              <div className="mb-10 animate-[slideInFromLeft_0.5s_ease-in-out]">
                <h1 className="text-2xl font-display font-bold tracking-tight leading-tight">
                  <span className="text-cc-teal-dark">The Clarity </span>
                  <span className="bg-gradient-cc-primary bg-clip-text text-transparent">Canvas</span>
                </h1>
                <p className="mt-2 text-xs text-cc-text-muted leading-relaxed">
                  Capacity & Risk Management
                </p>
              </div>
              <Navigation />
            </aside>
            <main className="flex-1 p-8 lg:p-12 max-w-[1600px]">{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
