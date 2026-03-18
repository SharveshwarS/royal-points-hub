export type Role = "employee" | "supervisor" | "admin";

export const ROLE_LABELS: Record<Role, string> = {
  employee: "Employee",
  supervisor: "Supervisor",
  admin: "Admin",
};

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  department: string;
  employeeId: string;
  avatar?: string;
}

export interface PointEntry {
  id: string;
  employeeId: string;
  date: string;
  reason: string;
  pointedBy: string;
  pointsAdded: number;
  pointsRemoved: number;
  remainingPoints: number;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  employeeId: string;
  totalPoints: number;
  avatar?: string;
}
