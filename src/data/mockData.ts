import { Employee, PointEntry } from "@/types";

export const mockEmployees: Employee[] = [
  { id: "1", name: "Sarah Johnson", email: "sarah.johnson@company.com", department: "Engineering", employeeId: "EMP-001", totalPoints: 850, avatar: "" },
  { id: "2", name: "Michael Chen", email: "michael.chen@company.com", department: "Marketing", employeeId: "EMP-002", totalPoints: 620, avatar: "" },
  { id: "3", name: "Emily Davis", email: "emily.davis@company.com", department: "Design", employeeId: "EMP-003", totalPoints: 940, avatar: "" },
  { id: "4", name: "James Wilson", email: "james.wilson@company.com", department: "Sales", employeeId: "EMP-004", totalPoints: 510, avatar: "" },
  { id: "5", name: "Olivia Brown", email: "olivia.brown@company.com", department: "HR", employeeId: "EMP-005", totalPoints: 730, avatar: "" },
];

export const mockPointsHistory: PointEntry[] = [
  { id: "p1", employeeId: "1", date: "2026-02-25", event: "Quarterly Performance Bonus", pointedBy: "Admin", pointsAdded: 100, pointsRemoved: 0, remainingPoints: 850 },
  { id: "p2", employeeId: "1", date: "2026-02-20", event: "Late Submission Penalty", pointedBy: "Admin", pointsAdded: 0, pointsRemoved: 50, remainingPoints: 750 },
  { id: "p3", employeeId: "1", date: "2026-02-15", event: "Team Collaboration Award", pointedBy: "Admin", pointsAdded: 200, pointsRemoved: 0, remainingPoints: 800 },
  { id: "p4", employeeId: "1", date: "2026-02-10", event: "Project Milestone Completion", pointedBy: "Admin", pointsAdded: 150, pointsRemoved: 0, remainingPoints: 600 },
  { id: "p5", employeeId: "1", date: "2026-01-28", event: "Training Completion", pointedBy: "Admin", pointsAdded: 75, pointsRemoved: 0, remainingPoints: 450 },
  { id: "p6", employeeId: "1", date: "2026-01-15", event: "Onboarding Bonus", pointedBy: "Admin", pointsAdded: 375, pointsRemoved: 0, remainingPoints: 375 },
  { id: "p7", employeeId: "2", date: "2026-02-22", event: "Campaign Success Bonus", pointedBy: "Admin", pointsAdded: 120, pointsRemoved: 0, remainingPoints: 620 },
  { id: "p8", employeeId: "2", date: "2026-02-10", event: "Onboarding Bonus", pointedBy: "Admin", pointsAdded: 500, pointsRemoved: 0, remainingPoints: 500 },
  { id: "p9", employeeId: "3", date: "2026-02-24", event: "Design Excellence Award", pointedBy: "Admin", pointsAdded: 200, pointsRemoved: 0, remainingPoints: 940 },
  { id: "p10", employeeId: "3", date: "2026-02-18", event: "Onboarding Bonus", pointedBy: "Admin", pointsAdded: 500, pointsRemoved: 0, remainingPoints: 740 },
  { id: "p11", employeeId: "3", date: "2026-02-12", event: "Workshop Attendance", pointedBy: "Admin", pointsAdded: 240, pointsRemoved: 0, remainingPoints: 240 },
];
