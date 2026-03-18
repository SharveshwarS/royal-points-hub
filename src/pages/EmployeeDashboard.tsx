import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Award, Building, Hash, Mail, User, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import PointsHistoryTable from "@/components/PointsHistoryTable";
import { PointEntry } from "@/types";

const API = "http://localhost:8080/api/admin";

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const [points, setPoints] = useState<number | null>(null);
  const [history, setHistory] = useState<PointEntry[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const getUserPoints = async (userId: number) => {
    const res = await fetch(`${API}/total-points/${userId}`);
    return res.json();
  };

  const getUserTransactions = async (userId: number) => {
    const res = await fetch(`${API}/user/${userId}`);
    return res.json();
  };

  useEffect(() => {
    if (user) {
      loadPoints();
      loadHistory();
    }
  }, [user]);

  const loadPoints = async () => {
    try {
      const data = await getUserPoints(Number(user?.id));
      setPoints(data);
    } catch (error) {
      console.error("Failed to load points");
    }
  };

  const loadHistory = async () => {
    setLoadingHistory(true);
    try {
      const data = await getUserTransactions(Number(user?.id));
      setHistory(data);
    } catch (error) {
      console.error("Failed to load history");
    } finally {
      setLoadingHistory(false);
    }
  };

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
              <p className="text-sm text-muted-foreground mt-1">{user.department}</p>
            </div>

            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Hash className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">ID:</span>
                <span className="text-foreground font-medium ml-auto">{user.id}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Email:</span>
                <span className="text-foreground font-medium ml-auto truncate max-w-[160px]">{user.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Building className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Dept:</span>
                <span className="text-foreground font-medium ml-auto">{user.department}</span>
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
            <p className="text-5xl font-bold text-foreground">
              {points !== null ? points : "..."}
            </p>
          </CardContent>
        </Card>

      </div>

      {/* Points History */}
      <Card className="card-shadow border-border">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            Points History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loadingHistory ? (
            <div className="text-sm text-muted-foreground text-center py-8">
              Loading history...
            </div>
          ) : (
            <PointsHistoryTable entries={history} />
          )}
        </CardContent>
      </Card>

    </div>
  );
};

export default EmployeeDashboard;