import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { login, signup, googleAuth } from "@/services/authService";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { LoginData, SignupData } from "@/types/auth";
import { Clock11 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useGoogleLogin } from "@react-oauth/google";

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

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const result = await googleAuth(tokenResponse.access_token);
        if (result.success) {
          localStorage.setItem("token", result.token);
          toast({
            title: "Success",
            description: "Signed in with Google successfully",
          });
          navigate("/");
        }
      } catch {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to sign in with Google",
        });
      }
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to sign in with Google",
      });
    },
  });

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a
            href="/"
            className="flex items-center gap-2 font-medium select-none"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Clock11 className="size-4" />
            </div>
            Waqt
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign up</TabsTrigger>
              </TabsList>
              <TabsContent value="login">
                <form
                  className={cn("flex flex-col gap-6")}
                  onSubmit={handleLoginSubmit}
                >
                  <div className="flex flex-col items-center gap-2 text-center select-none">
                    <h1 className="text-2xl font-bold">Welcome back</h1>
                    <p className="text-balance text-sm text-muted-foreground">
                      Sign in to access your Waqt dashboard
                    </p>
                  </div>
                  <div className="grid gap-4">
                    {error && (
                      <div className="text-sm text-red-500 text-center">
                        {error}
                      </div>
                    )}
                    <div className="grid gap-2">
                      <Label htmlFor="identifier">Username or Email</Label>
                      <Input
                        id="identifier"
                        type="text"
                        placeholder="Enter your username or email"
                        required
                        value={loginData.identifier}
                        onChange={handleLoginInputChange}
                      />
                    </div>
                    <div className="grid gap-2">
                      <div className="flex items-center">
                        <Label htmlFor="password">Password</Label>
                        <a
                          href="#"
                          className="ml-auto text-sm underline-offset-4 hover:underline"
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
                      />
                    </div>
                    <Button
                      type="submit"
                      className="mt-2 w-full"
                      disabled={isLoading}
                    >
                      {isLoading ? "Signing in..." : "Sign in to Dashboard"}
                    </Button>
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <Separator />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">
                          Or continue with
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-center">
                      <Button
                        type="button"
                        variant="default"
                        className="w-full flex gap-2 items-center justify-center"
                        onClick={() => handleGoogleLogin()}
                        disabled={isLoading}
                      >
                        <svg className="size-5" viewBox="0 0 24 24">
                          <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            fill="#4285F4"
                          />
                          <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                          />
                          <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            fill="#FBBC05"
                          />
                          <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#EA4335"
                          />
                        </svg>
                        Continue with Google
                      </Button>
                    </div>
                  </div>
                </form>
              </TabsContent>
              <TabsContent value="signup">
                <form
                  className={cn("flex flex-col gap-6")}
                  onSubmit={handleSignupSubmit}
                >
                  <div className="flex flex-col items-center gap-2 text-center select-none">
                    <h1 className="text-2xl font-bold">Create an account</h1>
                    <p className="text-balance text-sm text-muted-foreground">
                      Sign up to start managing your time effectively
                    </p>
                  </div>
                  <div className="grid gap-4">
                    {error && (
                      <div className="text-sm text-red-500 text-center">
                        {error}
                      </div>
                    )}
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        required
                        value={signupData.email}
                        onChange={handleSignupInputChange}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        type="text"
                        placeholder="Choose a username"
                        required
                        value={signupData.username}
                        onChange={handleSignupInputChange}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Create a password"
                        required
                        value={signupData.password}
                        onChange={handleSignupInputChange}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm your password"
                        required
                        value={signupData.confirmPassword}
                        onChange={handleSignupInputChange}
                      />
                    </div>
                    <Button
                      type="submit"
                      className="mt-2 w-full"
                      disabled={isLoading}
                    >
                      {isLoading ? "Creating account..." : "Create account"}
                    </Button>
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <Separator />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">
                          Or continue with
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-center">
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full flex gap-2 items-center justify-center"
                        onClick={() => handleGoogleLogin()}
                        disabled={isLoading}
                      >
                        <svg className="size-5" viewBox="0 0 24 24">
                          <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            fill="#4285F4"
                          />
                          <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                          />
                          <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            fill="#FBBC05"
                          />
                          <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#EA4335"
                          />
                        </svg>
                        Continue with Google
                      </Button>
                    </div>
                  </div>
                </form>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      <div className="relative hidden bg-primary lg:block">
        <div className="absolute inset-0 p-10">
          <div className="absolute bottom-10 max-w-md text-white select-none">
            <h2 className="mb-4 text-4xl font-bold text-black leading-tight">
              Maximize Your Time Management
            </h2>
            <p className="text-lg text-primary-foreground/80">
              Organize your tasks, set reminders, and track your productivity
              with our intuitive time management app.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
