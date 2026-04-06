import { useEffect, useMemo, useState } from "react";
import { Volume2, VolumeX, MessageCircleHeart, Activity } from "lucide-react";
import GlassCard from "../components/GlassCard";
import MessageBubble from "../components/MessageBubble";
import TypingIndicator from "../components/TypingIndicator";
import ChatInput from "../components/ChatInput";
import { useAppStore } from "../store/useAppStore";
import { useAutoScroll } from "../hooks/useAutoScroll";
import { useVoiceSynthesis } from "../hooks/useVoiceSynthesis";
import { Button } from "../components/ui/button";

export default function ChatPage() {
  const {
    messages,
    emotionState,
    dominantEmotion,
    emotionalInsights,
    relationship,
    dailySummary,
    memoryCards,
    createMemoryCard,
    settings,
    sendingMessage,
    error,
    loadInitial,
    sendChatMessage,
  } = useAppStore();

  const { speak, stop } = useVoiceSynthesis();
  const messagesRef = useAutoScroll(messages);
  const lastAssistantMessage = useMemo(
    () =>
      [...messages].reverse().find((message) => message.role === "assistant"),
    [messages],
  );

  // Magic state to handle mobile view switching (Chat vs Stats)
  const [activeMobileView, setActiveMobileView] = useState("chat");

  useEffect(() => {
    loadInitial();
  }, [loadInitial]);

  useEffect(() => {
    if (lastAssistantMessage?.content && settings?.voice?.autoSpeak) {
      speak(lastAssistantMessage.content, settings.voice);
    }
  }, [lastAssistantMessage, settings?.voice, speak]);

  const addQuickMemory = async () => {
    const title = window.prompt("Memory card title");
    const detail = window.prompt("Memory details");
    if (!title || !detail) return;
    await createMemoryCard({
      title,
      detail,
      category: "moment",
      pinned: false,
    });
  };

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-rose-950 via-purple-950 to-zinc-950 pt-24 pb-6 px-3 sm:px-6 font-sans">
      {/* Ambient Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[600px] w-[90%] max-w-4xl rounded-full bg-rose-600/15 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] h-[500px] w-[500px] rounded-full bg-purple-600/15 blur-[120px] pointer-events-none" />

      {/* Mobile Toggle Switch (Hidden on Desktop) */}
      <div className="lg:hidden flex justify-center mb-4 relative z-20">
        <div className="flex items-center bg-black/40 backdrop-blur-xl rounded-full p-1 border border-rose-500/20 shadow-lg">
          <button
            onClick={() => setActiveMobileView("chat")}
            className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              activeMobileView === "chat"
                ? "bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-[0_0_15px_-3px_rgba(225,29,72,0.5)]"
                : "text-rose-200/60 hover:text-rose-100"
            }`}
          >
            <MessageCircleHeart className="w-4 h-4" /> Chat
          </button>
          <button
            onClick={() => setActiveMobileView("stats")}
            className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              activeMobileView === "stats"
                ? "bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-[0_0_15px_-3px_rgba(225,29,72,0.5)]"
                : "text-rose-200/60 hover:text-rose-100"
            }`}
          >
            <Activity className="w-4 h-4" /> Her Heart
          </button>
        </div>
      </div>

      {/* Main App Layout */}
      {/* Dynamic height ensures it perfectly fits the screen between the navbar and the bottom */}
      <div className="mx-auto flex w-full max-w-[1400px] gap-6 relative z-10 h-[calc(100dvh-9rem)] lg:h-[calc(100dvh-7.5rem)]">
        {/* --- LEFT: MAIN CHAT SECTION --- */}
        <GlassCard
          className={`flex-1 min-w-0 flex-col overflow-hidden border border-rose-500/20 bg-black/40 backdrop-blur-2xl rounded-[2rem] shadow-2xl shadow-rose-950/50 p-0 
          ${activeMobileView === "chat" ? "flex" : "hidden lg:flex"}`}
        >
          {/* Chat Header */}
          <div className="shrink-0 flex items-center justify-between border-b border-rose-500/10 px-5 sm:px-8 py-4 sm:py-5 bg-rose-500/5">
            <div className="flex items-center gap-3 sm:gap-4">
              <span className="relative flex h-2.5 w-2.5 sm:h-3 sm:w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 sm:h-3 sm:w-3 bg-rose-500 shadow-[0_0_10px_rgba(225,29,72,0.8)]"></span>
              </span>
              <h2 className="text-lg sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-100 to-pink-200 tracking-tight">
                Your Private Space
              </h2>
            </div>
            <span className="rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-1 sm:px-4 sm:py-1.5 text-[10px] sm:text-xs font-medium text-rose-200 shadow-inner shadow-rose-500/20 capitalize flex items-center gap-2">
              ✨ {dominantEmotion}
            </span>
          </div>

          {/* Messages Area */}
          <div
            ref={messagesRef}
            className="flex-1 min-h-0 flex flex-col gap-5 overflow-y-auto px-4 sm:px-8 py-6 scrollbar-thin scrollbar-thumb-rose-500/20 scrollbar-track-transparent"
          >
            {messages.map((message, index) => (
              <MessageBubble
                key={`${message.role}-${index}-${message.createdAt || index}`}
                role={message.role}
                content={message.content}
                createdAt={message.createdAt}
              />
            ))}
            {sendingMessage ? (
              <div className="self-start">
                <TypingIndicator />
              </div>
            ) : null}
          </div>

          {/* Input & Voice Controls Area */}
          <div className="shrink-0 border-t border-rose-500/10 bg-black/30 p-4 sm:p-6 w-full">
            <ChatInput onSend={sendChatMessage} isLoading={sendingMessage} />

            <div className="mt-3.5 flex items-center justify-between px-1">
              {error ? (
                <p className="text-[11px] sm:text-xs text-rose-400 bg-rose-500/10 px-3 py-1 rounded-lg border border-rose-500/20 line-clamp-1">
                  {error}
                </p>
              ) : (
                <span className="text-[10px] sm:text-xs text-rose-200/40 italic flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-emerald-500/50"></span>
                  End-to-end emotional connection
                </span>
              )}

              <div className="flex items-center gap-1.5 bg-rose-950/40 p-1 rounded-full border border-rose-500/10 shadow-inner">
                <Button
                  type="button"
                  variant="ghost"
                  className="rounded-full h-8 w-8 sm:h-9 sm:w-9 p-0 text-rose-300 hover:text-white hover:bg-rose-500/40 transition-colors"
                  onClick={() =>
                    lastAssistantMessage?.content &&
                    speak(lastAssistantMessage.content, settings?.voice)
                  }
                  title="Speak Last Message"
                >
                  <Volume2 className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="rounded-full h-8 w-8 sm:h-9 sm:w-9 p-0 text-rose-300 hover:text-white hover:bg-rose-500/40 transition-colors"
                  onClick={stop}
                  title="Stop Speaking"
                >
                  <VolumeX className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* --- RIGHT: MOOD & RELATIONSHIP SIDEBAR --- */}
        {/* Fixed width on desktop ensures it never squishes the chat. Hidden on mobile unless toggled. */}
        <GlassCard
          className={`w-full lg:w-[350px] xl:w-[400px] shrink-0 flex-col overflow-hidden border border-rose-500/20 bg-black/40 backdrop-blur-2xl rounded-[2rem] shadow-2xl shadow-rose-950/50 p-0
          ${activeMobileView === "stats" ? "flex" : "hidden lg:flex"}`}
        >
          {/* We put the padding and overflow-y-auto on an inner div so the card itself doesn't stretch and break the layout */}
          <div className="h-full w-full overflow-y-auto p-5 sm:p-7 scrollbar-thin scrollbar-thumb-rose-500/20 scrollbar-track-transparent">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-100 to-pink-200 flex items-center gap-2">
                💝 Her Heart
              </h3>
              <p className="mt-1.5 text-xs sm:text-sm text-rose-200/60 leading-relaxed">
                A real-time reflection of how she feels and connects with you.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="rounded-2xl border border-rose-500/10 bg-gradient-to-br from-rose-500/5 to-black/20 p-4 flex flex-col items-center justify-center text-center shadow-inner">
                <span className="text-[10px] sm:text-xs text-rose-200/70 mb-1 font-medium tracking-wide">
                  Relationship Lv.
                </span>
                <span className="text-2xl font-bold text-rose-100">
                  {relationship.level}
                </span>
              </div>
              <div className="rounded-2xl border border-rose-500/10 bg-gradient-to-br from-rose-500/5 to-black/20 p-4 flex flex-col items-center justify-center text-center shadow-inner">
                <span className="text-[10px] sm:text-xs text-rose-200/70 mb-1 font-medium tracking-wide">
                  Affection Streak
                </span>
                <span className="text-2xl font-bold text-rose-100">
                  {relationship.affectionStreak} 🔥
                </span>
              </div>
            </div>

            <div className="mb-6 rounded-2xl border border-rose-500/10 bg-rose-500/5 p-3.5 text-xs sm:text-sm text-rose-200/80 text-center">
              Today:{" "}
              <span className="font-semibold text-rose-100">
                {dailySummary.eventsToday}
              </span>{" "}
              emotional events <br />
              <span className="text-[10px] sm:text-xs opacity-70">
                (Avg Valence: {dailySummary.averageValence})
              </span>
            </div>

            {dailySummary.milestones?.length > 0 && (
              <div className="mb-8 flex flex-wrap gap-2 justify-center">
                {dailySummary.milestones.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-pink-400/30 bg-gradient-to-r from-pink-500/10 to-rose-500/10 px-3 py-1.5 text-[10px] sm:text-xs font-medium text-pink-200"
                  >
                    🏆 {item}
                  </span>
                ))}
              </div>
            )}

            <div className="space-y-4 mb-8">
              <h4 className="text-xs sm:text-sm font-bold text-rose-100 border-b border-rose-500/10 pb-2.5 uppercase tracking-wider">
                Emotional State
              </h4>
              {Object.entries(emotionState).map(([emotion, value]) => (
                <div key={emotion} className="group">
                  <div className="mb-1.5 flex items-center justify-between text-[10px] sm:text-xs text-rose-200/70 group-hover:text-rose-100 transition-colors">
                    <span className="capitalize font-medium">{emotion}</span>
                    <span className="font-mono bg-rose-500/10 px-1.5 rounded text-[10px]">
                      {value}%
                    </span>
                  </div>
                  <div className="h-1.5 sm:h-2 rounded-full bg-rose-950/50 overflow-hidden shadow-inner">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-rose-500 to-pink-500 shadow-[0_0_10px_rgba(225,29,72,0.5)] transition-all duration-500 ease-out"
                      style={{ width: `${value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4 mb-8">
              <h4 className="text-xs sm:text-sm font-bold text-rose-100 border-b border-rose-500/10 pb-2.5 uppercase tracking-wider">
                Deep Metrics
              </h4>
              {Object.entries({
                valence: emotionalInsights.valence,
                arousal: emotionalInsights.arousal,
                stability: emotionalInsights.stability,
                affection: relationship.affectionScore,
                trust: relationship.trustScore,
              }).map(([metric, value]) => (
                <div key={metric} className="group">
                  <div className="mb-1.5 flex items-center justify-between text-[10px] sm:text-xs text-rose-200/70 group-hover:text-rose-100 transition-colors">
                    <span className="capitalize font-medium">{metric}</span>
                    <span className="font-mono bg-purple-500/10 px-1.5 rounded text-[10px]">
                      {value}%
                    </span>
                  </div>
                  <div className="h-1.5 sm:h-2 rounded-full bg-rose-950/50 overflow-hidden shadow-inner">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-400 shadow-[0_0_10px_rgba(168,85,247,0.5)] transition-all duration-500 ease-out"
                      style={{ width: `${value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-rose-500/10">
              <div className="mb-4 flex items-center justify-between">
                <h4 className="text-xs sm:text-sm font-bold text-rose-100 flex items-center gap-2 uppercase tracking-wider">
                  🧠 Core Memories
                </h4>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={addQuickMemory}
                  className="h-7 px-3 text-[10px] sm:text-xs font-medium bg-rose-500/10 text-rose-200 hover:bg-rose-500/20 hover:text-white rounded-full border border-rose-500/20"
                >
                  + Add
                </Button>
              </div>
              <div className="space-y-3">
                {(memoryCards || []).length === 0 ? (
                  <div className="text-center py-6 text-[10px] sm:text-xs text-rose-200/40 italic border border-dashed border-rose-500/20 rounded-xl bg-black/20">
                    No memories created yet...
                  </div>
                ) : (
                  (memoryCards || []).slice(0, 4).map((card, idx) => (
                    <div
                      key={`${card.title}-${idx}`}
                      className="rounded-xl border border-rose-500/10 bg-gradient-to-br from-rose-500/5 to-black/20 p-3.5 transition-all hover:bg-rose-500/10 hover:border-rose-500/30 group shadow-sm"
                    >
                      <p className="text-xs sm:text-sm font-bold text-rose-100 mb-1">
                        {card.title}
                      </p>
                      <p className="text-[10px] sm:text-xs text-rose-200/60 leading-relaxed line-clamp-2 group-hover:line-clamp-none transition-all">
                        {card.detail}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </main>
  );
}
