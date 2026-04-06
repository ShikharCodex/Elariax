import { create } from "zustand";
import { addMemoryCard, fetchSettings, fetchState, fetchSummary, saveSettings, sendMessage } from "../services/api";

export const useAppStore = create((set) => ({
  loadingState: false,
  sendingMessage: false,
  error: "",
  messages: [],
  emotionState: { happy: 55, sad: 10, angry: 5, romantic: 30 },
  dominantEmotion: "happy",
  emotionalInsights: { valence: 60, arousal: 50, stability: 70 },
  relationship: { level: 1, affectionScore: 35, trustScore: 40, affectionStreak: 0 },
  dailySummary: { averageValence: 50, eventsToday: 0, milestones: [] },
  memoryCards: [],
  settings: {
    userName: "You",
    aiName: "Luna",
    personalityType: "caring",
    speakingStyle: "warm and affectionate",
    relationshipMode: "companion",
    personaPreset: "sweet",
    preferences: [],
    moodTone: { moodIntensity: 70, toneWarmth: 80, flirtLevel: 65, responseLength: 55 },
    voice: { enabled: true, rate: 1, pitch: 1, volume: 1, autoSpeak: true, preferredGender: "female", selectedVoiceName: "" },
  },

  loadInitial: async () => {
    set({ loadingState: true, error: "" });
    try {
      const [state, settings] = await Promise.all([fetchState(), fetchSettings()]);
      const maxEmotion = Object.entries(state.emotionState).sort((a, b) => b[1] - a[1])[0][0];
      set({
        messages: state.messages,
        emotionState: state.emotionState,
        dominantEmotion: maxEmotion,
        emotionalInsights: state.emotionalInsights || { valence: 60, arousal: 50, stability: 70 },
        relationship: state.relationship || { level: 1, affectionScore: 35, trustScore: 40, affectionStreak: 0 },
        dailySummary: state.dailySummary || { averageValence: 50, eventsToday: 0, milestones: [] },
        settings,
      });
      const summaryData = await fetchSummary();
      set({ memoryCards: summaryData.memoryCards || [] });
    } catch (error) {
      set({ error: error.message });
    } finally {
      set({ loadingState: false });
    }
  },

  sendChatMessage: async (content, attachment = null) => {
    if (!content.trim()) return;
    const optimisticMessage = { role: "user", content, createdAt: new Date().toISOString() };
    set((state) => ({
      sendingMessage: true,
      error: "",
      messages: [...state.messages, optimisticMessage],
    }));

    try {
      const response = await sendMessage(content, attachment);
      set({
        messages: response.messages,
        emotionState: response.emotionState,
        dominantEmotion: response.dominantEmotion,
        emotionalInsights: response.emotionalInsights || { valence: 60, arousal: 50, stability: 70 },
        relationship: response.relationship || { level: 1, affectionScore: 35, trustScore: 40, affectionStreak: 0 },
        dailySummary: response.dailySummary || { averageValence: 50, eventsToday: 0, milestones: [] },
      });
    } catch (error) {
      set((state) => ({
        error: error.message,
        messages: state.messages.filter((msg) => msg !== optimisticMessage),
      }));
    } finally {
      set({ sendingMessage: false });
    }
  },

  updateSettings: async (payload) => {
    set({ loadingState: true, error: "" });
    try {
      const data = await saveSettings(payload);
      set({
        settings: {
          userName: data.userName,
          aiName: data.aiName,
          personalityType: data.personalityType,
          speakingStyle: data.speakingStyle,
          relationshipMode: data.relationshipMode || "companion",
          personaPreset: data.personaPreset || "sweet",
          preferences: data.preferences || [],
          moodTone: data.moodTone || { moodIntensity: 70, toneWarmth: 80, flirtLevel: 65, responseLength: 55 },
          voice: data.voice || {
            enabled: true,
            rate: 1,
            pitch: 1,
            volume: 1,
            autoSpeak: true,
            preferredGender: "female",
            selectedVoiceName: "",
          },
        },
      });
    } catch (error) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ loadingState: false });
    }
  },

  createMemoryCard: async (payload) => {
    const cards = await addMemoryCard(payload);
    set({ memoryCards: cards });
  },
}));
