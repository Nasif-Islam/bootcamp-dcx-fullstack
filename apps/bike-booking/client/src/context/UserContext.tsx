import { useMemo, useState } from "react";
import type { User } from "../api/types";
import { UserContext } from "./UserContextDef";
import type { UserContextType } from "./UserContextDef";

const STORAGE_KEY = "bike-booking-user";

function getInitialUser(): User | null {
  const storedUser = localStorage.getItem(STORAGE_KEY);
  if (!storedUser) return null;

  try {
    return JSON.parse(storedUser) as User;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<User | null>(getInitialUser);

  function setUser(user: User | null) {
    setUserState(user);

    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  function logout() {
    setUser(null);
  }

  const value: UserContextType = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      setUser,
      logout,
    }),
    [user],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
