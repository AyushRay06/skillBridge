/**
 * Subscription Plans Configuration
 * Single source of truth for pricing, billing intervals, and features.
 * Razorpay amounts are represented in the smallest currency subunit (paisa for INR).
 * e.g., ₹299 = 29900 paise.
 */

export const SUBSCRIPTION_PLANS = {
  free: {
    id: "free",
    name: "Free",
    amount: 0,
    currency: "INR",
    priceDisplay: "₹0",
    priceUsdDisplay: "$0",
    period: "/month",
    description: "Essential telemetry for job application workflow testing.",
    durationDays: null,
    features: [
      "1 manual resume creation / day",
      "1 One-Click generation / 3 days",
      "Standard ATS LaTeX compilation",
      "Standard support",
    ],
  },
  pro: {
    id: "pro",
    name: "Pro",
    amount: 29900, // ₹299 = ~3.5 USD
    currency: "INR",
    priceDisplay: "₹299",
    priceUsdDisplay: "$3.50",
    period: "/month",
    description: "Autonomous pipeline power for active market job seekers.",
    durationDays: 30,
    features: [
      "10 manual resume creations / day",
      "5 One-Click applications / day",
      "2 Job Autopilot autonomous runs / day",
      "Priority background task queue",
      "High-speed LaTeX rendering",
    ],
  },
  elite: {
    id: "elite",
    name: "Elite",
    amount: 129900, // ₹1,299 = ~15 USD
    currency: "INR",
    priceDisplay: "₹1,299",
    priceUsdDisplay: "$15",
    period: "/month",
    description: "Maximum bandwidth for high-frequency outreach and power users.",
    durationDays: 30,
    features: [
      "100 manual resume creations / day",
      "100 One-Click applications / day",
      "10 Job Autopilot runs / day",
      "Dedicated LLM throughput",
      "Priority feature access & direct support",
    ],
  },
};
