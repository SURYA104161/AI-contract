import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabase/supabaseClient";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const saveUserProfile = async (user) => {
    if (!user) return;

    const fullName =
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      "";

    const names = fullName.split(" ");

    const firstName = names[0] || "";

    const lastName = names.slice(1).join(" ") || "";

    // Check whether the profile already exists
    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", user.id)
      .maybeSingle();

    if (existingProfile) {
      return;
    }

    // Only create a profile for NEW users
    const { error } = await supabase
      .from("profiles")
      .upsert(
        {
          id: user.id,
          email: user.email,
          first_name: firstName,
          last_name: lastName,
          avatar_url:
            user.user_metadata?.avatar_url ||
            user.user_metadata?.picture ||
            "",
          provider: user.app_metadata?.provider || "email",
        },
        {
          onConflict: "id",
          ignoreDuplicates: false,
        }
      );

    if (error) {
      console.error("Profile Save Error:", error);
    } else {
      console.log("✅ Profile saved successfully");
    }
  };

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      console.log("SESSION:", session);

      setUser(session?.user ?? null);

      if (session?.user) {
        await saveUserProfile(session.user);
      }

      setLoading(false);
    };

    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("EVENT:", event);
      console.log("SESSION:", session);

      setUser(session?.user ?? null);

      if (session?.user) {
        await saveUserProfile(session.user);
      }

      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async ({ email, password }) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    setUser(data?.user ?? null);
    return data;
  };

  const signUp = async ({ email, password }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: "http://localhost:3000/auth/callback",
      },
    });

    if (error) throw error;

    return data;
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      },
    });

    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, signInWithGoogle }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
