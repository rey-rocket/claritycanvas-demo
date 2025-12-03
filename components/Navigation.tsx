"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FolderKanban, Users, Sun, Moon } from "lucide-react";
import { useTheme } from "@/lib/theme-context";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/projects", label: "Projects", icon: FolderKanban },
  { href: "/capacity", label: "Capacity", icon: Users }
];

export function Navigation() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="flex flex-col justify-between h-full">
      <nav className="space-y-2">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={
                "group flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 " +
                (active
                  ? "bg-cc-surface-soft text-cc-teal-dark shadow-soft"
                  : "text-cc-text-muted hover:bg-cc-surface-soft/50 hover:text-cc-teal hover:translate-x-1")
              }
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <Icon className={`h-5 w-5 transition-transform duration-200 ${!active && 'group-hover:scale-110'}`} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <button
        onClick={toggleTheme}
        className="mt-6 flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-cc-text-muted transition-all duration-200 hover:bg-cc-surface-soft/50 hover:text-cc-teal group"
        title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      >
        {theme === "dark" ? (
          <>
            <Sun className="h-5 w-5 transition-transform duration-200 group-hover:rotate-45 group-hover:scale-110" />
            Light Mode
          </>
        ) : (
          <>
            <Moon className="h-5 w-5 transition-transform duration-200 group-hover:-rotate-12 group-hover:scale-110" />
            Dark Mode
          </>
        )}
      </button>
    </div>
  );
}
