import { createContext } from "react";
import type { User } from "../api/types";

export type UserContextType = {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (u: User | null) => void;
  logout: () => void;
};

export const UserContext = createContext<UserContextType | undefined>(
  undefined,
);
