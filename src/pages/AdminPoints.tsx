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

const API = "https://royal-points-hub-production.up.railway.app/api/admin";

const AdminPoints = () => {

  const { user } = useAuth();
  const { toast } = useToast();
  const [positiveReason, setPositiveReason] = useState("");
  const [negativeReason, setNegativeReason] = useState("");

  const [employees, setEmployees] = useState<any[]>([]);
  const [history, setHistory] = useState<PointEntry[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [event, setEvent] = useState("");
  const [pointsAdded, setPointsAdded] = useState("");
  const [pointsRemoved, setPointsRemoved] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
   const [totalPoints, setTotalPoints] = useState<number>(0);

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

  const getTotalPoints = async (userId: number) => {
  const res = await fetch(`${API}/total-points/${userId}`);
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
  const total = await getTotalPoints(userId);

  setTotalPoints(total);

  // Step 1: format normally
  const formatted = data.map((item: any) => ({
    id: item.id,
    employeeId: String(item.userId),
    date: new Date(item.createdAt).toLocaleString(),
    reason: item.reason,
    pointsAdded: item.type === "ADD" ? item.points : 0,
    pointsRemoved: item.type === "DEDUCT" ? item.points : 0,
  }));

  // Step 2: sort latest first
  const reversed = formatted.reverse();

  // Step 3: calculate remaining backwards
  let running = total;

  const withBalance = reversed.map((item: any) => {
    const current = running;

    running =
      running - item.pointsAdded + item.pointsRemoved;

    return {
      ...item,
      remainingPoints: current,
    };
  });

  setHistory(withBalance);
};

 

  /* ---------------- LOGIC ---------------- */

  const employee = employees.find((e) => String(e.id) === selectedEmployee);

  const currentTotal = totalPoints;

  const newRemaining =
  totalPoints + (Number(pointsAdded) || 0) - (Number(pointsRemoved) || 0);

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
      setPositiveReason("");  // add this
      setNegativeReason("");  // add this

    } catch (error) {

      toast({
        title: "Error",
        description: "Failed to update points",
        variant: "destructive"
      });

    }

    setConfirmOpen(false);
  };

  const POSITIVE_POINTS: Record<string, number> = {
  "client acquisition-new": 1,
  "New high value order": 2,
  "Monthly performance -very good": 1,
  "monthly performance- outstanding": 2,
  "Good housekeeping-factory": 1,
  "Good filing/documentation": 1,
  "Special Mention": 3,
};

const NEGATIVE_POINTS: Record<string, number> = {
  "Routine Late attendance": 1,
  "Unauthorised absence": 2,
  "Irregular uniform": 1,
  "Refusal of work alloted": 2,
  "Impolite behaviour": 1,
  "Negligence of duty": 2,
  "Slow response": 1,
  "Damage to mold/machines": 2,
  "Rejection of tyres": 2,
  "Special Mention": 3,
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
                      {emp.name} - {emp.id}
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

            <div className="space-y-2">
  <Label>Positive Reason</Label>
  <Select
    value={pointsAdded && event ? event : ""}
    onValueChange={(value) => {
  setPositiveReason(value);
  setNegativeReason("");
  setPointsRemoved("");
  setPointsAdded(String(POSITIVE_POINTS[value] ?? ""));
  setEvent(value === "Special Mention" ? "" : value);
}}
  >
    <SelectTrigger>
      <SelectValue placeholder="Select positive reason" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="client acquisition-new">client acquisition-new</SelectItem>
      <SelectItem value="New high value order">New high value order</SelectItem>
      <SelectItem value="Monthly performance -very good">Monthly performance -very good</SelectItem>
      <SelectItem value="monthly performance- outstanding">monthly performance- outstanding</SelectItem>
      <SelectItem value="Good housekeeping-factory">Good housekeeping-factory</SelectItem>
      <SelectItem value="Good filing/documentation">Good filing/documentation</SelectItem>
      <SelectItem value="Special Mention"> Special Mention</SelectItem>
    </SelectContent>
  </Select>
  {positiveReason === "Special Mention" && (
    <Input
      value={event}
      onChange={(e) => setEvent(e.target.value)}
      placeholder="Enter custom positive reason..."
    />
  )}
</div>

<div className="space-y-2">
  <Label>Negative Reason</Label>
  <Select
    value={pointsRemoved && event ? event : ""}
    onValueChange={(value) => {
  setNegativeReason(value);
  setPositiveReason("");
  setPointsAdded("");
  setPointsRemoved(String(NEGATIVE_POINTS[value] ?? ""));
  setEvent(value === "Special Mention" ? "" : value);
}}
  >
    <SelectTrigger>
      <SelectValue placeholder="Select negative reason" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="Routine Late attendance">Routine Late attendance</SelectItem>
      <SelectItem value="Unauthorised absence">Unauthorised absence</SelectItem>
      <SelectItem value="Irregular uniform">Irregular uniform</SelectItem>
      <SelectItem value="Refusal of work alloted">Refusal of work alloted</SelectItem>
      <SelectItem value="Impolite behaviour">Impolite behaviour</SelectItem>
      <SelectItem value="Negligence of duty">Negligence of duty</SelectItem>
      <SelectItem value="Slow response">Slow response</SelectItem>
      <SelectItem value="Damage to mold/machines">Damage to mold/machines</SelectItem>
      <SelectItem value="Rejection of tyres">Rejection of tyres</SelectItem>
      <SelectItem value="Special Mention"> Special Mention</SelectItem>
    </SelectContent>
  </Select>
  {negativeReason === "Special Mention" && (
    <Input
      value={event}
      onChange={(e) => setEvent(e.target.value)}
      placeholder="Enter custom negative reason..."
    />
  )}
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
    readOnly={positiveReason !== "" && positiveReason !== "Special Mention"}
    className={positiveReason !== "" && positiveReason !== "Special Mention" ? "bg-muted cursor-not-allowed" : ""}
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
    readOnly={negativeReason !== "" && negativeReason !== "Special Mention"}
    className={negativeReason !== "" && negativeReason !== "Special Mention" ? "bg-muted cursor-not-allowed" : ""}
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