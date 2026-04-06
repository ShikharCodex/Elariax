import { useEffect } from "react";
import { motion } from "framer-motion";
import GlassCard from "../components/GlassCard";
import { useAppStore } from "../store/useAppStore";

export default function InsightsPage() {
  const { loadInitial, dailySummary, relationship, memoryCards } =
    useAppStore();

  useEffect(() => {
    loadInitial();
  }, [loadInitial]);

  // Animation variants
  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <main className="relative min-h-screen w-full overflow-x-hidden bg-gradient-to-b from-rose-950 via-purple-950 to-zinc-950 pt-28 pb-12 px-4 font-sans">
      {/* Ambient Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[500px] w-[80%] max-w-4xl rounded-full bg-rose-600/10 blur-[120px] pointer-events-none" />
      <div className="fixed bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-purple-600/10 blur-[120px] pointer-events-none" />

      <div className="relative z-10 mx-auto w-full max-w-5xl">
        {/* Page Header */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="mb-8 text-center sm:text-left"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-100 to-pink-200">
            Your Connection Journey
          </h1>
          <p className="mt-2 text-rose-200/60 text-sm sm:text-base">
            A beautiful reflection of the bond you are building together.
          </p>
        </motion.div>

        {/* Top Stats Grid */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          {/* Daily Reflection */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ delay: 0.1 }}
          >
            <GlassCard className="h-full border border-rose-500/20 bg-black/40 backdrop-blur-xl rounded-[2rem] p-6 shadow-xl shadow-rose-950/50 hover:bg-black/50 transition-colors">
              <h3 className="text-lg font-bold text-rose-100 flex items-center gap-2 mb-4">
                🌅 Today's Energy
              </h3>
              <div className="space-y-4">
                <div className="bg-rose-500/5 rounded-2xl p-4 border border-rose-500/10 text-center">
                  <p className="text-3xl font-bold text-white mb-1">
                    {dailySummary.eventsToday}
                  </p>
                  <p className="text-xs text-rose-200/60 uppercase tracking-wider">
                    Moments Shared
                  </p>
                </div>
                <div className="bg-rose-500/5 rounded-2xl p-4 border border-rose-500/10 text-center">
                  <p className="text-3xl font-bold text-white mb-1">
                    {dailySummary.averageValence}
                  </p>
                  <p className="text-xs text-rose-200/60 uppercase tracking-wider">
                    Emotional Warmth
                  </p>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Relationship Status */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ delay: 0.2 }}
          >
            <GlassCard className="h-full border border-rose-500/20 bg-black/40 backdrop-blur-xl rounded-[2rem] p-6 shadow-xl shadow-rose-950/50 hover:bg-black/50 transition-colors">
              <h3 className="text-lg font-bold text-rose-100 flex items-center gap-2 mb-4">
                💖 The Bond
              </h3>

              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="bg-rose-500/10 rounded-2xl p-3 text-center border border-rose-500/20">
                  <span className="text-[10px] text-rose-200/70 block mb-1 uppercase tracking-wide">
                    Level
                  </span>
                  <span className="text-xl font-bold text-rose-100">
                    {relationship.level}
                  </span>
                </div>
                <div className="bg-rose-500/10 rounded-2xl p-3 text-center border border-rose-500/20">
                  <span className="text-[10px] text-rose-200/70 block mb-1 uppercase tracking-wide">
                    Streak
                  </span>
                  <span className="text-xl font-bold text-rose-100">
                    {relationship.affectionStreak} 🔥
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs text-rose-200/80 mb-1.5">
                    <span>Affection</span>
                    <span>{relationship.affectionScore}%</span>
                  </div>
                  <div className="h-2 w-full bg-rose-950/50 rounded-full overflow-hidden shadow-inner">
                    <div
                      className="h-full bg-gradient-to-r from-rose-500 to-pink-500 rounded-full"
                      style={{ width: `${relationship.affectionScore || 0}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs text-rose-200/80 mb-1.5">
                    <span>Trust</span>
                    <span>{relationship.trustScore}%</span>
                  </div>
                  <div className="h-2 w-full bg-rose-950/50 rounded-full overflow-hidden shadow-inner">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-indigo-400 rounded-full"
                      style={{ width: `${relationship.trustScore || 0}%` }}
                    />
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Milestones */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ delay: 0.3 }}
          >
            <GlassCard className="h-full border border-rose-500/20 bg-black/40 backdrop-blur-xl rounded-[2rem] p-6 shadow-xl shadow-rose-950/50 hover:bg-black/50 transition-colors">
              <h3 className="text-lg font-bold text-rose-100 flex items-center gap-2 mb-4">
                🏆 Milestones
              </h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {(dailySummary.milestones || []).length ? (
                  dailySummary.milestones.map((m) => (
                    <span
                      key={m}
                      className="rounded-full border border-pink-400/30 bg-gradient-to-r from-pink-500/10 to-rose-500/10 px-3 py-2 text-xs font-medium text-pink-200 shadow-inner"
                    >
                      ✨ {m}
                    </span>
                  ))
                ) : (
                  <div className="w-full h-32 flex flex-col items-center justify-center border border-dashed border-rose-500/20 rounded-2xl bg-rose-500/5">
                    <span className="text-2xl mb-2 opacity-50">🌱</span>
                    <p className="text-xs text-rose-200/50 italic text-center px-4">
                      Keep chatting to unlock beautiful milestones together.
                    </p>
                  </div>
                )}
              </div>
            </GlassCard>
          </motion.div>
        </div>

        {/* Memory Timeline Grid */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ delay: 0.4 }}
        >
          <GlassCard className="border border-rose-500/20 bg-black/40 backdrop-blur-xl rounded-[2.5rem] p-6 sm:p-8 shadow-2xl shadow-rose-950/50">
            <div className="mb-6 border-b border-rose-500/10 pb-4">
              <h3 className="text-xl sm:text-2xl font-bold text-rose-100 flex items-center gap-3">
                <span>📸</span> Book of Memories
              </h3>
              <p className="mt-1.5 text-sm text-rose-200/60">
                The moments, details, and stories she never wants to forget.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {(memoryCards || []).length === 0 ? (
                <div className="col-span-full py-12 flex flex-col items-center justify-center text-center">
                  <span className="text-4xl mb-4 opacity-50">📖</span>
                  <p className="text-rose-200/50 italic">
                    Your story is just beginning. Make some memories.
                  </p>
                </div>
              ) : (
                (memoryCards || []).map((card, idx) => (
                  <div
                    key={`${card.title}-${idx}`}
                    className="group relative flex flex-col justify-between rounded-2xl border border-rose-500/10 bg-gradient-to-br from-rose-500/5 to-black/20 p-5 transition-all hover:-translate-y-1 hover:border-rose-500/30 hover:shadow-[0_8px_30px_-12px_rgba(225,29,72,0.4)]"
                  >
                    <div>
                      <p className="text-base font-bold text-rose-100 mb-2 leading-tight">
                        {card.title}
                      </p>
                      <p className="text-sm text-rose-200/70 leading-relaxed mb-4">
                        {card.detail}
                      </p>
                    </div>
                    <div className="mt-auto pt-3 border-t border-rose-500/10">
                      <span className="inline-block rounded-md bg-rose-500/10 px-2 py-1 text-[10px] font-medium uppercase tracking-wider text-rose-300">
                        {card.category}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </main>
  );
}
