import React, { useState, useEffect } from "react";
import { Package, Clock, Calendar, Truck, Shield, Leaf, Scissors, MapPin, Check, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { StatusBadge } from "../components/StatusBadge";
import { useAuth } from "../context/AuthContext";
import { cn } from "../lib/utils";
import { LocationPicker } from "../components/LocationPicker";
import { apiFetch } from "../api"; // ✅ added

export const SalonDashboard = () => {
  const { user } = useAuth();
  const [pickups, setPickups] = useState([]);
  const [quantity, setQuantity] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [isEditingLocation, setIsEditingLocation] = useState(false);
  const [newLocation, setNewLocation] = useState(user?.location || "");
  const [updateMsg, setUpdateMsg] = useState("");

  const headers = {
    Authorization: `Bearer ${localStorage.getItem("token")}`
  };

  // ✅ FIXED
  const fetchPickups = async () => {
    const res = await apiFetch("/api/salon/my-pickups", { headers });
    const data = await res.json();
    setPickups(data);
    setLoading(false);
  };

  useEffect(() => { 
    fetchPickups(); 
    if (user?.location) setNewLocation(user.location);
  }, [user]);

  // ✅ FIXED
  const handleUpdateLocation = async () => {
    setUpdateMsg("");
    try {
      const res = await apiFetch("/api/salon/update-location", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...headers
        },
        body: JSON.stringify({ location: newLocation }),
      });

      if (res.ok) {
        setUpdateMsg("Location updated!");
        setIsEditingLocation(false);
      } else {
        const data = await res.json();
        throw new Error(data.error);
      }

    } catch (err) {
      setUpdateMsg("Error: " + err.message);
    }
  };

  // ✅ FIXED
  const handleRequest = async (e) => {
    e.preventDefault();

    const res = await apiFetch("/api/salon/pickup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...headers
      },
      body: JSON.stringify({
        quantity: parseFloat(quantity),
        pickupDate
      }),
    });

    if (res.ok) {
      setQuantity("");
      setPickupDate("");
      fetchPickups();
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-8">
      <h1 className="text-3xl font-bold">Salon Dashboard Ready ✅</h1>
    </div>
  );
};