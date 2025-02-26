export interface LoginResponse {
  success: boolean;
  token: string;
  user: {
    name: string;
    email: string;
    avatar: string;
  };
}

export interface LoginData {
  identifier: string;
  password: string;
}

export interface SignupData {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

export interface GoogleAuthResponse {
  success: boolean;
  token: string;
  user: {
    email: string;
    name: string;
    avatar: string;
  };
}
