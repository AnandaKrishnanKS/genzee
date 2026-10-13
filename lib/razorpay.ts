import Razorpay from "razorpay";
import crypto from "crypto";

const keyId = process.env.RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;

const razorpay: Razorpay | null =
  keyId && keySecret
    ? new Razorpay({
        key_id: keyId,
        key_secret: keySecret,
      })
    : null;

export { razorpay };

export async function createOrder(amountPaise: number, receipt: string) {
  if (!razorpay) {
    throw new Error("Razorpay credentials not configured");
  }
  return razorpay.orders.create({
    amount: amountPaise,
    currency: "INR",
    receipt,
  });
}

export function verifyPaymentSignature({
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature,
}: {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}): boolean {
  if (!keySecret) return false;
  const body = `${razorpayOrderId}|${razorpayPaymentId}`;
  const expectedSignature = crypto
    .createHmac("sha256", keySecret)
    .update(body)
    .digest("hex");
  return expectedSignature === razorpaySignature;
}

export function verifyWebhookSignature(
  payload: string,
  signature: string
): boolean {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) return false;
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");
  return expectedSignature === signature;
}
