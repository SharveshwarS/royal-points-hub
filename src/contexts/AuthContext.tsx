

import { Role, User } from "@/types";
import { createContext, ReactNode, useContext, useState } from "react";

export type Permission =
  | "view_own_profile"
  | "view_own_points"
  | "change_password"
  | "view_department_employees"
  | "manage_points"
  | "manage_employees"
  | "delete_employees"
  | "view_all_departments"
  | "export_reports";

interface AuthContextType {
  user: User | null;
  login: (user: User) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
  hasPermission: (permission: Permission) => boolean;
}

const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  employee: ["view_own_profile", "view_own_points", "change_password"],
  supervisor: [
    "view_own_profile",
    "view_own_points",
    "change_password",
    "view_department_employees",
    "manage_points",
  ],
  admin: [
    "view_own_profile",
    "view_own_points",
    "change_password",
    "view_department_employees",
    "manage_points",
    "manage_employees",
    "delete_employees",
    "view_all_departments",
    "export_reports",
  ],
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
  const stored = localStorage.getItem("user");
  return stored ? JSON.parse(stored) : null;
});

  const login = (user: User): boolean => {
   const loggedUser = {
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  department: user.department,
  employeeId: user.employeeId,
};

setUser(loggedUser);
localStorage.setItem("user", JSON.stringify(loggedUser));
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  const hasPermission = (permission: Permission): boolean => {
    if (!user) return false;
    return ROLE_PERMISSIONS[user.role].includes(permission);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}

