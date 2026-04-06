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
// ✅ CORS CONFIG (BULLETPROOF)
// =======================

const allowedOrigins = [
  "http://localhost:5173",
  "https://elariax.vercel.app",
];

const corsOptions = {
  origin: function (origin, callback) {
    console.log("Incoming Origin:", origin); // 🔍 debug

    // allow requests with no origin (Postman, mobile apps)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

// Apply CORS FIRST
app.use(cors(corsOptions));

// // Handle preflight requests using SAME config
// app.options("*", cors(corsOptions));


// =======================
// ✅ MIDDLEWARE
// =======================

app.use(helmet());
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));


// =======================
// ✅ ROUTES
// =======================

// Public routes (NO AUTH)
app.use("/api/auth", authRoutes);

// 🔥 IMPORTANT: Protect only after auth routes
app.use(authMiddleware);

// Protected routes
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
      "Missing required env vars: MONGODB_URI, GEMINI_API_KEY, JWT_SECRET"
    );
  }

  await connectDB(process.env.MONGODB_URI);

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
};

bootstrap().catch((error) => {
  console.error("❌ Server startup failed:", error);
  process.exit(1);
});