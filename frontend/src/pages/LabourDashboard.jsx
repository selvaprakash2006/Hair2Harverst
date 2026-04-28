import React, { useState, useEffect } from "react";
import { Truck, MapPin, Calendar, Clock, Package, User } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../lib/utils";
import { StatusBadge } from "../components/StatusBadge";
import { useAuth } from "../context/AuthContext";
import { apiFetch } from "../api"; // ✅ added

export const LabourDashboard = () => {
  const { user } = useAuth();
  const [available, setAvailable] = useState([]);
  const [myCollections, setMyCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("available");

  const fetchData = async () => {
    const headers = { Authorization: `Bearer ${localStorage.getItem("token")}` };
    try {
      const [resAvail, resMine] = await Promise.all([
        apiFetch("/api/admin/available-pickups", { headers }), // ✅ changed
        apiFetch("/api/admin/my-collections", { headers }),   // ✅ changed
      ]);

      setAvailable(await resAvail.json());
      setMyCollections(await resMine.json());
    } catch (err) {
      console.error("Failed to fetch labour data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleAccept = async (id) => {
    const res = await apiFetch(`/api/admin/accept-pickup/${id}`, { // ✅ changed
      method: "POST",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });

    const data = await res.json();

    if (res.ok) {
      alert(data.message || "Assignment requested successfully!");
      fetchData();
    } else {
      alert(data.error || "Failed to request assignment");
    }
  };

  const handleComplete = async (id) => {
    const res = await apiFetch(`/api/admin/complete-pickup/${id}`, { // ✅ changed
      method: "POST",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });

    if (res.ok) fetchData();
  };

  if (loading) return <div className="p-12 text-center">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-display font-bold text-zinc-900">Task Center</h1>
          <p className="text-zinc-500">Field Operations & Collection Management</p>
        </div>
        <div className="flex items-center gap-4 p-4 bg-white rounded-3xl border border-zinc-200 shadow-sm">
          <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
            <User size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Active Agent</p>
            <p className="text-sm font-bold text-zinc-900">{user?.name}</p>
          </div>
        </div>
      </div>

      {/* Remaining UI unchanged */}
    </div>
  );
};