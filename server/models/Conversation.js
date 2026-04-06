const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    messages: [
      {
        role: { type: String, enum: ["user", "assistant"], required: true },
        content: { type: String, required: true, trim: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    emotionState: {
      happy: { type: Number, default: 55, min: 0, max: 100 },
      sad: { type: Number, default: 10, min: 0, max: 100 },
      angry: { type: Number, default: 5, min: 0, max: 100 },
      romantic: { type: Number, default: 30, min: 0, max: 100 },
    },
    emotionalInsights: {
      valence: { type: Number, default: 60, min: 0, max: 100 },
      arousal: { type: Number, default: 50, min: 0, max: 100 },
      stability: { type: Number, default: 70, min: 0, max: 100 },
    },
    relationship: {
      level: { type: Number, default: 1, min: 1, max: 10 },
      affectionScore: { type: Number, default: 35, min: 0, max: 100 },
      trustScore: { type: Number, default: 40, min: 0, max: 100 },
      affectionStreak: { type: Number, default: 0, min: 0 },
    },
    emotionHistory: [
      {
        dominantEmotion: { type: String },
        valence: { type: Number },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Conversation", conversationSchema);
