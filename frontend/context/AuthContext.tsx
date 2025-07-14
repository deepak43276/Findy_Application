import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  email: string;
  roles: string[];
  // Add more user fields as needed
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (jwt: string) => void;
  logout: () => void;
  isAdmin: boolean;
  isUser: boolean;
  // Add more role helpers as needed
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function parseUserFromJWT(token: string): User | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    const decoded: any = JSON.parse(jsonPayload);
    return {
      email: decoded.email || decoded.sub,
      roles: decoded.roles || [decoded.role] || [],
    };
  } catch (err) {
    return null;
  }
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // On mount, check localStorage for token
    const storedToken = localStorage.getItem("findy_jwt");
    if (storedToken) {
      setToken(storedToken);
      const parsedUser = parseUserFromJWT(storedToken);
      setUser(parsedUser);
    }
  }, []);

  const login = (jwt: string) => {
    setToken(jwt);
    localStorage.setItem("findy_jwt", jwt);
    const parsedUser = parseUserFromJWT(jwt);
    setUser(parsedUser);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("findy_jwt");
  };

  const isAdmin = !!user?.roles?.includes("ROLE_ADMIN");
  const isUser = !!user?.roles?.includes("ROLE_USER");

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAdmin, isUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}; 