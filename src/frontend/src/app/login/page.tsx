import React from "react";

const LoginPage: React.FC = () => (
  <div className="flex items-center justify-center min-h-screen bg-base-200">
    <div className="card w-96 p-4 bg-base-100 shadow-xl">
      <h2 className="text-xl font-bold text-center">Login</h2>
      <form className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="input input-bordered w-full"
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="input input-bordered w-full"
          required
        />
        <button type="submit" className="btn btn-primary w-full">
          Login
        </button>
      </form>
      <p className="text-center mt-4">
        Dont have an account?{" "}
        <a href="/register" className="link link-primary">
          Register
        </a>
      </p>
    </div>
  </div>
);

export default LoginPage;
