import {
  LoginData,
  LoginResponse,
  SignupData,
  GoogleAuthResponse,
} from "@/types/auth";
import { post } from "./httpHelper";

export function login(data: LoginData): Promise<LoginResponse> {
  return post<LoginResponse>("/login", data);
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
