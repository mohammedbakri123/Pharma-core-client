import { NavLink } from "react-router-dom";
import { cn } from "@/utils/utils";

export default function SidebarItem({ item }: any) {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.to}
      end={item.to === "/"} // مهم عشان الـ home
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group font-medium",
          isActive
            ? "bg-primary text-primary-foreground shadow-md"
            : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        )
      }
    >
      {({ isActive }) => (
        <>
          <Icon
            className={cn(
              "w-5 h-5",
              isActive
                ? "text-primary-foreground"
                : "text-sidebar-foreground/50"
            )}
          />
          {item.label}
        </>
      )}
    </NavLink>
  );
}
