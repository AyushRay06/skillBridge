import prisma from "../lib/prisma.js";
import {
  getRazorpayInstance,
  isRazorpayConfigured,
  verifyPaymentSignature,
  verifyWebhookSignature,
} from "../lib/razorpay.js";
import { SUBSCRIPTION_PLANS } from "../config/plans.config.js";

/**
 * GET /api/payment/config
 * Returns public configuration, including available plans and Razorpay Key ID
 */
export const getPaymentConfig = async (req, res) => {
  try {
    const isConfigured = isRazorpayConfigured();
    const keyId = process.env.RAZORPAY_KEY_ID || null;

    res.status(200).json({
      isConfigured,
      keyId,
      plans: SUBSCRIPTION_PLANS,
      currency: "INR",
    });
  } catch (error) {
    console.error("[Payment] Error in getPaymentConfig:", error.message);
    res.status(500).json({ msg: "Internal server error" });
  }
};

/**
 * POST /api/payment/create-order
 * Creates a Razorpay Order and saves a pending Payment entry in the database
 */
export const createOrder = async (req, res) => {
  try {
    const { plan } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ msg: "Unauthorized" });
    }

    if (!isRazorpayConfigured()) {
      return res.status(503).json({
        msg: "Razorpay payment gateway is not configured. Please add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to the server environment.",
      });
    }

    const planConfig = SUBSCRIPTION_PLANS[plan?.toLowerCase()];
    if (!planConfig || planConfig.amount <= 0) {
      return res.status(400).json({ msg: "Invalid subscription plan selected." });
    }

    const razorpay = getRazorpayInstance();
    if (!razorpay) {
      return res.status(500).json({ msg: "Failed to initialize payment gateway." });
    }

    // Razorpay receipt ID has a max limit of 40 characters
    const shortUserId = userId.replace(/[^a-zA-Z0-9]/g, "").slice(-6);
    const receipt = `rcpt_${shortUserId}_${Date.now()}`.slice(0, 40);

    const orderOptions = {
      amount: planConfig.amount, // in paise
      currency: planConfig.currency || "INR",
      receipt: receipt,
      notes: {
        userId: userId,
        plan: planConfig.id,
        userEmail: req.user.email || "",
      },
    };

    const razorpayOrder = await razorpay.orders.create(orderOptions);

    // Save pending payment record to database for audit and reconciliation
    const paymentRecord = await prisma.payment.create({
      data: {
        orderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        status: "created",
        plan: planConfig.id,
        receipt: receipt,
        notes: orderOptions.notes,
        userId: userId,
      },
    });

    res.status(200).json({
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
      receipt: receipt,
      plan: planConfig,
      paymentRecordId: paymentRecord.id,
    });
  } catch (error) {
    console.error("[Payment] Error in createOrder:", error);
    res.status(500).json({
      msg: error?.error?.description || error.message || "Failed to create payment order.",
    });
  }
};

/**
 * POST /api/payment/verify
 * Validates the HMAC signature returned by Razorpay Checkout and upgrades user plan
 */
export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      plan,
    } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ msg: "Unauthorized" });
    }

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ msg: "Missing payment verification parameters." });
    }

    // Verify cryptographic signature
    const isValid = verifyPaymentSignature({
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
    });

    if (!isValid) {
      // Mark payment as failed if record exists
      await prisma.payment.updateMany({
        where: { orderId: razorpay_order_id },
        data: {
          status: "failed",
          paymentId: razorpay_payment_id,
          signature: razorpay_signature,
        },
      });

      return res.status(400).json({
        success: false,
        msg: "Payment verification failed. Tampered or invalid signature.",
      });
    }

    // Determine target plan
    const selectedPlan = plan?.toLowerCase() || "pro";
    const planConfig = SUBSCRIPTION_PLANS[selectedPlan] || SUBSCRIPTION_PLANS.pro;

    // Calculate subscription validity (30 days from now)
    const durationDays = planConfig.durationDays || 30;
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + durationDays);

    // Update payment record to captured
    await prisma.payment.updateMany({
      where: { orderId: razorpay_order_id },
      data: {
        paymentId: razorpay_payment_id,
        signature: razorpay_signature,
        status: "captured",
        plan: planConfig.id,
      },
    });

    // Update user subscription plan and expiration
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        subscriptionPlan: planConfig.id,
        subscriptionExpiresAt: expiresAt,
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        subscriptionPlan: true,
        subscriptionExpiresAt: true,
      },
    });

    res.status(200).json({
      success: true,
      msg: `Payment successful! Welcome to CareerCrew AI ${planConfig.name}.`,
      user: updatedUser,
      plan: planConfig.id,
      expiresAt: expiresAt.toISOString(),
    });
  } catch (error) {
    console.error("[Payment] Error in verifyPayment:", error.message);
    res.status(500).json({ msg: "Internal server error during verification" });
  }
};

/**
 * POST /api/payment/webhook
 * Handles asynchronous server-to-server Razorpay webhooks (e.g. order.paid, payment.captured)
 */
export const handleWebhook = async (req, res) => {
  try {
    const webhookSignature = req.headers["x-razorpay-signature"];
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.warn("[Payment Webhook] RAZORPAY_WEBHOOK_SECRET not set, skipping webhook validation.");
      return res.status(200).json({ status: "ignored_no_secret" });
    }

    const rawBody = req.rawBody || JSON.stringify(req.body);
    const isValid = verifyWebhookSignature(rawBody, webhookSignature, webhookSecret);

    if (!isValid) {
      console.error("[Payment Webhook] Invalid webhook signature detected.");
      return res.status(400).json({ msg: "Invalid webhook signature" });
    }

    const event = req.body.event;
    const payload = req.body.payload;

    console.log(`[Payment Webhook] Processing event: ${event}`);

    if (event === "order.paid" || event === "payment.captured") {
      const paymentEntity = payload.payment?.entity;
      const orderEntity = payload.order?.entity;

      const orderId = orderEntity?.id || paymentEntity?.order_id;
      const paymentId = paymentEntity?.id;
      const notes = orderEntity?.notes || paymentEntity?.notes || {};
      const userId = notes.userId;
      const plan = notes.plan || "pro";

      if (orderId) {
        // Update payment record in database
        await prisma.payment.updateMany({
          where: { orderId: orderId },
          data: {
            paymentId: paymentId,
            status: "captured",
          },
        });
      }

      if (userId && plan) {
        const planConfig = SUBSCRIPTION_PLANS[plan] || SUBSCRIPTION_PLANS.pro;
        const durationDays = planConfig.durationDays || 30;
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + durationDays);

        await prisma.user.update({
          where: { id: userId },
          data: {
            subscriptionPlan: planConfig.id,
            subscriptionExpiresAt: expiresAt,
          },
        });
        console.log(`[Payment Webhook] Successfully activated ${planConfig.id} for user ${userId}`);
      }
    } else if (event === "payment.failed") {
      const paymentEntity = payload.payment?.entity;
      const orderId = paymentEntity?.order_id;

      if (orderId) {
        await prisma.payment.updateMany({
          where: { orderId: orderId },
          data: {
            paymentId: paymentEntity?.id,
            status: "failed",
          },
        });
      }
    }

    res.status(200).json({ status: "success" });
  } catch (error) {
    console.error("[Payment Webhook] Error processing webhook:", error.message);
    res.status(500).json({ msg: "Internal server error" });
  }
};

/**
 * GET /api/payment/history
 * Returns the payment history and past transactions for the logged-in user
 */
export const getPaymentHistory = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ msg: "Unauthorized" });
    }

    const payments = await prisma.payment.findMany({
      where: { userId: userId },
      orderBy: { createdAt: "desc" },
      take: 20,
      select: {
        id: true,
        orderId: true,
        paymentId: true,
        amount: true,
        currency: true,
        status: true,
        plan: true,
        receipt: true,
        createdAt: true,
      },
    });

    res.status(200).json({ payments });
  } catch (error) {
    console.error("[Payment] Error in getPaymentHistory:", error.message);
    res.status(500).json({ msg: "Internal server error" });
  }
};
