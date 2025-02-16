"use client";
import { useState } from "react";
import { supabase } from "@lib/supabase";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Sign in with email & password
  const handleLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) alert(error.message);
    else router.push("/home");
    setLoading(false);
  };

  // Sign up with email & password
  const handleSignUp = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) alert(error.message);
    else alert("Check your email for a confirmation link!");
    setLoading(false);
  };

  // Sign in with Google
  const handleGoogleLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `http://localhost:3000/home` },
    });
    if (error) alert(error.message);
    setLoading(false);
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
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>

        <button
          onClick={handleSignUp}
          className="w-1/2 bg-transparent border border-white text-white py-1.5 rounded-lg hover:bg-white hover:text-black transition block mx-auto shadow-md font-bold"
          disabled={loading}
        >
          {loading ? "Signing up..." : "Sign Up"}
        </button>

        <p
          onClick={handleGoogleLogin}
          className="text-gray-300 text-sm text-center mt-3 cursor-pointer hover:text-white transition font-bold"
        >
          Sign In With Google
        </p>
      </div>
    </div>
  );
}
