import React, { useState } from "react";
import { apiFetch } from "../api";
import { MapPin, Navigation } from "lucide-react";

export const LocationPicker = ({ value, onChange }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleGetCurrentLocation = () => {
    setIsLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          // Reverse geocode to get a readable address
          try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
            const data = await response.json();
            if (data.display_name) {
              onChange(data.display_name);
            } else {
              onChange(`${latitude}, ${longitude}`);
            }
          } catch (error) {
            console.error("Reverse geocoding error:", error);
            onChange(`${latitude}, ${longitude}`);
          }
          setIsLoading(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          let errorMsg = "Could not detect location.";
          if (error.code === error.PERMISSION_DENIED) {
            errorMsg = "Location permission denied. Please enable it in your browser.";
          }
          alert(errorMsg);
          setIsLoading(false);
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
        <input
          type="text"
          required
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
          placeholder="Enter address manually"
        />
      </div>
      
      <button
        type="button"
        onClick={handleGetCurrentLocation}
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-zinc-100 text-zinc-700 rounded-xl text-sm font-medium hover:bg-zinc-200 transition-all disabled:opacity-50 border border-transparent active:scale-[0.98]"
      >
        <Navigation size={16} className={isLoading ? "animate-pulse" : ""} />
        {isLoading ? "Detecting Location..." : "Use Current Location"}
      </button>
    </div>
  );
};
