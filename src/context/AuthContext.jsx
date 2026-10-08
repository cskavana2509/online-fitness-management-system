import {
  createContext,
  useEffect,
  useState,
} from "react";

import { supabase } from "../supabase";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCurrentUser();

    const {
      data: authListener,
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
        setLoading(false);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const getCurrentUser = async () => {
    try {
      const {
        data,
        error,
      } = await supabase.auth.getSession();

      if (error) {
        console.error(
          "Session error:",
          error
        );
      }

      setUser(data?.session?.user || null);
    } catch (error) {
      console.error(
        "Authentication error:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  const login = async (
    email,
    password
  ) => {
    return await supabase.auth.signInWithPassword({
      email,
      password,
    });
  };

  const signup = async (
    email,
    password
  ) => {
    return await supabase.auth.signUp({
      email,
      password,
    });
  };

  const logout = async () => {
    return await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}