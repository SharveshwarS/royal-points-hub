import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { mockEmployees, mockPointsHistory as initialHistory } from "@/data/mockData";
import { PointEntry } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import PointsHistoryTable from "@/components/PointsHistoryTable";
import { useToast } from "@/hooks/use-toast";

const SupervisorPoints = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState<PointEntry[]>(initialHistory);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [event, setEvent] = useState("");
  const [pointsAdded, setPointsAdded] = useState("");
  const [pointsRemoved, setPointsRemoved] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { toast } = useToast();

  // Supervisors only see their department
  const departmentEmployees = mockEmployees.filter(
    (e) => e.department === user?.department
  );

  const employeeHistory = history.filter((h) => h.employeeId === selectedEmployee);
  const employee = departmentEmployees.find((e) => e.id === selectedEmployee);
  const currentTotal = employeeHistory.length > 0 ? employeeHistory[0].remainingPoints : employee?.totalPoints || 0;
  const newRemaining = currentTotal + (Number(pointsAdded) || 0) - (Number(pointsRemoved) || 0);

  const handleSubmit = () => {
    if (!selectedEmployee || !event.trim()) {
      toast({ title: "Error", description: "Please select an employee and enter an event.", variant: "destructive" });
      return;
    }
    if (!pointsAdded && !pointsRemoved) {
      toast({ title: "Error", description: "Enter points to add or remove.", variant: "destructive" });
      return;
    }
    setConfirmOpen(true);
  };

  const confirmSubmit = () => {
    const newEntry: PointEntry = {
      id: `p-${Date.now()}`,
      employeeId: selectedEmployee,
      date,
      event: event.trim(),
      pointedBy: user?.name || "Supervisor",
      pointsAdded: Number(pointsAdded) || 0,
      pointsRemoved: Number(pointsRemoved) || 0,
      remainingPoints: newRemaining,
    };
    setHistory([newEntry, ...history]);
    toast({ title: "Points Updated", description: `Points updated for ${employee?.name}.` });
    setEvent("");
    setPointsAdded("");
    setPointsRemoved("");
    setConfirmOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Team Points</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage points for {user?.department} team</p>
      </div>

      <Card className="card-shadow border-border">
        <CardHeader>
          <CardTitle className="text-lg">Update Points</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Select Employee</Label>
              <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose team member" />
                </SelectTrigger>
                <SelectContent>
                  {departmentEmployees.map((emp) => (
                    <SelectItem key={emp.id} value={emp.id}>
                      {emp.name} ({emp.employeeId})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Date</Label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Event / Reason</Label>
              <Input value={event} onChange={(e) => setEvent(e.target.value)} placeholder="e.g. Team collaboration" />
            </div>
            <div className="space-y-2">
              <Label>Pointed By</Label>
              <Input value={user?.name || "Supervisor"} disabled />
            </div>
            <div />
            <div className="space-y-2">
              <Label>Points to Add</Label>
              <Input type="number" min="0" value={pointsAdded} onChange={(e) => setPointsAdded(e.target.value)} placeholder="0" />
            </div>
            <div className="space-y-2">
              <Label>Points to Remove</Label>
              <Input type="number" min="0" value={pointsRemoved} onChange={(e) => setPointsRemoved(e.target.value)} placeholder="0" />
            </div>
          </div>

          {selectedEmployee && (
            <div className="mt-4 p-4 rounded-lg bg-muted">
              <p className="text-sm text-muted-foreground">
                Current: <span className="font-medium text-foreground">{currentTotal}</span> →
                New Remaining: <span className="font-semibold text-foreground">{newRemaining}</span>
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
            <CardTitle className="text-lg">Points History — {employee?.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <PointsHistoryTable entries={employeeHistory} />
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
            <AlertDialogAction onClick={confirmSubmit}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SupervisorPoints;
