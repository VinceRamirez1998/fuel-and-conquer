import { createContext, useContext, useEffect, useState } from "react";
import { getUserByEmail, logout } from "../api/v1/v1";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/config/firebase";

export const AuthContext = createContext({
  user: null as any,
  loginUser: async (_data?: any) => {},
  logoutUser: async () => {},
  loading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser?.email) {
          const userData = await getUserByEmail(firebaseUser.email);
          setUser(userData ?? null);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Auth bootstrap failed:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const loginUser = async (data: any) => {
    try {
      const userData = await getUserByEmail(data.email);
      if (userData) {
        setUser(userData);
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const logoutUser = async () => {
    setUser(null);
    await logout();
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
