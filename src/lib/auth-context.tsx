import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";

interface User {
  username: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, pass: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("secureai_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoaded(true);
  }, []);

  const login = async (username: string, pass: string) => {
    if (username === "Anjum" && pass === "shariff") {
      const newUser = { username };
      setUser(newUser);
      localStorage.setItem("secureai_user", JSON.stringify(newUser));
      toast.success(`Welcome back, ${username}!`);
      return true;
    } else {
      toast.error("Invalid credentials. Access denied.");
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("secureai_user");
    toast.info("Logged out successfully.");
    navigate({ to: "/login" });
  };

  if (!isLoaded) return null;

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
