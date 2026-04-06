const mongoose = require("mongoose");
const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");

const DEFAULT_USER_ID = "000000000000000000000001";
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const getUser = async (authUserId) => {
  if (authUserId) {
    const existing = await User.findById(authUserId);
    if (existing) return existing;
  }
  const userId = new mongoose.Types.ObjectId(DEFAULT_USER_ID);
  let user = await User.findById(userId);
  if (!user) {
    user = await User.create({
      _id: userId,
      userName: "You",
      aiName: "Luna",
      personalityType: "caring",
      speakingStyle: "warm and affectionate",
      relationshipMode: "companion",
      personaPreset: "sweet",
      preferences: [],
      moodTone: { moodIntensity: 70, toneWarmth: 80, flirtLevel: 65, responseLength: 55 },
      voice: {
        enabled: true,
        rate: 1,
        pitch: 1,
        volume: 1,
        autoSpeak: true,
        preferredGender: "female",
        selectedVoiceName: "",
      },
    });
  }
  return user;
};

const getSettings = asyncHandler(async (req, res) => {
  const user = await getUser(req.auth?.userId);
  res.json({
    success: true,
    data: {
      userName: user?.userName || "You",
      aiName: user?.aiName || "Luna",
      personalityType: user?.personalityType || "caring",
      speakingStyle: user?.speakingStyle || "warm and affectionate",
      relationshipMode: user?.relationshipMode || "companion",
      personaPreset: user?.personaPreset || "sweet",
      preferences: user?.preferences || [],
      moodTone: user?.moodTone || { moodIntensity: 70, toneWarmth: 80, flirtLevel: 65, responseLength: 55 },
      voice: user?.voice || {
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
});

const updateSettings = asyncHandler(async (req, res) => {
  const { userName, aiName, personalityType, speakingStyle, relationshipMode, personaPreset, preferences, moodTone, voice } = req.body;
  const user = await getUser(req.auth?.userId);
  if (!user) return res.status(404).json({ success: false, message: "User not found." });

  user.userName = userName?.trim() || user.userName;
  user.aiName = aiName?.trim() || user.aiName;
  user.personalityType = personalityType || user.personalityType;
  user.speakingStyle = speakingStyle?.trim() || user.speakingStyle;
  user.relationshipMode = ["companion", "date-night", "roleplay"].includes(relationshipMode)
    ? relationshipMode
    : user.relationshipMode;
  user.personaPreset = ["sweet", "elegant", "spicy", "supportive", "mysterious"].includes(personaPreset)
    ? personaPreset
    : user.personaPreset;
  user.preferences = Array.isArray(preferences) ? preferences.map((p) => p.trim()).filter(Boolean) : user.preferences;
  if (moodTone && typeof moodTone === "object") {
    user.moodTone = {
      moodIntensity: clamp(Number(moodTone.moodIntensity ?? user.moodTone?.moodIntensity ?? 70), 0, 100),
      toneWarmth: clamp(Number(moodTone.toneWarmth ?? user.moodTone?.toneWarmth ?? 80), 0, 100),
      flirtLevel: clamp(Number(moodTone.flirtLevel ?? user.moodTone?.flirtLevel ?? 65), 0, 100),
      responseLength: clamp(Number(moodTone.responseLength ?? user.moodTone?.responseLength ?? 55), 0, 100),
    };
  }
  if (voice && typeof voice === "object") {
    user.voice = {
      enabled: Boolean(voice.enabled ?? user.voice?.enabled ?? true),
      autoSpeak: Boolean(voice.autoSpeak ?? user.voice?.autoSpeak ?? true),
      rate: clamp(Number(voice.rate ?? user.voice?.rate ?? 1), 0.6, 1.4),
      pitch: clamp(Number(voice.pitch ?? user.voice?.pitch ?? 1), 0.6, 1.8),
      volume: clamp(Number(voice.volume ?? user.voice?.volume ?? 1), 0, 1),
      preferredGender: ["female", "male", "neutral"].includes(voice.preferredGender)
        ? voice.preferredGender
        : user.voice?.preferredGender || "female",
      selectedVoiceName: typeof voice.selectedVoiceName === "string" ? voice.selectedVoiceName : user.voice?.selectedVoiceName || "",
    };
  }

  await user.save();

  res.json({ success: true, data: user });
});

module.exports = { getSettings, updateSettings };
