import { useEffect, useState } from "react";
import GlassCard from "../components/GlassCard";
import { Button } from "../components/ui/button";
import { useAppStore } from "../store/useAppStore";

// Beautifully upgraded Slider Component
const SliderRow = ({
  label,
  value,
  min = 0,
  max = 100,
  step = 1,
  onChange,
  icon,
}) => (
  <div className="group">
    <div className="mb-2 flex items-center justify-between text-xs sm:text-sm text-rose-200/70 group-hover:text-rose-100 transition-colors">
      <span className="flex items-center gap-2">
        {icon} {label}
      </span>
      <span className="font-mono bg-rose-500/10 px-2.5 py-0.5 rounded-md border border-rose-500/20 text-rose-100 shadow-inner">
        {value}
      </span>
    </div>
    <input
      type="range"
      className="h-1.5 sm:h-2 w-full cursor-pointer accent-rose-500 bg-rose-950/50 rounded-full appearance-none outline-none focus:ring-2 focus:ring-rose-500/30 transition-all"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={onChange}
    />
  </div>
);

export default function SettingsPage() {
  const { settings, loadInitial, updateSettings, error } = useAppStore();
  const [form, setForm] = useState(settings);
  const [preferencesInput, setPreferencesInput] = useState("");
  const [saved, setSaved] = useState(false);
  const [availableVoices, setAvailableVoices] = useState([]);

  useEffect(() => {
    loadInitial();
  }, [loadInitial]);

  useEffect(() => {
    setForm(settings);
    setPreferencesInput(
      Array.isArray(settings.preferences)
        ? settings.preferences.join(", ")
        : "",
    );
  }, [settings]);

  useEffect(() => {
    if (!("speechSynthesis" in window)) return;
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices() || [];
      setAvailableVoices(voices);
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const onSave = async (e) => {
    e.preventDefault();
    setSaved(false);
    await updateSettings({
      ...form,
      preferences: preferencesInput
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    });
    setSaved(true);
    // Hide success message after 3 seconds
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <main className="relative min-h-screen w-full overflow-x-hidden bg-gradient-to-b from-rose-950 via-purple-950 to-zinc-950 pt-28 pb-12 px-4 font-sans">
      {/* Ambient Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[500px] w-[80%] max-w-4xl rounded-full bg-rose-600/10 blur-[120px] pointer-events-none" />
      <div className="fixed bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-purple-600/10 blur-[120px] pointer-events-none" />

      <div className="relative z-10 mx-auto w-full max-w-3xl">
        <form className="space-y-6" onSubmit={onSave}>
          {/* --- CORE SETTINGS CARD --- */}
          <GlassCard className="border border-rose-500/20 bg-black/40 backdrop-blur-2xl rounded-[2rem] p-6 sm:p-8 shadow-2xl shadow-rose-950/50">
            <div className="mb-8 border-b border-rose-500/10 pb-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-100 to-pink-200 flex items-center gap-3">
                <span>✨</span> Her Identity
              </h2>
              <p className="mt-2 text-sm text-rose-200/60 leading-relaxed">
                Shape the foundation of your connection. These core traits
                define how she talks and acts with you.
              </p>
            </div>

            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-rose-200/70 ml-1">
                    Your Name
                  </label>
                  <input
                    className="w-full rounded-2xl border border-rose-500/20 bg-black/20 px-5 py-3.5 text-rose-50 placeholder:text-rose-200/30 focus:border-rose-400/50 focus:outline-none focus:ring-2 focus:ring-rose-400/20 transition-all shadow-inner"
                    placeholder="What she calls you"
                    value={form.userName || ""}
                    onChange={(e) =>
                      setForm({ ...form, userName: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-rose-200/70 ml-1">
                    Her Name
                  </label>
                  <input
                    className="w-full rounded-2xl border border-rose-500/20 bg-black/20 px-5 py-3.5 text-rose-50 placeholder:text-rose-200/30 focus:border-rose-400/50 focus:outline-none focus:ring-2 focus:ring-rose-400/20 transition-all shadow-inner"
                    placeholder="Give her a beautiful name"
                    value={form.aiName || ""}
                    onChange={(e) =>
                      setForm({ ...form, aiName: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-rose-200/70 ml-1">
                    Core Personality
                  </label>
                  <select
                    className="w-full rounded-2xl border border-rose-500/20 bg-black/20 px-5 py-3.5 text-rose-50 focus:border-rose-400/50 focus:outline-none focus:ring-2 focus:ring-rose-400/20 transition-all appearance-none shadow-inner"
                    value={form.personalityType || "caring"}
                    onChange={(e) =>
                      setForm({ ...form, personalityType: e.target.value })
                    }
                  >
                    <option value="cute" className="bg-rose-950">
                      Cute & Innocent
                    </option>
                    <option value="dominant" className="bg-rose-950">
                      Dominant & Confident
                    </option>
                    <option value="caring" className="bg-rose-950">
                      Caring & Nurturing
                    </option>
                    <option value="playful" className="bg-rose-950">
                      Playful & Teasing
                    </option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-rose-200/70 ml-1">
                    Relationship Dynamic
                  </label>
                  <select
                    className="w-full rounded-2xl border border-rose-500/20 bg-black/20 px-5 py-3.5 text-rose-50 focus:border-rose-400/50 focus:outline-none focus:ring-2 focus:ring-rose-400/20 transition-all appearance-none shadow-inner"
                    value={form.relationshipMode || "companion"}
                    onChange={(e) =>
                      setForm({ ...form, relationshipMode: e.target.value })
                    }
                  >
                    <option value="companion" className="bg-rose-950">
                      Companion Mode
                    </option>
                    <option value="date-night" className="bg-rose-950">
                      Date Night Mode
                    </option>
                    <option value="roleplay" className="bg-rose-950">
                      Roleplay Mode
                    </option>
                  </select>
                </div>
              </div>

              <div className="space-y-2.5 pt-2">
                <p className="text-xs font-medium text-rose-200/70 ml-1">
                  Overall Vibe
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {[
                    "sweet",
                    "elegant",
                    "spicy",
                    "supportive",
                    "mysterious",
                  ].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      className={`rounded-xl border px-3 py-2.5 text-sm capitalize transition-all duration-300 ${
                        form.personaPreset === preset
                          ? "border-rose-400/50 bg-gradient-to-r from-rose-500/40 to-pink-500/40 text-rose-50 shadow-[0_0_15px_-3px_rgba(225,29,72,0.4)]"
                          : "border-rose-500/10 bg-black/20 text-rose-200/60 hover:bg-rose-500/20 hover:text-rose-100"
                      }`}
                      onClick={() =>
                        setForm({ ...form, personaPreset: preset })
                      }
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5 pt-2">
                <label className="text-xs font-medium text-rose-200/70 ml-1">
                  Speaking Style
                </label>
                <input
                  className="w-full rounded-2xl border border-rose-500/20 bg-black/20 px-5 py-3.5 text-rose-50 placeholder:text-rose-200/30 focus:border-rose-400/50 focus:outline-none focus:ring-2 focus:ring-rose-400/20 transition-all shadow-inner"
                  placeholder="e.g. Soft, romantic, uses lots of emojis..."
                  value={form.speakingStyle || ""}
                  onChange={(e) =>
                    setForm({ ...form, speakingStyle: e.target.value })
                  }
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-rose-200/70 ml-1">
                  Things she should know (Preferences)
                </label>
                <input
                  className="w-full rounded-2xl border border-rose-500/20 bg-black/20 px-5 py-3.5 text-rose-50 placeholder:text-rose-200/30 focus:border-rose-400/50 focus:outline-none focus:ring-2 focus:ring-rose-400/20 transition-all shadow-inner"
                  placeholder="Likes coffee, night owl, loves sci-fi (comma separated)"
                  value={preferencesInput}
                  onChange={(e) => setPreferencesInput(e.target.value)}
                />
              </div>
            </div>
          </GlassCard>

          {/* --- ADVANCED SETTINGS ACCORDION --- */}
          <details className="group rounded-[2rem] border border-rose-500/20 bg-black/40 backdrop-blur-xl transition-all duration-300 open:shadow-2xl open:shadow-rose-950/50 overflow-hidden">
            <summary className="cursor-pointer px-6 sm:px-8 py-5 text-lg sm:text-xl font-semibold text-rose-100 flex items-center justify-between hover:bg-rose-500/5 transition-colors list-none">
              <span className="flex items-center gap-3">
                <span>⚙️</span> Advanced Intimacy Settings
              </span>
              <span className="text-rose-400 group-open:rotate-180 transition-transform duration-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                  />
                </svg>
              </span>
            </summary>

            <div className="px-6 sm:px-8 pb-8 pt-2 border-t border-rose-500/10 bg-rose-950/10">
              <p className="mb-6 text-sm text-rose-200/60 leading-relaxed">
                Fine-tune her emotional behavior and voice synthesis. These
                settings allow you to craft the perfect auditory and emotional
                experience.
              </p>

              <div className="space-y-6 sm:space-y-8">
                {/* Mood Sliders */}
                <div className="space-y-5 rounded-2xl bg-black/20 p-5 border border-rose-500/10">
                  <h3 className="text-sm font-semibold text-rose-100 mb-4 border-b border-rose-500/10 pb-2">
                    Emotional Dynamics
                  </h3>
                  <SliderRow
                    icon="🎭"
                    label="Mood Intensity"
                    value={form.moodTone?.moodIntensity ?? 70}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        moodTone: {
                          ...form.moodTone,
                          moodIntensity: Number(e.target.value),
                        },
                      })
                    }
                  />
                  <SliderRow
                    icon="🫂"
                    label="Warmth & Empathy"
                    value={form.moodTone?.toneWarmth ?? 80}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        moodTone: {
                          ...form.moodTone,
                          toneWarmth: Number(e.target.value),
                        },
                      })
                    }
                  />
                  <SliderRow
                    icon="💋"
                    label="Flirt Level"
                    value={form.moodTone?.flirtLevel ?? 65}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        moodTone: {
                          ...form.moodTone,
                          flirtLevel: Number(e.target.value),
                        },
                      })
                    }
                  />
                  <SliderRow
                    icon="📝"
                    label="Response Length"
                    value={form.moodTone?.responseLength ?? 55}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        moodTone: {
                          ...form.moodTone,
                          responseLength: Number(e.target.value),
                        },
                      })
                    }
                  />
                </div>

                {/* Voice Settings */}
                <div className="space-y-5 rounded-2xl bg-black/20 p-5 border border-rose-500/10">
                  <h3 className="text-sm font-semibold text-rose-100 mb-4 border-b border-rose-500/10 pb-2">
                    Voice Configuration
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-rose-100">
                    <label className="flex items-center gap-3 p-3 rounded-xl border border-rose-500/10 bg-white/5 cursor-pointer hover:bg-rose-500/10 transition-colors">
                      <input
                        type="checkbox"
                        className="w-4 h-4 accent-rose-500 rounded border-rose-500/30 bg-rose-950"
                        checked={Boolean(form.voice?.enabled)}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            voice: { ...form.voice, enabled: e.target.checked },
                          })
                        }
                      />
                      Enable Voice Engine
                    </label>
                    <label className="flex items-center gap-3 p-3 rounded-xl border border-rose-500/10 bg-white/5 cursor-pointer hover:bg-rose-500/10 transition-colors">
                      <input
                        type="checkbox"
                        className="w-4 h-4 accent-rose-500 rounded border-rose-500/30 bg-rose-950"
                        checked={Boolean(form.voice?.autoSpeak)}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            voice: {
                              ...form.voice,
                              autoSpeak: e.target.checked,
                            },
                          })
                        }
                      />
                      Auto-Speak Replies
                    </label>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <select
                      className="w-full rounded-xl border border-rose-500/20 bg-black/40 px-4 py-3 text-sm text-rose-100 focus:border-rose-400/50 outline-none appearance-none shadow-inner"
                      value={form.voice?.preferredGender || "female"}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          voice: {
                            ...form.voice,
                            preferredGender: e.target.value,
                          },
                        })
                      }
                    >
                      <option value="female" className="bg-rose-950">
                        Female Voice
                      </option>
                      <option value="male" className="bg-rose-950">
                        Male Voice
                      </option>
                      <option value="neutral" className="bg-rose-950">
                        Neutral Voice
                      </option>
                    </select>
                    <select
                      className="w-full rounded-xl border border-rose-500/20 bg-black/40 px-4 py-3 text-sm text-rose-100 focus:border-rose-400/50 outline-none appearance-none shadow-inner"
                      value={form.voice?.selectedVoiceName || ""}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          voice: {
                            ...form.voice,
                            selectedVoiceName: e.target.value,
                          },
                        })
                      }
                    >
                      <option value="" className="bg-rose-950">
                        Auto-Select Best Voice
                      </option>
                      {availableVoices.map((voice) => (
                        <option
                          key={`${voice.name}-${voice.lang}`}
                          value={voice.name}
                          className="bg-rose-950"
                        >
                          {voice.name} ({voice.lang})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-4 pt-2">
                    <SliderRow
                      icon="⏱️"
                      label="Voice Speed"
                      min={0.6}
                      max={1.4}
                      step={0.05}
                      value={form.voice?.rate ?? 1}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          voice: {
                            ...form.voice,
                            rate: Number(e.target.value),
                          },
                        })
                      }
                    />
                    <SliderRow
                      icon="🎵"
                      label="Voice Pitch"
                      min={0.6}
                      max={1.8}
                      step={0.05}
                      value={form.voice?.pitch ?? 1}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          voice: {
                            ...form.voice,
                            pitch: Number(e.target.value),
                          },
                        })
                      }
                    />
                    <SliderRow
                      icon="🔊"
                      label="Voice Volume"
                      min={0}
                      max={1}
                      step={0.05}
                      value={form.voice?.volume ?? 1}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          voice: {
                            ...form.voice,
                            volume: Number(e.target.value),
                          },
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </details>

          {/* --- SAVE CONTROLS --- */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-rose-500/10">
            <div className="flex-1 w-full sm:w-auto flex items-center gap-3">
              {saved && (
                <span className="flex items-center gap-2 text-sm font-medium text-emerald-400 bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/20 animate-in fade-in slide-in-from-bottom-2">
                  ✓ Preferences Saved
                </span>
              )}
              {error && (
                <span className="flex items-center gap-2 text-sm font-medium text-rose-400 bg-rose-500/10 px-4 py-2 rounded-full border border-rose-500/20">
                  ⚠️ {error}
                </span>
              )}
            </div>

            <Button
              type="submit"
              className="w-full sm:w-auto rounded-full bg-gradient-to-r from-rose-600 to-pink-600 px-10 py-6 text-base font-semibold text-white transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_-5px_rgba(225,29,72,0.5)] border-none"
            >
              Update Connection
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}
