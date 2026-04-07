import { useEffect } from "react";
import { UserRole } from "@/lib/index";

interface RoleBasedThemeProps {
  role: UserRole;
  children: React.ReactNode;
}

export const RoleBasedTheme = ({ role, children }: RoleBasedThemeProps) => {
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("theme-cashier", "theme-manager", "theme-admin");
    
    if (role === "Cashier" || role === "Staff") {
      root.classList.add("theme-cashier");
    } else if (role === "Manager") {
      root.classList.add("theme-manager");
    } else if (role === "Admin") {
      root.classList.add("theme-admin");
    }
  }, [role]);

  return <>{children}</>;
};
