import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const EmployeeSettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

 const handleProfileUpdate = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!user) return;

  try {

    const response = await fetch(`https://royal-points-hub-production.up.railway.app/api/auth/update_users/${user.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        email: email,
      }),
    });

    if (response.ok) {

      const updatedUser = await response.json();

      // update localStorage + AuthContext
      localStorage.setItem("user", JSON.stringify(updatedUser));

      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });

    } else {

      toast({
        title: "Update Failed",
        description: "Could not update profile.",
        variant: "destructive",
      });

    }

  } catch (error) {

    toast({
      title: "Server Error",
      description: "Backend not reachable.",
      variant: "destructive",
    });

  }
};

  const handlePasswordChange = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!user) return;

  if (newPassword !== confirmPassword) {
    toast({
      title: "Error",
      description: "Passwords do not match.",
      variant: "destructive",
    });
    return;
  }

  if (newPassword.length < 6) {
    toast({
      title: "Error",
      description: "Password must be at least 6 characters.",
      variant: "destructive",
    });
    return;
  }

  try {

    const response = await fetch(`https://royal-points-hub-production.up.railway.app/api/auth/update_users/${user.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password: newPassword,
      }),
    });

    if (response.ok) {

      toast({
        title: "Password Changed",
        description: "Your password has been updated.",
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

    } else {

      toast({
        title: "Error",
        description: "Password update failed.",
        variant: "destructive",
      });

    }

  } catch (error) {

    toast({
      title: "Server Error",
      description: "Backend not reachable.",
      variant: "destructive",
    });

  }
};

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your account</p>
      </div>

      <Card className="card-shadow border-border">
        <CardHeader>
          <CardTitle className="text-lg">Profile Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <Button type="submit">Save Changes</Button>
          </form>
        </CardContent>
      </Card>

      <Card className="card-shadow border-border">
        <CardHeader>
          <CardTitle className="text-lg">Change Password</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current">Current Password</Label>
              <Input id="current" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new">New Password</Label>
              <Input id="new" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm">Confirm New Password</Label>
              <Input id="confirm" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            </div>
            <Button type="submit">Update Password</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeSettings;
