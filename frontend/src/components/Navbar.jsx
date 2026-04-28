import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, Recycle, Menu, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "motion/react";

export const Navbar = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-white border-b border-zinc-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white">
                <Recycle size={24} />
              </div>
              <span className="text-xl font-bold tracking-tight text-zinc-900">Hair2Harvest</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-6">
            {user ? (
              <>
                <Link to={`/${user.role}-dashboard`} className="text-sm font-medium text-zinc-600 hover:text-emerald-600 transition-colors">
                  Dashboard
                </Link>
                <div className="flex items-center gap-3 pl-6 border-l border-zinc-200">
                  <div className="text-right">
                    <p className="text-sm font-semibold text-zinc-900">{user.name}</p>
                    <p className="text-xs text-zinc-500 capitalize">{user.role}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-zinc-400 hover:text-red-500 transition-colors"
                  >
                    <LogOut size={20} />
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-zinc-600 hover:text-emerald-600 transition-colors">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-emerald-600 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-emerald-700 transition-colors"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-zinc-600">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-zinc-200 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {user ? (
                <>
                  <Link to={`/${user.role}-dashboard`} className="block px-3 py-2 text-base font-medium text-zinc-600">Dashboard</Link>
                  <button onClick={handleLogout} className="block w-full text-left px-3 py-2 text-base font-medium text-red-600">Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" className="block px-3 py-2 text-base font-medium text-zinc-600">Login</Link>
                  <Link to="/register" className="block px-3 py-2 text-base font-medium text-emerald-600">Register</Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
