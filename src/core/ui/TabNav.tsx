import { NavLink, Outlet } from "react-router-dom";
import { cn } from "@/utils/utils";
import type { ReactNode } from "react";

interface TabItem {
  to: string;
  label: string;
  icon?: ReactNode;
}

interface TabNavProps {
  tabs: TabItem[];
  variant?: "pill" | "underline";
  children?: ReactNode;
}

export default function TabNav({
  tabs,
  variant = "pill",
  children,
}: TabNavProps) {
  return (
    <>
      {variant === "pill" ? (
        <div className="overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden mb-6">
          <div
            className="grid max-w-lg bg-muted/40 p-1.5 rounded-xl border border-border/40 gap-1"
            style={{ gridTemplateColumns: `repeat(${tabs.length}, 1fr)` }}
          >
            {tabs.map((tab) => (
              <NavLink
                key={tab.to}
                to={tab.to}
                className={({ isActive }) =>
                  cn(
                    "rounded-lg py-2.5 text-xs md:text-sm font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-muted",
                  )
                }
                end={tab.to.split("/").length <= 2}
              >
                {tab.icon}
                {tab.label}
              </NavLink>
            ))}
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden px-4 md:px-6 border-b border-border/40 bg-muted/5">
          <div className="flex justify-start gap-4 md:gap-6 p-0 h-12 rounded-none whitespace-nowrap">
            {tabs.map((tab) => (
              <NavLink
                key={tab.to}
                to={tab.to}
                className={({ isActive }) =>
                  cn(
                    "rounded-none border-b-2 border-transparent px-1 py-3 text-xs md:text-sm font-bold shadow-none cursor-pointer transition-colors shrink-0",
                    isActive
                      ? "border-primary text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )
                }
                end
              >
                {tab.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
      {children ?? <Outlet />}
    </>
  );
}
