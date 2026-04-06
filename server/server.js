require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");
const authMiddleware = require("./middleware/authMiddleware");
const chatRoutes = require("./routes/chatRoutes");
const settingsRoutes = require("./routes/settingsRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));
app.use(authMiddleware);

app.get("/api/health", (req, res) => res.json({ success: true, message: "API is healthy." }));
app.use("/api/chat", chatRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/auth", authRoutes);
app.use(errorHandler);

const bootstrap = async () => {
  if (!process.env.MONGODB_URI || !process.env.GEMINI_API_KEY || !process.env.JWT_SECRET) {
    throw new Error("Missing required env vars: MONGODB_URI, GEMINI_API_KEY, JWT_SECRET");
  }

  await connectDB(process.env.MONGODB_URI);
  app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
};

bootstrap().catch((error) => {
  console.error("Server startup failed:", error);
  process.exit(1);
});
