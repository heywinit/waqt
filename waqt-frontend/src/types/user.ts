export interface User {
  id?: string;
  name: string;
  email: string;
  avatar: string;
}

export type UserContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
};
