"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { DEFAULT_USER_ID, DEMO_USERS } from "@/lib/demo-users";

const UserContext = createContext<{ userId: string; setUserId: (id: string) => void } | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [userId, setUserIdState] = useState(DEFAULT_USER_ID);
  useEffect(() => {
    const stored = localStorage.getItem("ajaia-demo-user");
    // Synchronize the browser-only demo identity after hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (stored && DEMO_USERS.some((user) => user.id === stored)) setUserIdState(stored);
  }, []);
  const setUserId = (id: string) => {
    localStorage.setItem("ajaia-demo-user", id);
    setUserIdState(id);
  };
  return <UserContext.Provider value={{ userId, setUserId }}>{children}</UserContext.Provider>;
}

export function useDemoUser() {
  const value = useContext(UserContext);
  if (!value) throw new Error("UserProvider is required.");
  return value;
}
