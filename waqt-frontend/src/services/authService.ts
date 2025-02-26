import {
  LoginData,
  LoginResponse,
  SignupData,
  GoogleAuthResponse,
} from "@/types/auth";
import { post } from "./httpHelper";

export function login(data: LoginData): Promise<LoginResponse> {
  console.log("login", data);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        token: "1234567890",
        user: {
          name: "John Doe",
          email: data.identifier,
          avatar:
            "https://api.dicebear.com/7.x/avataaars/svg?seed=" +
            data.identifier,
        },
      });
    }, 1000);
  });
  // return post<LoginResponse>("/login", data);
}

export function signup(data: SignupData): Promise<LoginResponse> {
  return post<LoginResponse>("/signup", data);
}

export function googleAuth(accessToken: string): Promise<GoogleAuthResponse> {
  return post<GoogleAuthResponse>("/auth/google", {
    access_token: accessToken,
  });
}

export function isAuthenticated() {
  const token = localStorage.getItem("token");
  return !!token;
}

export function logout() {
  localStorage.removeItem("token");
}

export function getToken() {
  return localStorage.getItem("token");
}
