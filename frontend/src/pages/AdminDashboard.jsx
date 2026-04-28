import { apiFetch } from "../api";
import React, { useState, useEffect } from "react";
import { Layout, Truck, User, Scissors, Leaf, MapPin, Calendar, Clock, Shield } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../lib/utils";
import { StatusBadge } from "../components/StatusBadge";

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [available, setAvailable] = useState([]);
  const [myCollections, setMyCollections] = useState([]);
  const [assignmentRequests, setAssignmentRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("stats");
  const [staffData, setStaffData] = useState({ phone: "", password: "", role: "labour", name: "", contact: "" });
  const [staffMsg, setStaffMsg] = useState("");
  const [assigningTo, setAssigningTo] = useState(null);

  const headers = {
    Authorization: `Bearer ${localStorage.getItem("token")}`
  };

  const fetchData = async () => {
    try {
      const [resStats, resUsers, resAvail, resMine, resReqs] = await Promise.all([
        apiFetch("/api/admin/stats", { headers }),
        apiFetch("/api/admin/users", { headers }),
        apiFetch("/api/admin/available-pickups", { headers }),
        apiFetch("/api/admin/my-collections", { headers }),
        apiFetch("/api/admin/assignment-requests", { headers }),
      ]);

      setStats(await resStats.json());
      setUsers(await resUsers.json());
      setAvailable(await resAvail.json());
      setMyCollections(await resMine.json());
      setAssignmentRequests(await resReqs.json());
    } catch (err) {
      console.error("Failed to fetch admin data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleCreateStaff = async (e) => {
    e.preventDefault();
    setStaffMsg("");

    try {
      const res = await apiFetch("/api/admin/create-staff", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...headers
        },
        body: JSON.stringify(staffData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setStaffMsg("Staff created successfully!");
      setStaffData({ phone: "", password: "", role: "labour", name: "", contact: "" });
      fetchData();
    } catch (err) {
      setStaffMsg("Error: " + err.message);
    }
  };

  const handleAccept = async (id) => {
    const res = await apiFetch(`/api/admin/accept-pickup/${id}`, {
      method: "POST",
      headers
    });
    if (res.ok) fetchData();
  };

  const handleComplete = async (id) => {
    const res = await apiFetch(`/api/admin/complete-pickup/${id}`, {
      method: "POST",
      headers
    });
    if (res.ok) fetchData();
  };

  const handleApproveAssignment = async (requestId) => {
    const res = await apiFetch(`/api/admin/approve-assignment/${requestId}`, {
      method: "POST",
      headers
    });
    if (res.ok) fetchData();
  };

  const handleDirectAssign = async (pickupId, labourId) => {
    const res = await apiFetch("/api/admin/assign-staff", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...headers
      },
      body: JSON.stringify({ pickupId, labourId }),
    });

    if (res.ok) {
      setAssigningTo(null);
      fetchData();
    }
  };

  if (loading) return <div className="p-12 text-center">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto p-8">
      <h1 className="text-3xl font-bold">Admin Dashboard Ready ✅</h1>
    </div>
  );
};