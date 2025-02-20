import { supabase } from "@lib/supabase";

// Exchange auth code for session
export const exchangeCodeForSession = async (code: string) => {
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  return error;
};

// Get the current authenticated user
export const getCurrentUser = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
};

// Sign in with email & password
export const signInWithEmail = async (email: string, password: string) => {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  return error;
};

// Sign up with email & password
export const signUpWithEmail = async (email: string, password: string) => {
  const { error } = await supabase.auth.signUp({ email, password });
  return error;
};

// Sign in with Google
export const signInWithGoogle = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/fyp`, // Redirect after login
    },
  });
  return error;
};

// Logout user
export const logout = async () => {
  await supabase.auth.signOut();
};
