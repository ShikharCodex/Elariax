const mongoose = require("mongoose");

const memorySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    userName: { type: String, required: true, trim: true },
    preferences: [{ type: String, trim: true }],
    importantFacts: [{ type: String, trim: true }],
    memoryCards: [
      {
        title: { type: String, trim: true },
        detail: { type: String, trim: true },
        category: { type: String, enum: ["event", "preference", "goal", "moment"], default: "moment" },
        pinned: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Memory", memorySchema);
