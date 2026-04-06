const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true, sparse: true, trim: true },
    passwordHash: { type: String },
    userName: { type: String, required: true, trim: true },
    aiName: { type: String, default: "Luna", trim: true },
    personalityType: {
      type: String,
      enum: ["cute", "dominant", "caring", "playful"],
      default: "caring",
    },
    speakingStyle: { type: String, default: "warm and affectionate" },
    relationshipMode: {
      type: String,
      enum: ["companion", "date-night", "roleplay"],
      default: "companion",
    },
    personaPreset: {
      type: String,
      enum: ["sweet", "elegant", "spicy", "supportive", "mysterious"],
      default: "sweet",
    },
    preferences: [{ type: String, trim: true }],
    moodTone: {
      moodIntensity: { type: Number, default: 70, min: 0, max: 100 },
      toneWarmth: { type: Number, default: 80, min: 0, max: 100 },
      flirtLevel: { type: Number, default: 65, min: 0, max: 100 },
      responseLength: { type: Number, default: 55, min: 0, max: 100 },
    },
    voice: {
      enabled: { type: Boolean, default: true },
      rate: { type: Number, default: 1, min: 0.6, max: 1.4 },
      pitch: { type: Number, default: 1, min: 0.6, max: 1.8 },
      volume: { type: Number, default: 1, min: 0, max: 1 },
      autoSpeak: { type: Boolean, default: true },
      preferredGender: { type: String, enum: ["female", "male", "neutral"], default: "female" },
      selectedVoiceName: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
