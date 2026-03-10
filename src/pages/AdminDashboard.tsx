import { mockEmployees, mockPointsHistory } from "@/data/mockData";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Award, Activity } from "lucide-react";

const AdminDashboard = () => {
  const totalEmployees = mockEmployees.length;
  const totalPoints = mockEmployees.reduce((sum, e) => sum + e.totalPoints, 0);
  const recentActivity = mockPointsHistory.slice(0, 5);

  const stats = [
    { label: "Total Employees", value: totalEmployees, icon: Users, color: "text-primary" },
    { label: "Points Distributed", value: totalPoints.toLocaleString(), icon: Award, color: "text-success" },
    { label: "Recent Events", value: mockPointsHistory.length, icon: Activity, color: "text-warning" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Admin Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Overview of employee points system</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="card-shadow border-border">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-semibold text-foreground">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="card-shadow border-border">
        <CardContent className="pt-6">
          <h2 className="font-semibold text-foreground mb-4">Recent Activity</h2>
          {recentActivity.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">No recent activity.</p>
          ) : (
            <div className="space-y-3">
              {recentActivity.map((entry) => {
                const emp = mockEmployees.find((e) => e.id === entry.employeeId);
                return (
                  <div key={entry.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <div>
                      <p className="text-sm font-medium text-foreground">{entry.event}</p>
                      <p className="text-xs text-muted-foreground">{emp?.name} · {entry.date}</p>
                    </div>
                    <div className="text-sm font-medium">
                      {entry.pointsAdded > 0 && <span className="text-success">+{entry.pointsAdded}</span>}
                      {entry.pointsRemoved > 0 && <span className="text-destructive">-{entry.pointsRemoved}</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
