import Razorpay from "razorpay";
import crypto from "crypto";

let razorpayInstance = null;

/**
 * Get or initialize the Razorpay client instance
 */
export const getRazorpayInstance = () => {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    return null;
  }

  if (!razorpayInstance) {
    razorpayInstance = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });
  }

  return razorpayInstance;
};

/**
 * Helper to check if Razorpay keys are configured
 */
export const isRazorpayConfigured = () => {
  return Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);
};

/**
 * Verify Razorpay payment signature
 * Form: HMAC-SHA256 of (order_id + "|" + razorpay_payment_id) using key_secret
 *
 * @param {Object} params
 * @param {string} params.orderId - Razorpay order ID
 * @param {string} params.paymentId - Razorpay payment ID
 * @param {string} params.signature - Razorpay signature received from client
 * @returns {boolean}
 */
export const verifyPaymentSignature = ({ orderId, paymentId, signature }) => {
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret || !orderId || !paymentId || !signature) {
    return false;
  }

  const generatedSignature = crypto
    .createHmac("sha256", keySecret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  return generatedSignature === signature;
};

/**
 * Verify Razorpay webhook signature
 * Form: HMAC-SHA256 of the raw body payload using webhook secret
 *
 * @param {string} rawBody - Raw unparsed webhook request body
 * @param {string} webhookSignature - Header 'x-razorpay-signature'
 * @param {string} [secret] - Webhook secret override (defaults to env)
 * @returns {boolean}
 */
export const verifyWebhookSignature = (
  rawBody,
  webhookSignature,
  secret = process.env.RAZORPAY_WEBHOOK_SECRET
) => {
  if (!secret || !webhookSignature || !rawBody) {
    return false;
  }

  const generatedSignature = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");

  return generatedSignature === webhookSignature;
};
