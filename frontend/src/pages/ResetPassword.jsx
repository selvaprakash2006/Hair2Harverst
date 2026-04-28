import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "motion/react";
import { Lock, ShieldCheck } from "lucide-react";
import { apiFetch } from "../api"; // ✅ added

export const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const token = searchParams.get("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const res = await apiFetch("/api/auth/reset-password", { // ✅ changed
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resetToken: token, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      setSuccess(true);
      setTimeout(() => navigate("/login"), 3000);

    } catch (err) {
      setError(err.message);
    }
  };

  if (!token) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <p className="text-red-600 font-medium">Invalid or missing reset token.</p>
          <button 
            onClick={() => navigate("/login")} 
            className="text-emerald-600 hover:underline"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-zinc-100 p-8 space-y-8"
      >
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-display font-bold text-zinc-900">New Password</h2>
          <p className="text-zinc-500">Create a secure password for your account</p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl">
            {error}
          </div>
        )}

        {success ? (
          <div className="text-center space-y-6 py-8">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <ShieldCheck size={40} />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-zinc-900">Password Reset!</h3>
              <p className="text-zinc-500">
                Your password has been updated successfully. Redirecting to login...
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700">New Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                  placeholder="••••••••"
                />
              </div>
              <p className="text-[10px] text-zinc-400 px-1">
                Min 8 chars, uppercase, lowercase, number & symbol
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-600 text-white py-3 rounded-xl font-medium hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"
            >
              Update Password
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
};