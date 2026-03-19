import { useState } from "react";
import { useEffect } from "react";
//import { mockEmployees as initialEmployees } from "@/data/mockData";
import { Employee } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Search, Plus, Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";


const AdminEmployees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [search, setSearch] = useState("");
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<Employee | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", department: "", employeeId: "" });
  const { toast } = useToast();

  const filtered = employees.filter(
    (e) =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.email.toLowerCase().includes(search.toLowerCase()) ||
      e.employeeId.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
  fetchUsers();
}, []);

const fetchUsers = async () => {
  try {
    const res = await fetch("http://localhost:8080/api/admin/users");
    if (!res.ok) throw new Error("API error");

    const users = await res.json();

    setEmployees(
      users.map((u: any, i: number) => ({
        id: String(u.id),
        name: u.name,
        email: u.email,
        department: u.department,
        //employeeId: `EMP-${String(i + 1).padStart(3, "0")}`,
        employeeId: 'EMP - '+String(u.id).padStart(3,"0"),
        totalPoints: u.points ?? 0, // safer
      }))
    );
  } catch (err) {
    console.error("Fetch error:", err);
  }
};

  const openAdd = () => {
    setIsNew(true);
    setForm({ name: "", email: "", department: "", employeeId: "" });
    setEditOpen(true);
  };

  const openEdit = (emp: Employee) => {
    setIsNew(false);
    setSelected(emp);
    setForm({ name: emp.name, email: emp.email, department: emp.department, employeeId: emp.employeeId });
    setEditOpen(true);
  };

  const openDelete = (emp: Employee) => {
    setSelected(emp);
    setDeleteOpen(true);
  };

  // const handleSave = () => {
  //   if (!form.name.trim() || !form.email.trim()) {
  //     toast({ title: "Error", description: "Name and email are required.", variant: "destructive" });
  //     return;
  //   }
  //   if (isNew) {
  //     const newEmp: Employee = { id: String(Date.now()), ...form, totalPoints: 0 };
  //     setEmployees([...employees, newEmp]);
  //     toast({ title: "Employee Added", description: `${form.name} has been added.` });
  //   } else if (selected) {
  //     setEmployees(employees.map((e) => (e.id === selected.id ? { ...e, ...form } : e)));
  //     toast({ title: "Employee Updated", description: `${form.name} has been updated.` });
  //   }
  //   setEditOpen(false);
  // };

  const handleSave = async () => {
  if (!form.name.trim() || !form.email.trim()) {
    toast({
      title: "Error",
      description: "Name and email are required.",
      variant: "destructive"
    });
    return;
  }

  try {
    if (isNew) {
      // OPTIONAL: if you want backend create API
    } else if (selected) {
      await fetch(`http://localhost:8080/api/auth/update_users/${selected.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          department: form.department
        })
      });

      toast({
        title: "Employee Updated",
        description: `${form.name} updated successfully`
      });

      fetchUsers(); // 🔥 refresh data
    }

    setEditOpen(false);

  } catch (err) {
    console.error(err);
    toast({
      title: "Error",
      description: "Failed to update employee",
      variant: "destructive"
    });
  }
};

  // const handleDelete = () => {
  //   if (selected) {
  //     setEmployees(employees.filter((e) => e.id !== selected.id));
  //     toast({ title: "Employee Deleted", description: `${selected.name} has been removed.` });
  //   }
  //   setDeleteOpen(false);
  // };

  const handleDelete = async () => {
  if (!selected) return;

  try {
    await fetch(`http://localhost:8080/api/auth/delete_users/${selected.id}`, {
      method: "DELETE"
    });
    await fetch(`http://localhost:8080/api/admin/userTra/${selected.id}`, {
      method: "DELETE"
    });


    toast({
      title: "Employee Deleted",
      description: `${selected.name} removed successfully`
    });

    fetchUsers(); // 🔥 refresh list

  } catch (err) {
    console.error(err);
    toast({
      title: "Error",
      description: "Failed to delete employee",
      variant: "destructive"
    });
  }

  setDeleteOpen(false);
};

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Employees</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your team members</p>
        </div>
        <Button onClick={openAdd}>
          <Plus className="w-4 h-4 mr-2" /> Add Employee
        </Button>
      </div>

      <Card className="card-shadow border-border">
        <CardContent className="pt-6">
          <div className="relative mb-4 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search employees..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          {filtered.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-muted-foreground text-sm">No employees found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead className="text-right">Points</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((emp) => (
                    <TableRow key={emp.id}>
                      <TableCell className="text-sm font-mono">{emp.employeeId}</TableCell>
                      <TableCell className="text-sm font-medium">{emp.name}</TableCell>
                      <TableCell className="text-sm">{emp.email}</TableCell>
                      <TableCell className="text-sm">{emp.department}</TableCell>
                      <TableCell className="text-sm text-right font-medium">{emp.totalPoints}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="sm" onClick={() => openEdit(emp)}>
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => openDelete(emp)}>
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isNew ? "Add Employee" : "Edit Employee"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Department</Label>
              <Input value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Employee ID</Label>
              <Input value={form.employeeId} onChange={(e) => setForm({ ...form, employeeId: e.target.value })} disabled={!isNew} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{isNew ? "Add" : "Save"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Employee</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selected?.name}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminEmployees;
