import React, { createContext, useContext, useState, ReactNode } from "react";
import { User, Role } from "@/types";

interface AuthContextType {
  user: User | null;
  login: (employeeId: string, password: string) => boolean;
  signup: (name: string, email: string, department: string, password: string) => { success: boolean; employeeId?: string };
  logout: () => void;
  isAuthenticated: boolean;
  hasPermission: (permission: Permission) => boolean;
}

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

const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  employee: ["view_own_profile", "view_own_points", "change_password"],
  supervisor: ["view_own_profile", "view_own_points", "change_password", "view_department_employees", "manage_points"],
  admin: ["view_own_profile", "view_own_points", "change_password", "view_department_employees", "manage_points", "manage_employees", "delete_employees", "view_all_departments", "export_reports"],
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface StoredUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  department: string;
  employeeId: string;
  password: string;
}

const getStoredUsers = (): StoredUser[] => {
  const data = localStorage.getItem("rph_users");
  if (data) return JSON.parse(data);
  // Seed default users
  const defaults: StoredUser[] = [
    { id: "1", name: "Sarah Johnson", email: "sarah@company.com", role: "employee", department: "Engineering", employeeId: "EMP-0001", password: "password" },
    { id: "sup-1", name: "David Park", email: "david@company.com", role: "supervisor", department: "Engineering", employeeId: "EMP-0002", password: "password" },
    { id: "admin-1", name: "Admin User", email: "admin@company.com", role: "admin", department: "Management", employeeId: "ADM-0001", password: "password" },
  ];
  localStorage.setItem("rph_users", JSON.stringify(defaults));
  return defaults;
};

const saveUsers = (users: StoredUser[]) => {
  localStorage.setItem("rph_users", JSON.stringify(users));
};

const generateEmployeeId = (): string => {
  const users = getStoredUsers();
  const empUsers = users.filter(u => u.employeeId.startsWith("EMP-"));
  const maxNum = empUsers.reduce((max, u) => {
    const num = parseInt(u.employeeId.replace("EMP-", ""), 10);
    return num > max ? num : max;
  }, 0);
  return `EMP-${String(maxNum + 1).padStart(4, "0")}`;
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (employeeId: string, password: string): boolean => {
    const users = getStoredUsers();
    const found = users.find(u => u.employeeId.toLowerCase() === employeeId.toLowerCase() && u.password === password);
    if (found) {
      setUser({ id: found.id, name: found.name, email: found.email, role: found.role, department: found.department, employeeId: found.employeeId });
      return true;
    }
    return false;
  };

  const signup = (name: string, email: string, department: string, password: string) => {
    const users = getStoredUsers();
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false };
    }
    const employeeId = generateEmployeeId();
    const newUser: StoredUser = {
      id: `user-${Date.now()}`,
      name,
      email,
      role: "employee",
      department,
      employeeId,
      password,
    };
    users.push(newUser);
    saveUsers(users);
    setUser({ id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role, department: newUser.department, employeeId: newUser.employeeId });
    return { success: true, employeeId };
  };

  const logout = () => setUser(null);

  const hasPermission = (permission: Permission): boolean => {
    if (!user) return false;
    return ROLE_PERMISSIONS[user.role].includes(permission);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isAuthenticated: !!user, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
