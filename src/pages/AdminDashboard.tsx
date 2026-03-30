import { mockEmployees, mockPointsHistory } from "@/data/mockData";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Award, Activity } from "lucide-react";
import { useState } from "react";
import { useEffect } from "react";


const AdminDashboard = () => {

const [employees, setEmployees] = useState([]);
const [transactions, setTransactions] = useState([]);

  useEffect(() => {
  fetchDashboardData();
}, []);

const fetchDashboardData = async () => {
  try {
    // 1. Fetch users
    const userRes = await fetch("https://royal-points-hub-production.up.railway.app/api/admin/users");
    const usersData = await userRes.json();

    const usersArray = Array.isArray(usersData) ? usersData : [usersData];
    setEmployees(usersArray);

    // 2. Fetch transactions (you need this API)
    const txRes = await fetch("https://royal-points-hub-production.up.railway.app/api/admin/transactions");
    const txData = await txRes.json();

    setTransactions(txData);

  } catch (err) {
    console.error(err);
  }
}

const totalEmployees = employees.length;
const totalPoints = employees.reduce(
  (sum: number, e: any) => sum + (e.points || 0),
  0
);
const today = new Date().toISOString().split("T")[0];

const recentTransactions = transactions.filter((t: any) =>
  t.createdAt.startsWith(today)
);

const recentActivity = transactions.slice(0,5);

  const stats = [
    { label: "Total Employees", value: totalEmployees, icon: Users, color: "text-primary" },
    { label: "Points Distributed", value: totalPoints.toLocaleString(), icon: Award, color: "text-success" },
    { label: "Recent Events", value: recentTransactions.length, icon: Activity, color: "text-warning" },
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
                const emp = employees.find((e: any) => e.id === entry.userId);
                //const emp = entry.user;
                return (
                  <div key={entry.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <div>
                      <p className="text-sm font-medium text-foreground">{entry.reason}</p>
                      <p className="text-xs text-muted-foreground">{emp?.name} · {`EMP-${String(entry.userId).padStart(3, "0")}`}</p>
                      
                    </div>
                    <div className="text-sm font-medium">
                     {entry.type === "ADD" && (<span className="text-success">+{entry.points}</span>)}
                     {entry.type === "DEDUCT" && (<span className="text-destructive">-{entry.points}</span>)}
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
