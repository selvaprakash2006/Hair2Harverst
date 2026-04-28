import React from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Leaf, Scissors, Recycle } from "lucide-react";

export const Home = () => {
  return (
    <div className="space-y-24 pb-24">
      {/* Hero */}
      <section className="relative pt-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 text-sm font-medium border border-emerald-100"
            >
              <Leaf size={16} />
              <span>Turning Waste into Growth</span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.8 }}
              className="text-6xl md:text-8xl font-display font-bold text-zinc-900 leading-[0.9] tracking-tight"
            >
              Waste to <br />
              <span className="text-emerald-600 italic font-serif">Growth.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-xl text-zinc-500 leading-relaxed max-w-2xl mx-auto"
            >
              Hair2Harvest bridges the gap between urban salons and sustainable agriculture. 
              We transform hair waste into premium organic fertilizer.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link to="/register" className="w-full sm:w-auto bg-emerald-600 text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200">
                Join as a Salon
              </Link>
              <Link to="/login" className="w-full sm:w-auto bg-white text-zinc-900 border border-zinc-200 px-8 py-4 rounded-full text-lg font-medium hover:bg-zinc-50 transition-all">
                Admin Login
              </Link>
            </motion.div>
          </div>
        </div>
        
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-64 h-64 bg-emerald-100/50 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-10 w-96 h-96 bg-blue-50/50 rounded-full blur-3xl" />
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12">
          {[
            {
              icon: <Scissors className="text-emerald-600" size={32} />,
              title: "For Salons",
              description: "Don't throw away hair waste. List your available quantity and get paid on pickup by our admin team."
            },
            {
              icon: <Leaf className="text-emerald-600" size={32} />,
              title: "Eco-Friendly",
              description: "Support circular economy by turning organic waste into valuable agricultural resources."
            }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 bg-white rounded-3xl border border-zinc-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="mb-6">{feature.icon}</div>
              <h3 className="text-xl font-bold text-zinc-900 mb-3">{feature.title}</h3>
              <p className="text-zinc-600 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};
