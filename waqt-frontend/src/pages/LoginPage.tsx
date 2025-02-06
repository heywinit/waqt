import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { login, signup } from "@/services/authService";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { LoginData, SignupData } from "@/types/auth";
import { Clock11 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import GoogleLogin from "@/components/GoogleLogin";

export default function LoginPage() {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState<LoginData>({
    identifier: "",
    password: "",
  });
  const [signupData, setSignupData] = useState<SignupData>({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleLoginInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setLoginData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSignupInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setSignupData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await login(loginData);
      if (response.success) {
        toast({
          title: "Success",
          description: "Signed in successfully",
        });
        localStorage.setItem("token", response.token);
        navigate("/");
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Invalid credentials",
        });
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          err instanceof Error ? err.message : "An error occurred during login",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (signupData.password !== signupData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const response = await signup(signupData);
      if (response.success) {
        toast({
          title: "Success",
          description: "Account created successfully",
        });
        localStorage.setItem("token", response.token);
        navigate("/");
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          err instanceof Error
            ? err.message
            : "An error occurred during signup",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col p-6 md:p-8 lg:p-12">
        <div className="flex justify-center md:justify-start">
          <a
            href="/"
            className="flex items-center gap-2.5 text-lg font-medium select-none hover:opacity-90 transition-opacity"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-sm">
              <Clock11 className="size-4" />
            </div>
            Waqt
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center mt-8 md:mt-12">
          <div className="w-full max-w-sm space-y-6">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign up</TabsTrigger>
              </TabsList>
              <TabsContent value="login">
                <form className={cn("space-y-8")} onSubmit={handleLoginSubmit}>
                  <div className="flex flex-col items-center gap-2.5 text-center select-none">
                    <h1 className="text-2xl font-semibold tracking-tight">
                      Welcome back
                    </h1>
                    <p className="text-balance text-sm text-muted-foreground">
                      Sign in to access your Waqt dashboard
                    </p>
                  </div>
                  <div className="space-y-6">
                    <div className="flex justify-center">
                      <GoogleLogin
                        disabled={isLoading}
                        onSuccess={(token) => {
                          localStorage.setItem("token", token);
                          navigate("/");
                        }}
                      />
                    </div>
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <Separator />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">
                          Or continue with email
                        </span>
                      </div>
                    </div>
                    {error && (
                      <div className="text-sm text-red-500 text-center bg-red-50 py-2 px-3 rounded-md">
                        {error}
                      </div>
                    )}
                    <div className="space-y-2">
                      <Label
                        htmlFor="identifier"
                        className="text-sm font-medium"
                      >
                        Username or Email
                      </Label>
                      <Input
                        id="identifier"
                        type="text"
                        placeholder="Enter your username or email"
                        required
                        value={loginData.identifier}
                        onChange={handleLoginInputChange}
                        className="h-10"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label
                          htmlFor="password"
                          className="text-sm font-medium"
                        >
                          Password
                        </Label>
                        <a
                          href="#"
                          className="text-sm text-primary hover:underline underline-offset-4"
                        >
                          Forgot password?
                        </a>
                      </div>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        required
                        value={loginData.password}
                        onChange={handleLoginInputChange}
                        className="h-10"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full h-10"
                      disabled={isLoading}
                    >
                      {isLoading ? "Signing in..." : "Sign in to Dashboard"}
                    </Button>
                  </div>
                </form>
              </TabsContent>
              <TabsContent value="signup">
                <form className={cn("space-y-8")} onSubmit={handleSignupSubmit}>
                  <div className="flex flex-col items-center gap-2.5 text-center select-none">
                    <h1 className="text-2xl font-semibold tracking-tight">
                      Create an account
                    </h1>
                    <p className="text-balance text-sm text-muted-foreground">
                      Sign up to start managing your time effectively
                    </p>
                  </div>
                  <div className="space-y-6">
                    <div className="flex justify-center">
                      <GoogleLogin
                        disabled={isLoading}
                        onSuccess={(token) => {
                          localStorage.setItem("token", token);
                          navigate("/");
                        }}
                      />
                    </div>
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <Separator />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">
                          Or continue with email
                        </span>
                      </div>
                    </div>
                    {error && (
                      <div className="text-sm text-red-500 text-center bg-red-50 py-2 px-3 rounded-md">
                        {error}
                      </div>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium">
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        required
                        value={signupData.email}
                        onChange={handleSignupInputChange}
                        className="h-10"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="username" className="text-sm font-medium">
                        Username
                      </Label>
                      <Input
                        id="username"
                        type="text"
                        placeholder="Choose a username"
                        required
                        value={signupData.username}
                        onChange={handleSignupInputChange}
                        className="h-10"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-sm font-medium">
                        Password
                      </Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Create a password"
                        required
                        value={signupData.password}
                        onChange={handleSignupInputChange}
                        className="h-10"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="confirmPassword"
                        className="text-sm font-medium"
                      >
                        Confirm Password
                      </Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm your password"
                        required
                        value={signupData.confirmPassword}
                        onChange={handleSignupInputChange}
                        className="h-10"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full h-10"
                      disabled={isLoading}
                    >
                      {isLoading ? "Creating account..." : "Create account"}
                    </Button>
                  </div>
                </form>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      <div className="relative hidden bg-gradient-to-br from-primary to-primary/90 lg:block">
        <div className="absolute inset-0 p-12 flex items-end">
          <div className="max-w-md space-y-4">
            <h2 className="text-4xl font-bold text-primary-foreground leading-tight">
              Maximize Your Time Management
            </h2>
            <p className="text-lg text-primary-foreground/90">
              Organize your tasks, set reminders, and track your productivity
              with our intuitive time management app.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
