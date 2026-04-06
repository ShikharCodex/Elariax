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

// =======================
// ✅ CORS CONFIG (IMPORTANT)
// =======================

const allowedOrigins = [
  "http://localhost:5173", // local dev
  "https://elariax.vercel.app", // production frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps, curl)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // if using cookies/auth headers
  }),
);

// Handle preflight requests
app.options("*", cors());

// =======================
// ✅ MIDDLEWARE
// =======================

app.use(helmet());
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

// =======================
// ✅ ROUTES (ORDER MATTERS)
// =======================

// Public routes (NO AUTH)
app.use("/api/auth", authRoutes);

// Protected routes (AUTH REQUIRED)
app.use(authMiddleware);

app.use("/api/chat", chatRoutes);
app.use("/api/settings", settingsRoutes);

// =======================
// ✅ HEALTH CHECK
// =======================

app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "API is healthy." });
});

// =======================
// ✅ ERROR HANDLER
// =======================

app.use(errorHandler);

// =======================
// ✅ SERVER START
// =======================

const bootstrap = async () => {
  if (
    !process.env.MONGODB_URI ||
    !process.env.GEMINI_API_KEY ||
    !process.env.JWT_SECRET
  ) {
    throw new Error(
      "Missing required env vars: MONGODB_URI, GEMINI_API_KEY, JWT_SECRET",
    );
  }

  await connectDB(process.env.MONGODB_URI);

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

bootstrap().catch((error) => {
  console.error("Server startup failed:", error);
  process.exit(1);
});
