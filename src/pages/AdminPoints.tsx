import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { PointEntry } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import PointsHistoryTable from "@/components/PointsHistoryTable";
import { useToast } from "@/hooks/use-toast";

const API = "http://localhost:8080/api/admin";

const AdminPoints = () => {

  const { user } = useAuth();
  const { toast } = useToast();

  const [employees, setEmployees] = useState<any[]>([]);
  const [history, setHistory] = useState<PointEntry[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [event, setEvent] = useState("");
  const [pointsAdded, setPointsAdded] = useState("");
  const [pointsRemoved, setPointsRemoved] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);

  /* ---------------- API CALLS ---------------- */

  const getUsers = async () => {
    const res = await fetch(`${API}/users`);
    return res.json();
  };

  const getUserTransactions = async (userId: number) => {
    const res = await fetch(`${API}/user/${userId}`);
    return res.json();
  };

  const addPoints = async (data: any) => {
    const res = await fetch(`${API}/add-points`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });
    return res.json();
  };

  const deductPoints = async (data: any) => {
    const res = await fetch(`${API}/deduct-points`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });
    return res.json();
  };

  /* ---------------- LOAD DATA ---------------- */

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    const data = await getUsers();
    setEmployees(data);
  };

  const loadHistory = async (userId: number) => {
    const data = await getUserTransactions(userId);
    setHistory(data);
  };

  /* ---------------- LOGIC ---------------- */

  const employee = employees.find((e) => String(e.id) === selectedEmployee);

  const currentTotal =
    history.length > 0
      ? history[0].remainingPoints
      : employee?.totalPoints || 0;

  const newRemaining =
    currentTotal + (Number(pointsAdded) || 0) - (Number(pointsRemoved) || 0);

  const handleSubmit = () => {
    if (!selectedEmployee || !event.trim()) {
      toast({
        title: "Error",
        description: "Please select an employee and enter an event.",
        variant: "destructive"
      });
      return;
    }

    if (!pointsAdded && !pointsRemoved) {
      toast({
        title: "Error",
        description: "Enter points to add or remove.",
        variant: "destructive"
      });
      return;
    }

    setConfirmOpen(true);
  };

  const confirmSubmit = async () => {

    const data = {
      userId: Number(selectedEmployee),
      points: Number(pointsAdded || pointsRemoved),
      reason: event,
      date: date
    };

    try {

      if (pointsAdded) {
        await addPoints(data);
      } else {
        await deductPoints(data);
      }

      toast({
        title: "Points Updated",
        description: "Points updated successfully"
      });

      loadHistory(Number(selectedEmployee));

      setPointsAdded("");
      setPointsRemoved("");
      setEvent("");

    } catch (error) {

      toast({
        title: "Error",
        description: "Failed to update points",
        variant: "destructive"
      });

    }

    setConfirmOpen(false);
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="space-y-6 animate-fade-in">

      <div>
        <h1 className="text-2xl font-semibold text-foreground">
          Points Management
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Award or deduct employee points
        </p>
      </div>

      <Card className="card-shadow border-border">
        <CardHeader>
          <CardTitle className="text-lg">Update Points</CardTitle>
        </CardHeader>

        <CardContent>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div className="space-y-2">
              <Label>Select Employee</Label>

              <Select
                value={selectedEmployee}
                onValueChange={(value) => {
                  setSelectedEmployee(value);
                  loadHistory(Number(value));
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose employee" />
                </SelectTrigger>

                <SelectContent>
                  {employees.map((emp) => (
                    <SelectItem key={emp.id} value={String(emp.id)}>
                      {emp.name} ({emp.employeeId})
                    </SelectItem>
                  ))}
                </SelectContent>

              </Select>
            </div>

            <div className="space-y-2">
              <Label>Date</Label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>Event / Reason</Label>
              <Input
                value={event}
                onChange={(e) => setEvent(e.target.value)}
                placeholder="e.g. Quarterly bonus"
              />
            </div>

            <div className="space-y-2">
              <Label>Pointed By</Label>
              <Input value={user?.name || "Admin"} disabled />
            </div>

            <div />

            <div className="space-y-2">
              <Label>Points to Add</Label>
              <Input
                type="number"
                min="0"
                value={pointsAdded}
                onChange={(e) => setPointsAdded(e.target.value)}
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <Label>Points to Remove</Label>
              <Input
                type="number"
                min="0"
                value={pointsRemoved}
                onChange={(e) => setPointsRemoved(e.target.value)}
                placeholder="0"
              />
            </div>

          </div>

          {selectedEmployee && (
            <div className="mt-4 p-4 rounded-lg bg-muted">
              <p className="text-sm text-muted-foreground">
                Current:
                <span className="font-medium text-foreground"> {currentTotal}</span>
                →
                New Remaining:
                <span className="font-semibold text-foreground"> {newRemaining}</span>
              </p>
            </div>
          )}

          <div className="mt-6">
            <Button onClick={handleSubmit}>Submit Points</Button>
          </div>

        </CardContent>
      </Card>

      {selectedEmployee && (
        <Card className="card-shadow border-border">

          <CardHeader>
            <CardTitle className="text-lg">
              Points History — {employee?.name}
            </CardTitle>
          </CardHeader>

          <CardContent>
            <PointsHistoryTable entries={history} />
          </CardContent>

        </Card>
      )}

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>

        <AlertDialogContent>

          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Points Update</AlertDialogTitle>

            <AlertDialogDescription>
              Update points for {employee?.name}?
              {pointsAdded && ` Add ${pointsAdded} points.`}
              {pointsRemoved && ` Remove ${pointsRemoved} points.`}
              {` New balance: ${newRemaining}.`}
            </AlertDialogDescription>

          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmSubmit}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>

        </AlertDialogContent>

      </AlertDialog>

    </div>
  );
};

export default AdminPoints;