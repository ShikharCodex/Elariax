import { useState } from "react";
import { Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import GlassCard from "../components/GlassCard";
import { Button } from "../components/ui/button";
import { useAuthStore } from "../store/useAuthStore";

export default function AuthPage() {
  const { token, login, register, loading, error } = useAuthStore();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ userName: "", email: "", password: "" });

  if (token) return <Navigate to="/chat" replace />;

  const onSubmit = async (e) => {
    e.preventDefault();
    if (mode === "login") {
      await login({ email: form.email, password: form.password });
    } else {
      await register(form);
    }
  };

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-rose-950 via-purple-950 to-zinc-950 flex items-center justify-center px-4 pt-28 pb-12 font-sans">
      {/* Ambient Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[80%] max-w-lg rounded-full bg-rose-600/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 h-[300px] w-[300px] rounded-full bg-purple-600/20 blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        <GlassCard className="w-full p-8 sm:p-10 border border-rose-500/20 bg-black/40 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl shadow-rose-950/50">
          <div className="text-center mb-8">
            <motion.div
              key={mode}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/20 mb-4 shadow-inner shadow-rose-500/20"
            >
              <span className="text-3xl">{mode === "login" ? "💌" : "✨"}</span>
            </motion.div>
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-100 to-pink-200">
              {mode === "login" ? "Welcome Back" : "Start Your Journey"}
            </h2>
            <p className="mt-3 text-sm text-rose-200/60 leading-relaxed">
              {mode === "login"
                ? "She's been waiting for you. Log in to continue your connection."
                : "Create an account to secure your memories and meet your companion."}
            </p>
          </div>

          <form className="space-y-4" onSubmit={onSubmit}>
            <AnimatePresence mode="wait">
              {mode === "register" && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: "auto", marginBottom: 16 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <input
                    className="w-full rounded-2xl border border-rose-500/20 bg-rose-950/30 px-5 py-4 text-white placeholder:text-rose-200/40 focus:border-rose-400/50 focus:outline-none focus:ring-2 focus:ring-rose-400/20 transition-all shadow-inner"
                    placeholder="What should she call you?"
                    value={form.userName}
                    onChange={(e) =>
                      setForm({ ...form, userName: e.target.value })
                    }
                    required={mode === "register"}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <input
              className="w-full rounded-2xl border border-rose-500/20 bg-rose-950/30 px-5 py-4 text-white placeholder:text-rose-200/40 focus:border-rose-400/50 focus:outline-none focus:ring-2 focus:ring-rose-400/20 transition-all shadow-inner"
              placeholder="Email address"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />

            <input
              className="w-full rounded-2xl border border-rose-500/20 bg-rose-950/30 px-5 py-4 text-white placeholder:text-rose-200/40 focus:border-rose-400/50 focus:outline-none focus:ring-2 focus:ring-rose-400/20 transition-all shadow-inner"
              placeholder="Password"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />

            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-sm text-rose-400 text-center bg-rose-500/10 py-3 rounded-xl border border-rose-500/20 mt-4"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            <Button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-rose-600 px-8 py-6 text-lg font-medium text-white transition-all hover:bg-rose-500 hover:scale-[1.02] active:scale-95 shadow-[0_0_30px_-5px_rgba(225,29,72,0.5)] border-none mt-6"
            >
              {loading
                ? "Connecting..."
                : mode === "login"
                  ? "Enter Your Space"
                  : "Create Account"}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <button
              className="text-sm font-medium text-rose-300/70 hover:text-rose-100 transition-colors focus:outline-none"
              onClick={() => {
                setMode((m) => (m === "login" ? "register" : "login"));
                // Optional: clear form when switching modes
                // setForm({ userName: "", email: "", password: "" });
              }}
              type="button"
            >
              {mode === "login"
                ? "Don't have an account yet? Let's create one."
                : "Already have an account? Welcome back."}
            </button>
          </div>
        </GlassCard>
      </motion.div>
    </main>
  );
}
