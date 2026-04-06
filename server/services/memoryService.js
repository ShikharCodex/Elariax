const Memory = require("../models/Memory");

const ensureMemory = async (userId, userName) => {
  let memory = await Memory.findOne({ userId });
  if (!memory) {
    memory = await Memory.create({ userId, userName, preferences: [], importantFacts: [], memoryCards: [] });
  }
  return memory;
};

const extractFacts = (message) => {
  const normalized = message.trim();
  const facts = [];
  if (normalized.toLowerCase().includes("my name is")) facts.push(normalized);
  if (normalized.toLowerCase().includes("i like")) facts.push(normalized);
  if (normalized.toLowerCase().includes("i love")) facts.push(normalized);
  return facts;
};

const updateMemoryFromMessage = async (memory, message) => {
  const lower = message.toLowerCase();
  if (lower.includes("i like") || lower.includes("i love")) {
    memory.preferences = Array.from(new Set([...memory.preferences, message])).slice(-20);
  }

  const facts = extractFacts(message);
  if (facts.length) {
    memory.importantFacts = Array.from(new Set([...memory.importantFacts, ...facts])).slice(-50);
  }

  if (lower.includes("birthday") || lower.includes("anniversary") || lower.includes("goal")) {
    memory.memoryCards.push({
      title: "Captured important moment",
      detail: message,
      category: lower.includes("goal") ? "goal" : "event",
      pinned: lower.includes("birthday") || lower.includes("anniversary"),
    });
    memory.memoryCards = memory.memoryCards.slice(-100);
  }

  await memory.save();
  return memory;
};

module.exports = { ensureMemory, updateMemoryFromMessage };
