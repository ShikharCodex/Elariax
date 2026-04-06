const express = require("express");
const { sendMessage, getConversationState, getDailySummary, addMemoryCard } = require("../controllers/chatController");

const router = express.Router();

router.get("/state", getConversationState);
router.get("/summary", getDailySummary);
router.post("/message", sendMessage);
router.post("/memory-cards", addMemoryCard);

module.exports = router;
