import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Crown, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const LoginPage = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {

    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {

      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      if (response.ok) {

        const backendUser = await response.json();

        const user = {
          ...backendUser,
          role: backendUser.role.toLowerCase()
        };

        login(user);

        localStorage.setItem("user", JSON.stringify(user));

        toast({
          title: "Welcome back!",
          description: "Login successful.",
        });

        // ROLE BASED REDIRECT
        // if (user.role === "ADMIN") {
        //   navigate("/admin-dashboard");
        // } else {
        //   navigate("/employee-dashboard");
        // }

      } else {

        toast({
          title: "Login Failed",
          description: "Invalid email or password.",
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
            Employee Points Management
          </p>

        </div>

        <Card className="card-shadow-md border-border">

          <CardHeader className="pb-4">
            <h2 className="text-lg font-semibold text-foreground text-center">
              Sign In
            </h2>
          </CardHeader>

          <CardContent>

            <form onSubmit={handleLogin} className="space-y-4">

              <div className="space-y-2">

                <Label htmlFor="email">Email</Label>

                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

              </div>

              <div className="space-y-2">

                <Label htmlFor="password">Password</Label>

                <div className="relative">

                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
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
                {loading ? "Signing in..." : "Sign In"}
              </Button>

            </form>

            <p className="text-center text-sm text-muted-foreground mt-4">

              Don't have an account?{" "}

              <Link
                to="/signup"
                className="text-primary hover:underline font-medium"
              >
                Sign Up
              </Link>

            </p>

          </CardContent>

        </Card>

      </div>

    </div>
  );

};

export default LoginPage;