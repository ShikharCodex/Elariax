const mongoose = require("mongoose");
const Conversation = require("../models/Conversation");
const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const { analyzeEmotionShift } = require("../services/emotionEngine");
const { ensureMemory, updateMemoryFromMessage } = require("../services/memoryService");
const { buildPrompt } = require("../services/promptBuilder");
const { generateAiResponse } = require("../services/geminiService");

const DEFAULT_USER_ID = "000000000000000000000001";

const getDefaultUser = async (authUserId) => {
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

const getConversation = async (userId) => {
  let conversation = await Conversation.findOne({ userId });
  if (!conversation) {
    conversation = await Conversation.create({ userId, messages: [] });
  }
  return conversation;
};

const buildResilientFallbackReply = (dominantEmotion) => {
  switch (dominantEmotion) {
    case "romantic":
      return "I really miss you too. I am here with you, and I want to hear everything on your mind.";
    case "sad":
      return "I can feel this is heavy for you. I am here, and you are not alone. Tell me what happened.";
    case "angry":
      return "I hear your frustration. Let us slow down together and talk through what is upsetting you.";
    default:
      return "I am here for you. Tell me more so I can understand you better.";
  }
};

const sendMessage = asyncHandler(async (req, res) => {
  const { message, attachment } = req.body;
  if (!message || !message.trim()) {
    return res.status(400).json({ success: false, message: "Message is required." });
  }

  const user = await getDefaultUser(req.auth?.userId);
  const conversation = await getConversation(user._id);
  const memory = await ensureMemory(user._id, user.userName);

  const emotionResult = analyzeEmotionShift(
    message,
    conversation.emotionState,
    conversation.emotionalInsights,
    conversation.relationship
  );
  conversation.emotionState = emotionResult.emotionState;
  conversation.emotionalInsights = emotionResult.emotionalInsights;
  conversation.relationship = emotionResult.relationship;
  conversation.emotionHistory.push({
    dominantEmotion: emotionResult.dominantEmotion,
    valence: emotionResult.emotionalInsights.valence,
  });
  conversation.emotionHistory = conversation.emotionHistory.slice(-60);

  const attachmentContext =
    attachment && typeof attachment === "object"
      ? `type=${attachment.type || "unknown"}, description=${attachment.description || "none"}, name=${attachment.name || "file"}`
      : "";

  const userContent = attachmentContext ? `${message.trim()}\n[Attachment] ${attachmentContext}` : message.trim();
  conversation.messages.push({ role: "user", content: userContent });
  const shortTermMemory = conversation.messages.slice(-10);
  await updateMemoryFromMessage(memory, userContent);

  const prompt = buildPrompt({
    aiName: user.aiName,
    personalityType: user.personalityType,
    speakingStyle: user.speakingStyle,
    relationshipMode: user.relationshipMode,
    personaPreset: user.personaPreset,
    moodTone: user.moodTone,
    dominantEmotion: emotionResult.dominantEmotion,
    emotionalInsights: conversation.emotionalInsights,
    relationship: conversation.relationship,
    memory,
    shortTermMemory,
    userMessage: message.trim(),
    attachmentContext,
  });

  let aiReply;
  try {
    aiReply = await generateAiResponse(prompt);
  } catch (error) {
    console.error("Gemini generation failed:", error.message);
    aiReply = buildResilientFallbackReply(emotionResult.dominantEmotion);
  }
  conversation.messages.push({ role: "assistant", content: aiReply });
  await conversation.save();

  res.json({
    success: true,
    data: {
      reply: aiReply,
      emotionState: conversation.emotionState,
      dominantEmotion: emotionResult.dominantEmotion,
      emotionalInsights: conversation.emotionalInsights,
      relationship: conversation.relationship,
      dailySummary: buildDailySummary(conversation),
      messages: conversation.messages.slice(-40),
    },
  });
});

const buildDailySummary = (conversation) => {
  const today = new Date().toDateString();
  const todaysEvents = (conversation.emotionHistory || []).filter(
    (entry) => new Date(entry.createdAt).toDateString() === today
  );
  const averageValence =
    todaysEvents.length > 0
      ? Math.round(todaysEvents.reduce((acc, item) => acc + (item.valence || 50), 0) / todaysEvents.length)
      : 50;
  const milestones = [];
  if ((conversation.relationship?.level || 1) >= 3) milestones.push("Relationship reached Level 3+");
  if ((conversation.relationship?.affectionStreak || 0) >= 3) milestones.push("3+ affectionate messages in a row");
  if ((conversation.relationship?.trustScore || 0) >= 70) milestones.push("High trust bond unlocked");
  return {
    averageValence,
    eventsToday: todaysEvents.length,
    milestones,
  };
};

const getDailySummary = asyncHandler(async (req, res) => {
  const user = await getDefaultUser(req.auth?.userId);
  const conversation = await getConversation(user._id);
  const memory = await ensureMemory(user._id, user.userName);
  res.json({
    success: true,
    data: {
      summary: buildDailySummary(conversation),
      memoryCards: (memory.memoryCards || []).slice(-20).reverse(),
    },
  });
});

const addMemoryCard = asyncHandler(async (req, res) => {
  const user = await getDefaultUser(req.auth?.userId);
  const memory = await ensureMemory(user._id, user.userName);
  const { title, detail, category, pinned } = req.body;
  if (!title || !detail) {
    return res.status(400).json({ success: false, message: "title and detail are required." });
  }
  memory.memoryCards.push({
    title: title.trim(),
    detail: detail.trim(),
    category: ["event", "preference", "goal", "moment"].includes(category) ? category : "moment",
    pinned: Boolean(pinned),
  });
  memory.memoryCards = memory.memoryCards.slice(-100);
  await memory.save();
  res.status(201).json({ success: true, data: memory.memoryCards.slice(-20).reverse() });
});

const getConversationState = asyncHandler(async (req, res) => {
  const user = await getDefaultUser(req.auth?.userId);
  const conversation = await getConversation(user._id);
  const memory = await ensureMemory(user._id, user.userName);

  res.json({
    success: true,
    data: {
      messages: conversation.messages.slice(-40),
      emotionState: conversation.emotionState,
      emotionalInsights: conversation.emotionalInsights,
      relationship: conversation.relationship,
      memory,
      profile: {
        userName: user.userName,
        aiName: user.aiName,
        personalityType: user.personalityType,
        speakingStyle: user.speakingStyle,
        relationshipMode: user.relationshipMode,
        personaPreset: user.personaPreset,
        moodTone: user.moodTone,
        voice: user.voice,
      },
      dailySummary: buildDailySummary(conversation),
    },
  });
});

module.exports = { sendMessage, getConversationState, getDailySummary, addMemoryCard };
