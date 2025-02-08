"use client";
import { useState } from "react";
import { supabase } from "@lib/supabase";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const router = useRouter();

  // Sign in with email & password
  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) console.error("Login error:", error.message);
    else router.push("/fyp"); // Redirect after login
  };

  // Sign up with email & password
  const handleSignUp = async () => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) console.error("Signup error:", error.message);
    else alert("Check your email for a confirmation link!");
  };

  // Sign in with Google
  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `http://localhost:3000/fyp`,
      },
    });
    if (error) console.error("Google login error:", error.message);
  };

  return (
    <div>
      <h2>Login</h2>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Enter your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Sign In</button>
      <button onClick={handleSignUp}>Sign Up</button>
      <hr />
      <button onClick={handleGoogleLogin}>Sign In with Google</button>
    </div>
  );
}
