import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  isGuest: boolean;
  userName: string | null;
  login: (email: string, password: string, name?: string) => boolean;
  logout: () => void;
  loginAsGuest: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is already logged in
    const loggedIn = localStorage.getItem("medicoLoggedIn");
    if (loggedIn === "true" || loggedIn === "guest") {
      setIsAuthenticated(true);
      setIsGuest(loggedIn === "guest");
      
      if (loggedIn === "true") {
        const userStr = localStorage.getItem("medicoUser");
        if (userStr) {
          const user = JSON.parse(userStr);
          setUserName(user.name || user.email);
        }
      }
    }
  }, []);

  const login = (email: string, password: string, name?: string) => {
    if (name) {
      // Signup
      const user = { email, password, name };
      localStorage.setItem("medicoUser", JSON.stringify(user));
      localStorage.setItem("medicoLoggedIn", "true");
      setIsAuthenticated(true);
      setUserName(name);
      return true;
    } else {
      // Login
      const storedUser = localStorage.getItem("medicoUser");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        if (user.email === email && user.password === password) {
          localStorage.setItem("medicoLoggedIn", "true");
          setIsAuthenticated(true);
          setUserName(user.name || user.email);
          return true;
        }
      }
      return false;
    }
  };

  const loginAsGuest = () => {
    localStorage.setItem("medicoLoggedIn", "guest");
    setIsAuthenticated(true);
    setIsGuest(true);
    setUserName("Guest User");
  };

  const logout = () => {
    localStorage.removeItem("medicoLoggedIn");
    setIsAuthenticated(false);
    setIsGuest(false);
    setUserName(null);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, isGuest, userName, login, logout, loginAsGuest }}
    >
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
