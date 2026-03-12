import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Crown, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const DEPARTMENTS = ["Engineering", "Marketing", "Design", "Sales", "HR", "Finance", "Operations"];

const SignupPage = () => {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignup = async (e: React.FormEvent) => {

    e.preventDefault();

    if (!name.trim() || !email.trim() || !department || !password.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {

      const response = await fetch("http://localhost:8080/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          email: email,
          department: department,
          password: password,
          role: "EMPLOYEE"
        }),
      });

      if (response.ok) {

        toast({
          title: "Account Created!",
          description: "You can now login.",
        });

        navigate("/login");

      } else {

        toast({
          title: "Signup Failed",
          description: "Email may already exist.",
          variant: "destructive",
        });

      }

    } catch (error) {

      toast({
        title: "Server Error",
        description: "Unable to connect to backend.",
        variant: "destructive",
      });

    }

    setLoading(false);

  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">

      <div className="w-full max-w-md animate-fade-in">

        <div className="text-center mb-8">

          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary mb-4">
            <Crown className="w-7 h-7 text-primary-foreground" />
          </div>

          <h1 className="text-2xl font-semibold text-foreground">
            Royal Points Hub
          </h1>

          <p className="text-muted-foreground mt-1 text-sm">
            Create your account
          </p>

        </div>

        <Card className="card-shadow-md border-border">

          <CardHeader className="pb-4">
            <h2 className="text-lg font-semibold text-foreground text-center">
              Sign Up
            </h2>
          </CardHeader>

          <CardContent>

            <form onSubmit={handleSignup} className="space-y-4">

              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="Enter your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your mail id"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>

                <Select value={department} onValueChange={setDepartment}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>

                  <SelectContent>
                    {DEPARTMENTS.map((d) => (
                      <SelectItem key={d} value={d}>
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>

                </Select>

              </div>

              <div className="space-y-2">

                <Label htmlFor="password">Password</Label>

                <div className="relative">

                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>

                </div>

              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Creating account..." : "Sign Up"}
              </Button>

            </form>

            <p className="text-center text-sm text-muted-foreground mt-4">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:underline font-medium">
                Sign In
              </Link>
            </p>

          </CardContent>

        </Card>

      </div>

    </div>
  );

};

export default SignupPage;