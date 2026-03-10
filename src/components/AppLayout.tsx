import { NavLink as RouterNavLink, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { 
  LayoutDashboard, Users, Award, Settings, LogOut, ChevronLeft, Menu
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Role, ROLE_LABELS } from "@/types";
import { Crown } from "lucide-react";

interface NavItem {
  label: string;
  path: string;
  icon: React.ElementType;
}

const navByRole: Record<Role, NavItem[]> = {
  employee: [
    { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { label: "Settings", path: "/settings", icon: Settings },
  ],
  supervisor: [
    { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { label: "My Team", path: "/supervisor/team", icon: Users },
    { label: "Points", path: "/supervisor/points", icon: Award },
    { label: "Settings", path: "/settings", icon: Settings },
  ],
  admin: [
    { label: "Dashboard", path: "/admin", icon: LayoutDashboard },
    { label: "Employees", path: "/admin/employees", icon: Users },
    { label: "Points", path: "/admin/points", icon: Award },
    { label: "Settings", path: "/settings", icon: Settings },
  ],
};

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const navItems = navByRole[user?.role || "employee"];

  const SidebarContent = () => (
    <>
      <div className="p-4 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-sidebar-primary flex items-center justify-center flex-shrink-0">
          <Crown className="w-4 h-4 text-sidebar-primary-foreground" />
        </div>
        {!collapsed && <span className="font-semibold text-sidebar-accent-foreground text-sm">Royal Points Hub</span>}
      </div>

      {!collapsed && user && (
        <div className="px-4 pb-3">
          <span className="text-[10px] uppercase tracking-wider font-semibold text-sidebar-foreground/60">
            {ROLE_LABELS[user.role]}
          </span>
        </div>
      )}

      <nav className="flex-1 px-3 py-2 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <RouterNavLink
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
              )}
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </RouterNavLink>
          );
        })}
      </nav>

      <div className="p-3 border-t border-sidebar-border">
        {!collapsed && user && (
          <div className="px-3 py-2 mb-2">
            <p className="text-xs font-medium text-sidebar-accent-foreground truncate">{user.name}</p>
            <p className="text-xs text-sidebar-foreground truncate">{user.employeeId}</p>
          </div>
        )}
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground transition-colors w-full"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex w-full bg-background">
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-foreground/20 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col bg-sidebar border-r border-sidebar-border transition-transform lg:hidden",
          mobileOpen ? "translate-x-0 w-60" : "-translate-x-full"
        )}
      >
        <SidebarContent />
      </aside>

      <aside
        className={cn(
          "hidden lg:flex flex-col bg-sidebar border-r border-sidebar-border flex-shrink-0 transition-all",
          collapsed ? "w-16" : "w-60"
        )}
      >
        <SidebarContent />
        <div className="p-3">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex items-center justify-center w-full py-2 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors"
          >
            <ChevronLeft className={cn("w-4 h-4 transition-transform", collapsed && "rotate-180")} />
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="lg:hidden flex items-center h-14 px-4 border-b border-border bg-card">
          <button onClick={() => setMobileOpen(true)} className="text-foreground">
            <Menu className="w-5 h-5" />
          </button>
          <span className="ml-3 font-semibold text-sm">Royal Points Hub</span>
        </header>

        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
