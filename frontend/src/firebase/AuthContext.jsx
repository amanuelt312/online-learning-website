import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "./firebase";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setIsAuthenticated(!!user);
    });

    return () => unsubscribe();
  }, []);

  const value = {
    user,
    signIn: async (email, password) => {
      await signInWithEmailAndPassword(auth, email, password);
    },
    signOut: async () => {
      await signOut(auth);
      clearUserIdLocalStorage();
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export const getUserIdFromLocalStorage = () => {
  return localStorage.getItem("userUid");
};

export const getUserRoleFromLocalStorage = () => {
  return localStorage.getItem("userRole");
};
export const setUserIdLocalStorage = (userId) => {
  localStorage.setItem("userUid", userId);
  console.log("userId saved:");
};
export const setUserRoleLocalStorage = (userRole) => {
  localStorage.setItem("userRole", userRole);
  console.log("userRole saved:");
};

export const clearUserIdLocalStorage = () => {
  localStorage.removeItem("userUid");
  localStorage.removeItem("userRole");

  console.log("userId and role removed from localStorage");
};
