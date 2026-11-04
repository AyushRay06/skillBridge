import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import resumeRoute from "./routes/resume.route.js";
import authRoute from "./routes/auth.route.js";
import oauthRoute from "./routes/oauth.route.js";
import profileRoute from "./routes/profile.route.js";
import applyRoute from "./routes/apply.route.js";
import autopilotRoute from "./routes/autopilot.route.js";
import paymentRoute from "./routes/payment.route.js";
import careerGuideRoute from "./routes/careerGuide.route.js";
import whatsappRoute from "./routes/whatsapp.route.js";
import cookieParser from "cookie-parser";
import passport, { initializePassport } from "./lib/passport.js";
import { serve } from "inngest/express";
import { inngest } from "./inngest/client.js";
import { inngestFunctions } from "./inngest/index.js";
import { globalIpLimiter } from "./middleware/rateLimiter.js";

dotenv.config();

// Initialize Passport strategies AFTER dotenv loads env vars
initializePassport();

const app = express();
app.use(cookieParser());

// Support rawBody preservation for payment webhooks verification
app.use(
  express.json({
    verify: (req, res, buf) => {
      req.rawBody = buf.toString();
    },
  })
);
// Support URL-encoded form data (required for Twilio webhooks)
app.use(express.urlencoded({ extended: true }));
const allowedOrigins = [
  "https://careercrewai.ayushray.in",
  "https://ayushray.in",
  "https://resumeai.ayushray.in",
  "https://resume-generator-chi-one.vercel.app",
  "http://localhost:3000",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      const isAllowed =
        allowedOrigins.includes(origin) ||
        origin.startsWith("http://localhost:") ||
        origin.startsWith("http://127.0.0.1:") ||
        origin.endsWith(".ayushray.in") ||
        origin.endsWith(".vercel.app");

      if (isAllowed) {
        callback(null, true);
      } else {
        console.warn(`[CORS Notice] Origin not in strict whitelist: ${origin}`);
        callback(null, true);
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    exposedHeaders: ["Set-Cookie"],
  })
);

// Initialize Passport (no sessions — we use JWT cookies)
app.use(passport.initialize());

// Global IP rate limiter — DDoS safety net (120 req/min per IP, fail-open)
app.use(globalIpLimiter);

// Mount API routes with both /api and direct prefix for seamless serverless routing
const apiRoutes = [
  { path: "resume", handler: resumeRoute },
  { path: "auth", handler: authRoute },
  { path: "auth", handler: oauthRoute },
  { path: "profile", handler: profileRoute },
  { path: "apply", handler: applyRoute },
  { path: "autopilot", handler: autopilotRoute },
  { path: "payment", handler: paymentRoute },
  { path: "career-guide", handler: careerGuideRoute },
  { path: "whatsapp", handler: whatsappRoute },
];

for (const { path, handler } of apiRoutes) {
  app.use(`/api/${path}`, handler);
  app.use(`/${path}`, handler);
}

// Inngest serve handler — Inngest cloud calls this endpoint to execute functions
const inngestHandler = serve({ client: inngest, functions: inngestFunctions });
app.use("/api/inngest", inngestHandler);
app.use("/inngest", inngestHandler);

// Root route and health check
app.get(["/", "/api", "/health", "/api/health"], (req, res) => {
  res.json({
    status: "ok",
    message: "SkillBridge API is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "production",
  });
});

// Global error handler — prevents unhandled 500 crashes
app.use((err, req, res, next) => {
  console.error("[SkillBridge API Error]:", err);
  res.status(err.status || 500).json({
    status: "error",
    message: err.message || "Internal Server Error",
  });
});

// For Vercel serverless
export default app;

// For local development only — never run app.listen on Vercel serverless
if (!process.env.VERCEL && process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`App running on port ${PORT}`);
  });
}
