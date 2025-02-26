import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { login, signup } from "@/services/authService";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Clock11 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import GoogleLogin from "@/components/GoogleLogin";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useUser } from "@/contexts/UserContext";

const loginSchema = z.object({
  identifier: z.string().min(1, "Username or email is required"),
  password: z.string().min(1, "Password is required"),
});

const signupSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(20, "Username must be at most 20 characters")
      .regex(
        /^[a-zA-Z0-9_-]+$/,
        "Username can only contain letters, numbers, underscores, and hyphens"
      ),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type LoginFormData = z.infer<typeof loginSchema>;
type SignupFormData = z.infer<typeof signupSchema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { updateUser } = useUser();

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const signupForm = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleLoginSubmit = async (data: LoginFormData) => {
    setIsLoading(true);

    try {
      const response = await login(data);
      if (response.success) {
        toast({
          title: "Success",
          description: "Signed in successfully",
        });
        localStorage.setItem("token", response.token);
        updateUser({
          name: response.user.name,
          email: response.user.email,
          avatar: response.user.avatar,
        });
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

  const handleSignupSubmit = async (data: SignupFormData) => {
    setIsLoading(true);

    try {
      const response = await signup(data);
      if (response.success) {
        toast({
          title: "Success",
          description: "Account created successfully",
        });
        localStorage.setItem("token", response.token);
        updateUser({
          name: response.user.name,
          email: response.user.email,
          avatar: response.user.avatar,
        });
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
                <form
                  className={cn("space-y-8")}
                  onSubmit={loginForm.handleSubmit(handleLoginSubmit)}
                >
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
                        {...loginForm.register("identifier")}
                        className={cn("h-10", {
                          "border-red-500":
                            loginForm.formState.errors.identifier,
                        })}
                      />
                      {loginForm.formState.errors.identifier && (
                        <p className="text-sm text-red-500">
                          {loginForm.formState.errors.identifier.message}
                        </p>
                      )}
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
                        {...loginForm.register("password")}
                        className={cn("h-10", {
                          "border-red-500": loginForm.formState.errors.password,
                        })}
                      />
                      {loginForm.formState.errors.password && (
                        <p className="text-sm text-red-500">
                          {loginForm.formState.errors.password.message}
                        </p>
                      )}
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
                <form
                  className={cn("space-y-8")}
                  onSubmit={signupForm.handleSubmit(handleSignupSubmit)}
                >
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
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium">
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        {...signupForm.register("email")}
                        className={cn("h-10", {
                          "border-red-500": signupForm.formState.errors.email,
                        })}
                      />
                      {signupForm.formState.errors.email && (
                        <p className="text-sm text-red-500">
                          {signupForm.formState.errors.email.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="username" className="text-sm font-medium">
                        Username
                      </Label>
                      <Input
                        id="username"
                        type="text"
                        placeholder="Choose a username"
                        {...signupForm.register("username")}
                        className={cn("h-10", {
                          "border-red-500":
                            signupForm.formState.errors.username,
                        })}
                      />
                      {signupForm.formState.errors.username && (
                        <p className="text-sm text-red-500">
                          {signupForm.formState.errors.username.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-sm font-medium">
                        Password
                      </Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Create a password"
                        {...signupForm.register("password")}
                        className={cn("h-10", {
                          "border-red-500":
                            signupForm.formState.errors.password,
                        })}
                      />
                      {signupForm.formState.errors.password && (
                        <p className="text-sm text-red-500">
                          {signupForm.formState.errors.password.message}
                        </p>
                      )}
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
                        {...signupForm.register("confirmPassword")}
                        className={cn("h-10", {
                          "border-red-500":
                            signupForm.formState.errors.confirmPassword,
                        })}
                      />
                      {signupForm.formState.errors.confirmPassword && (
                        <p className="text-sm text-red-500">
                          {signupForm.formState.errors.confirmPassword.message}
                        </p>
                      )}
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
