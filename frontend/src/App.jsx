import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Recycle, Shield, Leaf } from "lucide-react";
import { AuthProvider } from "./context/AuthContext";
import { Navbar } from "./components/Navbar";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { ForgotPassword } from "./pages/ForgotPassword";
import { ResetPassword } from "./pages/ResetPassword";
import { SalonDashboard } from "./pages/SalonDashboard";
import { AdminDashboard } from "./pages/AdminDashboard";
import { LabourDashboard } from "./pages/LabourDashboard";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/salon-dashboard" element={<ProtectedRoute role="salon"><SalonDashboard /></ProtectedRoute>} />
              <Route path="/admin-dashboard" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
              <Route path="/labour-dashboard" element={<ProtectedRoute role="labour"><LabourDashboard /></ProtectedRoute>} />
            </Routes>
          </main>
          <footer className="bg-white border-t border-zinc-200 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white">
                  <Recycle size={18} />
                </div>
                <span className="text-lg font-bold tracking-tight text-zinc-900">Hair2Harvest</span>
              </div>
              <p className="text-sm text-zinc-500">© 2026 Hair2Harvest. All rights reserved. Promoting circular economy.</p>
              <div className="flex gap-6">
                <Link to="#" className="text-zinc-400 hover:text-emerald-600 transition-colors"><Shield size={20} /></Link>
                <Link to="#" className="text-zinc-400 hover:text-emerald-600 transition-colors"><Leaf size={20} /></Link>
              </div>
            </div>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}
