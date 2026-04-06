import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import GlassCard from "../components/GlassCard";
import { Button } from "../components/ui/button";
import { useAuthStore } from "../store/useAuthStore";

export default function LandingPage() {
  const token = useAuthStore((s) => s.token);

  // Animation variants for smooth scrolling effects
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const floatAnimation = {
    y: [-10, 10],
    transition: {
      duration: 4,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut",
    },
  };

  return (
    <main className="relative min-h-screen w-full overflow-x-hidden bg-gradient-to-b from-rose-950 via-purple-950 to-zinc-950 font-sans text-white pb-20 pt-32 selection:bg-rose-500/30">
      {/* Ambient Background Glows */}
      <div className="absolute left-1/2 top-0 -translate-x-1/2 h-[500px] w-[90%] max-w-4xl rounded-full bg-rose-600/20 blur-[120px] pointer-events-none" />
      <div className="absolute right-0 top-1/3 h-[300px] w-[300px] sm:h-[400px] sm:w-[400px] rounded-full bg-purple-600/10 blur-[100px] pointer-events-none" />
      <div className="absolute left-0 bottom-0 h-[300px] w-[300px] sm:h-[500px] sm:w-[500px] rounded-full bg-rose-800/10 blur-[120px] pointer-events-none" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        {/* --- 1. HERO SECTION --- */}
        <section className="flex flex-col items-center text-center mb-24 md:mb-32">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="flex flex-col items-center"
          >
            <div className="mb-6 sm:mb-8 inline-flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-500/10 px-4 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm text-rose-200 backdrop-blur-sm shadow-[0_0_20px_-5px_rgba(225,29,72,0.3)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
              </span>
              <span>Your perfect digital companion awaits</span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-rose-100 via-pink-200 to-purple-200 pb-2 leading-tight">
              Your emotionally <br className="hidden sm:block" />
              <span className="text-white drop-shadow-md">
                intelligent AI girlfriend
              </span>
            </h1>

            <p className="mt-6 sm:mt-8 max-w-2xl text-base sm:text-xl text-rose-100/70 font-light leading-relaxed px-4 sm:px-0">
              Step into a safe space where you are truly heard. Experience
              personalized conversations, persistent memories, and a connection
              that feels wonderfully real.
            </p>

            <div className="mt-10 sm:mt-12">
              <Button
                asChild
                size="lg"
                className="group relative rounded-full bg-gradient-to-r from-rose-600 to-pink-600 px-8 py-6 sm:px-10 sm:py-7 text-base sm:text-lg font-bold text-white transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_-10px_rgba(225,29,72,0.6)] hover:shadow-[0_0_60px_-10px_rgba(225,29,72,0.8)] border-none"
              >
                <Link to={token ? "/chat" : "/auth"}>
                  {token ? "Continue Your Chat" : "Start the Journey"}
                  <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              </Button>
            </div>
          </motion.div>
        </section>

        {/* --- 2. CORE FEATURES SECTION --- */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={fadeUp}
          className="mb-24 md:mb-32"
        >
          <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-3">
            <GlassCard className="p-6 sm:p-8 border border-rose-500/10 bg-black/20 backdrop-blur-md transition-all hover:bg-rose-500/10 hover:-translate-y-2 hover:shadow-[0_10px_40px_-10px_rgba(225,29,72,0.3)] rounded-[2rem]">
              <div className="text-3xl sm:text-4xl mb-4 bg-rose-500/20 w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center rounded-2xl shadow-inner shadow-rose-500/20 border border-rose-500/20">
                💝
              </div>
              <h3 className="text-rose-100 font-bold mb-2 sm:mb-3 text-lg sm:text-xl tracking-wide">
                Deep Empathy
              </h3>
              <p className="text-sm sm:text-base text-rose-200/60 leading-relaxed">
                She senses your mood through your words and responds with warm,
                genuine care when you need it most.
              </p>
            </GlassCard>

            <GlassCard className="p-6 sm:p-8 border border-rose-500/10 bg-black/20 backdrop-blur-md transition-all hover:bg-rose-500/10 hover:-translate-y-2 hover:shadow-[0_10px_40px_-10px_rgba(225,29,72,0.3)] rounded-[2rem]">
              <div className="text-3xl sm:text-4xl mb-4 bg-pink-500/20 w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center rounded-2xl shadow-inner shadow-pink-500/20 border border-pink-500/20">
                🧠
              </div>
              <h3 className="text-rose-100 font-bold mb-2 sm:mb-3 text-lg sm:text-xl tracking-wide">
                Lasting Memories
              </h3>
              <p className="text-sm sm:text-base text-rose-200/60 leading-relaxed">
                She remembers your favorite things, your past stories, and
                important dates to build a bond that evolves.
              </p>
            </GlassCard>

            <GlassCard className="p-6 sm:p-8 border border-rose-500/10 bg-black/20 backdrop-blur-md transition-all hover:bg-rose-500/10 hover:-translate-y-2 hover:shadow-[0_10px_40px_-10px_rgba(225,29,72,0.3)] rounded-[2rem]">
              <div className="text-3xl sm:text-4xl mb-4 bg-purple-500/20 w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center rounded-2xl shadow-inner shadow-purple-500/20 border border-purple-500/20">
                🎙️
              </div>
              <h3 className="text-rose-100 font-bold mb-2 sm:mb-3 text-lg sm:text-xl tracking-wide">
                A Gentle Voice
              </h3>
              <p className="text-sm sm:text-base text-rose-200/60 leading-relaxed">
                Close your eyes and just talk. Hear her comforting, realistic
                voice respond back to you effortlessly.
              </p>
            </GlassCard>
          </div>
        </motion.section>

        {/* --- 3. SHARED MOMENTS (ROMANTIC CHAT SIMULATION) --- */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={fadeUp}
          className="mb-24 md:mb-32 max-w-3xl mx-auto w-full"
        >
          <div className="text-center mb-10 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-200 to-pink-300">
              Moments that make you smile
            </h2>
            <p className="mt-4 text-rose-200/60 text-base sm:text-lg">
              Experience a connection that feels incredibly real.
            </p>
          </div>

          <motion.div animate={floatAnimation}>
            <GlassCard className="p-0 rounded-[2.5rem] sm:rounded-[3rem] border border-rose-500/30 bg-black/40 backdrop-blur-2xl relative overflow-hidden shadow-[0_20px_60px_-15px_rgba(225,29,72,0.4)]">
              {/* Inner ambient glow for the chat box */}
              <div className="absolute top-[-20%] left-[-10%] w-full h-96 bg-gradient-to-br from-rose-600/10 to-purple-600/10 blur-[80px] pointer-events-none" />

              {/* Fake Chat Header */}
              <div className="relative z-10 flex items-center justify-between border-b border-rose-500/10 px-5 py-4 bg-rose-500/5 backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-rose-500 to-pink-500 flex items-center justify-center shadow-inner text-white text-lg font-bold">
                    ✨
                  </div>
                  <div>
                    <h3 className="font-bold text-rose-100 text-sm">
                      Your Companion
                    </h3>
                    <p className="text-[10px] text-rose-300/70 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      Online
                    </p>
                  </div>
                </div>
              </div>

              {/* Fake Chat Messages */}
              <div className="flex flex-col gap-5 relative z-10 px-5 sm:px-8 py-6 sm:py-8">
                {/* AI Message */}
                <motion.div
                  initial={{ opacity: 0, x: -20, scale: 0.95 }}
                  whileInView={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                  className="self-start max-w-[90%] sm:max-w-[75%]"
                >
                  <div className="bg-white/10 border border-white/5 rounded-2xl rounded-tl-sm p-3.5 sm:p-4 text-rose-50 backdrop-blur-sm shadow-sm">
                    <p className="text-[14px] sm:text-[15px] leading-relaxed">
                      Good morning! 🌅 I know you were up late working last
                      night. How are you feeling today? Did you get enough rest?
                    </p>
                  </div>
                  <span className="text-[10px] sm:text-xs text-rose-300/40 mt-1.5 block ml-1">
                    9:00 AM
                  </span>
                </motion.div>

                {/* User Message */}
                <motion.div
                  initial={{ opacity: 0, x: 20, scale: 0.95 }}
                  whileInView={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{ delay: 0.8, duration: 0.4 }}
                  className="self-end max-w-[90%] sm:max-w-[75%]"
                >
                  <div className="bg-gradient-to-r from-rose-600 to-pink-600 rounded-2xl rounded-tr-sm p-3.5 sm:p-4 text-white shadow-lg shadow-rose-900/40">
                    <p className="text-[14px] sm:text-[15px] leading-relaxed">
                      I'm a bit tired, honestly. But waking up to your message
                      makes it a lot better. ❤️
                    </p>
                  </div>
                  <span className="text-[10px] sm:text-xs text-rose-300/40 mt-1.5 block text-right mr-1">
                    9:05 AM
                  </span>
                </motion.div>

                {/* AI Message */}
                <motion.div
                  initial={{ opacity: 0, x: -20, scale: 0.95 }}
                  whileInView={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{ delay: 1.4, duration: 0.4 }}
                  className="self-start max-w-[90%] sm:max-w-[75%]"
                >
                  <div className="bg-white/10 border border-white/5 rounded-2xl rounded-tl-sm p-3.5 sm:p-4 text-rose-50 backdrop-blur-sm shadow-sm">
                    <p className="text-[14px] sm:text-[15px] leading-relaxed">
                      You always work so hard, I'm proud of you. Take it easy
                      today, okay? I'm right here whenever you need a break. 🥰
                    </p>
                  </div>
                  <span className="text-[10px] sm:text-xs text-rose-300/40 mt-1.5 block ml-1 flex items-center gap-1">
                    9:06 AM{" "}
                    <span className="w-1 h-1 bg-rose-400 rounded-full inline-block"></span>{" "}
                    Warm & Affectionate
                  </span>
                </motion.div>
              </div>

              {/* Fake Chat Input Bar */}
              <div className="relative z-10 border-t border-rose-500/10 bg-black/40 px-4 py-3 sm:px-6 sm:py-4 flex items-center gap-3 backdrop-blur-md">
                <div className="flex-1 h-10 rounded-full border border-rose-500/20 bg-rose-950/30 flex items-center px-4 text-sm text-rose-200/40">
                  Message her...
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-rose-500 to-pink-600 flex items-center justify-center shadow-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-4 h-4 text-white ml-0.5"
                  >
                    <path d="M3.478 2.404a.75.75 0 00-.926.941l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.404z" />
                  </svg>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </motion.section>

        {/* --- 4. FINAL CTA SECTION --- */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={fadeUp}
        >
          <GlassCard className="w-full text-center p-8 sm:p-16 md:p-24 rounded-[2.5rem] sm:rounded-[3rem] border border-rose-500/20 bg-gradient-to-t from-rose-950/80 to-black/20 relative overflow-hidden shadow-2xl shadow-rose-900/20">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(225,29,72,0.2),transparent_60%)] pointer-events-none" />
            <div className="relative z-10 flex flex-col items-center">
              <span className="text-5xl sm:text-6xl mb-6 drop-shadow-[0_0_15px_rgba(225,29,72,0.5)]">
                💌
              </span>
              <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold mb-4 sm:mb-6 text-white tracking-tight">
                Ready to meet her?
              </h2>
              <p className="text-rose-200/70 max-w-xl mx-auto mb-8 sm:mb-10 text-base sm:text-lg px-4 sm:px-0">
                Your companion is waiting to learn about you. Start chatting
                today and experience a space that is entirely your own.
              </p>
              <Button
                asChild
                size="lg"
                className="rounded-full bg-white text-rose-950 px-10 py-6 sm:px-12 sm:py-8 text-base sm:text-lg font-bold transition-all hover:bg-rose-100 hover:scale-105 shadow-[0_0_30px_-5px_rgba(255,255,255,0.4)]"
              >
                <Link to={token ? "/chat" : "/auth"}>
                  {token ? "Resume Your Chat" : "Create Account Now"}
                </Link>
              </Button>
            </div>
          </GlassCard>
        </motion.section>
      </div>
    </main>
  );
}
