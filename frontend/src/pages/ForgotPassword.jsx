import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Phone, ArrowLeft } from "lucide-react";
import { apiFetch } from "../api"; // ✅ added

export const ForgotPassword = () => {
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [resetToken, setResetToken] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const res = await apiFetch("/api/auth/forgot-password", {  // ✅ changed
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setMessage("If an account exists with this phone number, you will find the reset token below.");

      if (data.resetToken) {
        setResetToken(data.resetToken);
      }
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
        <div className="space-y-2">
          <Link to="/login" className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-emerald-600 transition-colors">
            <ArrowLeft size={16} /> Back to Login
          </Link>
          <h2 className="text-3xl font-display font-bold text-zinc-900">Reset Password</h2>
          <p className="text-zinc-500">Enter your phone number to receive a password reset token</p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl">
            {error}
          </div>
        )}

        {message && (
          <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm rounded-xl space-y-4">
            <p>{message}</p>
            {resetToken && (
              <div className="p-3 bg-white rounded-lg border border-emerald-200">
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1">
                  Demo Reset Token:
                </p>
                <code className="text-xs break-all text-emerald-600 font-mono">{resetToken}</code>
                <div className="mt-3">
                  <Link 
                    to={`/reset-password?token=${resetToken}`}
                    className="text-xs font-bold text-emerald-600 hover:underline"
                  >
                    Click here to reset now →
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}

        {!message && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                  placeholder="e.g. 9876543210"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-emerald-600 text-white py-3 rounded-xl font-medium hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"
            >
              Get Reset Token
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
};