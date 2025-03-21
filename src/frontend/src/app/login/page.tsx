"use client";
import { useState } from "react";
import { supabase } from "@lib/supabase";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const router = useRouter();
  const [signupLoading, setSignupLoading] = useState<boolean>(false);
  const [loginLoading, setLoginLoading] = useState<boolean>(false);

  // Sign in with email & password
  const handleLogin = async () => {
    setLoginLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) console.error("Login error:", error.message);
    else {
      router.push("/fyp"); // Redirect after login
      setLoginLoading(false);
    }
  };

  // Sign up with email & password
  const handleSignUp = async () => {
    setSignupLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) console.error("Signup error:", error.message);
    else alert("Check your email for a confirmation link!");
    setSignupLoading(false);
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
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center font-['Poppins']"
      style={{ backgroundImage: "url('/assets/AdobeStock_339164168.jpeg')" }}
    >
      <div className="bg-white bg-opacity-10 backdrop-blur-md p-6 rounded-lg shadow-lg w-80 border border-white border-opacity-20">
        <h2 className="text-2xl font-bold text-white text-center mb-2">
          Welcome Back!
        </h2>
        <p className="text-gray-300 text-center font-bold mb-4">
          Sign in to continue
        </p>

        <div className="mb-3">
          <input
            type="email"
            placeholder="Email"
            className="w-11/12 p-2 bg-transparent border border-white text-white rounded-lg placeholder-gray-300 font-bold focus:outline-none focus:ring-2 focus:ring-white block mx-auto"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <input
            type="password"
            placeholder="Password"
            className="w-11/12 p-2 bg-transparent border border-white text-white rounded-lg placeholder-gray-300 font-bold focus:outline-none focus:ring-2 focus:ring-white block mx-auto"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          onClick={handleLogin}
          className="w-1/2 bg-white text-black py-1.5 rounded-lg hover:bg-gray-300 mb-2 transition block mx-auto shadow-md font-bold"
          disabled={loginLoading}
        >
          {loginLoading ? "Signing in..." : "Sign In"}
        </button>

        <button
          onClick={handleSignUp}
          className="w-1/2 bg-transparent border border-white text-white py-1.5 rounded-lg hover:bg-success hover:text-black transition block mx-auto shadow-md font-bold"
          disabled={signupLoading}
        >
          {signupLoading ? "Signing up..." : "Sign Up"}
        </button>

        <p
          onClick={handleGoogleLogin}
          className="text-gray-300 text-sm text-center mt-3 cursor-pointer hover:text-success transition font-bold"
        >
          Sign In With Google
        </p>
      </div>
    </div>
  );
}
