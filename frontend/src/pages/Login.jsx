import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { useAuth } from "../context/AuthContext";
import { apiFetch } from "../api"; // ✅ added

export const Login = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await apiFetch("/api/auth/login", { // ✅ changed
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      login(data.token, data.user);
      navigate(`/${data.user.role}-dashboard`);

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-zinc-100 p-8 space-y-8"
      >
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-display font-bold text-zinc-900">Welcome Back</h2>
          <p className="text-zinc-500">Sign in to manage your Hair2Harvest account</p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700">Phone Number</label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
              placeholder="e.g. 9876543210"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-zinc-700">Password</label>
              <Link to="/forgot-password" className="text-xs text-emerald-600 hover:underline">
                Forgot Password?
              </Link>
            </div>

            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-600 text-white py-3 rounded-xl font-medium hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"
          >
            Sign In
          </button>
        </form>

        <p className="text-center text-sm text-zinc-500">
          Don't have an account?{" "}
          <Link to="/register" className="text-emerald-600 font-medium hover:underline">
            Register here
          </Link>
        </p>
      </motion.div>
    </div>
  );
};