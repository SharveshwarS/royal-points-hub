import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Award, Building, Hash, Mail, User } from "lucide-react";

const EmployeeDashboard = () => {
  const { user } = useAuth();

  if (!user) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="space-y-6 animate-fade-in">

      <div>
        <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Welcome back, {user.name}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Profile Card */}
        <Card className="card-shadow border-border">
          <CardContent className="pt-6">

            <div className="flex flex-col items-center text-center">

              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <User className="w-7 h-7 text-primary" />
              </div>

              <h2 className="font-semibold text-foreground">{user.name}</h2>
              <p className="text-sm text-muted-foreground mt-1">
                {user.department}
              </p>

            </div>

            <div className="mt-6 space-y-3">

              <div className="flex items-center gap-3 text-sm">
                <Hash className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">ID:</span>
                <span className="text-foreground font-medium ml-auto">
                  {user.employeeId}
                </span>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Email:</span>
                <span className="text-foreground font-medium ml-auto truncate max-w-[160px]">
                  {user.email}
                </span>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <Building className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Dept:</span>
                <span className="text-foreground font-medium ml-auto">
                  {user.department}
                </span>
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

            <p className="text-sm text-muted-foreground mb-2">
              Current Points
            </p>

            <p className="text-5xl font-bold text-foreground">
              0
            </p>

            <p className="text-sm text-muted-foreground mt-2">
              Points will load from backend
            </p>

          </CardContent>
        </Card>

      </div>

    </div>
  );
};

export default EmployeeDashboard;
