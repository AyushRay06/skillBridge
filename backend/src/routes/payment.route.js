import express from "express";
import {
  getPaymentConfig,
  createOrder,
  verifyPayment,
  handleWebhook,
  getPaymentHistory,
} from "../controller/payment.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// Public: Get Razorpay key & plan options
router.get("/config", getPaymentConfig);

// Protected: Initialize Razorpay Order
router.post("/create-order", protectRoute, createOrder);

// Protected: Verify Payment Signature & Upgrade Plan
router.post("/verify", protectRoute, verifyPayment);

// Public / Server-to-server: Razorpay Webhook listener
router.post("/webhook", handleWebhook);

// Protected: View user's billing / payment history
router.get("/history", protectRoute, getPaymentHistory);

export default router;
