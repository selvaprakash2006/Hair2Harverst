import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Scissors } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { LocationPicker } from "../components/LocationPicker";
import { apiFetch } from "../api"; // ✅ added

export const Register = () => {
  const [formData, setFormData] = useState({
    phone: "",
    password: "",
    role: "salon",
    name: "",
    shop_name: "",
    location: "",
    contact: "",
  });

  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await apiFetch("/api/auth/register", { // ✅ changed
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
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
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-xl bg-white rounded-3xl shadow-xl border border-zinc-100 p-8 space-y-8"
      >
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-display font-bold text-zinc-900">Create Account</h2>
          <p className="text-zinc-500">Join the sustainable hair recycling network</p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-zinc-700">Account Type</label>
            <div className="flex items-center justify-center gap-2 p-4 rounded-xl border-2 border-emerald-600 bg-emerald-50 text-emerald-700">
              <Scissors size={20} />
              <span className="font-medium">Salon Owner</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700">Owner Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700">Shop Name</label>
            <input
              type="text"
              required
              value={formData.shop_name}
              onChange={(e) => setFormData({ ...formData, shop_name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700">Phone Number</label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700">Alternate Contact</label>
            <input
              type="tel"
              value={formData.contact}
              onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-zinc-700">Shop Location</label>
            <LocationPicker
              value={formData.location}
              onChange={(val) => setFormData({ ...formData, location: val })}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-zinc-700">Password</label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          <button
            type="submit"
            className="md:col-span-2 w-full bg-emerald-600 text-white py-4 rounded-xl font-medium hover:bg-emerald-700 transition-all"
          >
            Create Account
          </button>
        </form>

        <p className="text-center text-sm text-zinc-500">
          Already have an account?{" "}
          <Link to="/login" className="text-emerald-600 hover:underline">
            Sign in here
          </Link>
        </p>
      </motion.div>
    </div>
  );
};