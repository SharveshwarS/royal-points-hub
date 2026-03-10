import { useAuth } from "@/contexts/AuthContext";
import { mockEmployees, mockPointsHistory } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, User, Mail, Building, Hash } from "lucide-react";
import PointsHistoryTable from "@/components/PointsHistoryTable";

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const employee = mockEmployees.find((e) => e.id === user?.id) || mockEmployees[0];
  const history = mockPointsHistory.filter((h) => h.employeeId === employee.id);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Welcome back, {employee.name}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="card-shadow border-border">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <User className="w-7 h-7 text-primary" />
              </div>
              <h2 className="font-semibold text-foreground">{employee.name}</h2>
              <p className="text-sm text-muted-foreground mt-1">{employee.department}</p>
            </div>
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Hash className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">ID:</span>
                <span className="text-foreground font-medium ml-auto">{employee.employeeId}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Email:</span>
                <span className="text-foreground font-medium ml-auto truncate max-w-[160px]">{employee.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Building className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Dept:</span>
                <span className="text-foreground font-medium ml-auto">{employee.department}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Points Highlight */}
        <Card className="lg:col-span-2 card-shadow border-border">
          <CardContent className="pt-6 flex flex-col items-center justify-center h-full">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Award className="w-7 h-7 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground mb-2">Current Points</p>
            <p className="text-5xl font-bold text-foreground">{employee.totalPoints}</p>
            <p className="text-sm text-muted-foreground mt-2">Total remaining points</p>
          </CardContent>
        </Card>
      </div>

      {/* Points History */}
      <Card className="card-shadow border-border">
        <CardHeader>
          <CardTitle className="text-lg">Points History</CardTitle>
        </CardHeader>
        <CardContent>
          <PointsHistoryTable entries={history} />
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeDashboard;
