"use client";

import { useEffect, useState } from "react";
import {
  CreditCard,
  Zap,
  Check,
  ArrowRight,
  Sparkles,
  Terminal,
  Loader2,
  Clock,
  ShieldCheck,
  AlertCircle,
  Receipt,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { axiosAPI } from "@/lib/axiosInterface";
import {
  loadRazorpayScript,
  RazorpayOptions,
  RazorpaySuccessResponse,
  RazorpayFailureResponse,
} from "@/lib/razorpay";
import toast from "react-hot-toast";

interface PlanItem {
  id: "free" | "pro" | "elite";
  name: string;
  price: string;
  priceSub: string;
  period: string;
  description: string;
  features: string[];
  highlighted?: boolean;
}

const UI_PLANS: PlanItem[] = [
  {
    id: "free",
    name: "Free",
    price: "₹0",
    priceSub: "$0",
    period: "/month",
    description: "Essential telemetry for job application workflow testing.",
    features: [
      "1 manual resume creation / day",
      "1 One-Click generation / 3 days",
      "Standard ATS LaTeX compilation",
      "Standard queue processing",
    ],
    highlighted: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: "₹299",
    priceSub: "$3.50",
    period: "/month",
    description: "Autonomous pipeline power for active market job seekers.",
    features: [
      "10 manual resume creations / day",
      "5 One-Click applications / day",
      "2 Job Autopilot autonomous runs / day",
      "Priority background task scheduler",
      "High-speed LaTeX compilation",
    ],
    highlighted: true,
  },
  {
    id: "elite",
    name: "Elite",
    price: "₹1,299",
    priceSub: "$15",
    period: "/month",
    description: "Maximum bandwidth for high-frequency outreach and power users.",
    features: [
      "100 manual resume creations / day",
      "100 One-Click applications / day",
      "10 Job Autopilot runs / day",
      "Dedicated LLM throughput capacity",
      "Priority feature access & direct support",
    ],
    highlighted: false,
  },
];

interface PaymentTransaction {
  id: string;
  orderId: string;
  paymentId: string | null;
  amount: number;
  currency: string;
  status: string;
  plan: string;
  receipt: string | null;
  createdAt: string;
}

export default function BillingPage() {
  const { user, updateUser, refreshUser } = useAuth();
  const [processingPlan, setProcessingPlan] = useState<string | null>(null);
  const [isGatewayConfigured, setIsGatewayConfigured] = useState<boolean | null>(null);
  const [gatewayKeyId, setGatewayKeyId] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);
  const [loadingHistory, setLoadingHistory] = useState<boolean>(true);

  const currentPlan = user?.subscriptionPlan || "free";

  // Fetch gateway status and payment history on mount
  useEffect(() => {
    const fetchConfigAndHistory = async () => {
      try {
        const [configRes, historyRes] = await Promise.allSettled([
          axiosAPI.get("/payment/config"),
          axiosAPI.get("/payment/history"),
        ]);

        if (configRes.status === "fulfilled" && configRes.value.data) {
          setIsGatewayConfigured(configRes.value.data.isConfigured);
          setGatewayKeyId(configRes.value.data.keyId);
        }

        if (historyRes.status === "fulfilled" && historyRes.value.data?.payments) {
          setTransactions(historyRes.value.data.payments);
        }
      } catch (err) {
        console.error("[Billing] Failed to load data:", err);
      } finally {
        setLoadingHistory(false);
      }
    };

    fetchConfigAndHistory();
  }, []);

  const handleSubscribe = async (planId: "pro" | "elite" | "free") => {
    if (planId === "free") return;
    if (processingPlan) return;
    setProcessingPlan(planId);

    try {
      // 1. Load Razorpay SDK checkout script
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        toast.error("Failed to load Razorpay SDK. Please check your internet connection.");
        setProcessingPlan(null);
        return;
      }

      // 2. Request backend to create an order
      const orderToast = toast.loading("Initializing secure payment session...");
      let orderRes;
      try {
        orderRes = await axiosAPI.post("/payment/create-order", { plan: planId });
        toast.dismiss(orderToast);
      } catch (orderErr: unknown) {
        toast.dismiss(orderToast);
        const errorMsg =
          (orderErr as { response?: { data?: { msg?: string } } })?.response?.data?.msg ||
          "Failed to initialize order. Please check Razorpay keys.";
        toast.error(errorMsg, { duration: 5000 });
        setProcessingPlan(null);
        return;
      }

      const { orderId, amount, currency, keyId } = orderRes.data;

      const activeKey = keyId || gatewayKeyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
      if (!activeKey) {
        toast.error("Razorpay Key ID is not configured on server.");
        setProcessingPlan(null);
        return;
      }

      // 3. Configure Razorpay Standard Checkout options
      const options: RazorpayOptions = {
        key: activeKey,
        amount: amount,
        currency: currency || "INR",
        name: "CareerCrew AI",
        description: `Upgrade to ${planId.toUpperCase()} Plan Subscription`,
        order_id: orderId,
        handler: async (response: RazorpaySuccessResponse) => {
          const verifyToast = toast.loading("Verifying transaction signature...");
          try {
            const verifyRes = await axiosAPI.post("/payment/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              plan: planId,
            });

            toast.dismiss(verifyToast);

            if (verifyRes.data?.success) {
              toast.success(
                `🎉 Upgrade confirmed! You are now on the ${planId.toUpperCase()} plan.`,
                { duration: 5000 }
              );

              // Update context state and refresh user profile
              updateUser({
                subscriptionPlan: planId,
                subscriptionExpiresAt: verifyRes.data.expiresAt,
              });
              await refreshUser();

              // Refresh transactions list
              try {
                const refreshedHistory = await axiosAPI.get("/payment/history");
                if (refreshedHistory.data?.payments) {
                  setTransactions(refreshedHistory.data.payments);
                }
              } catch (e) {
                console.error("Could not refresh transactions:", e);
              }
            } else {
              toast.error(verifyRes.data?.msg || "Payment verification failed.");
            }
          } catch (verifyErr: unknown) {
            toast.dismiss(verifyToast);
            const msg =
              (verifyErr as { response?: { data?: { msg?: string } } })?.response?.data?.msg ||
              "Error during payment signature verification.";
            toast.error(msg);
          } finally {
            setProcessingPlan(null);
          }
        },
        prefill: {
          name: user?.fullName || "",
          email: user?.email || "",
        },
        theme: {
          color: "#09090b", // Sleek dark technical aesthetic
        },
        modal: {
          ondismiss: () => {
            setProcessingPlan(null);
            toast("Payment window closed.", { icon: "ℹ️" });
          },
        },
      };

      // 4. Open Razorpay Checkout modal
      const razorpayWindow = window as unknown as {
        Razorpay: new (opts: RazorpayOptions) => {
          open: () => void;
          on: (event: string, callback: (res: RazorpayFailureResponse) => void) => void;
        };
      };

      const rzpInstance = new razorpayWindow.Razorpay(options);

      rzpInstance.on("payment.failed", (failRes: RazorpayFailureResponse) => {
        console.error("[Razorpay Failure]:", failRes.error);
        toast.error(
          failRes.error?.description || "Payment attempt failed. Please try again."
        );
        setProcessingPlan(null);
      });

      rzpInstance.open();
    } catch (err: unknown) {
      console.error("[Billing Error]:", err);
      toast.error("Unexpected error occurred while opening checkout.");
      setProcessingPlan(null);
    }
  };

  const formatExpiryDate = (isoString?: string | null) => {
    if (!isoString) return null;
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return null;
    }
  };

  const expiryDate = formatExpiryDate(user?.subscriptionExpiresAt);

  return (
    <div className="w-full min-h-screen bg-transparent px-6 sm:px-8 lg:px-10 py-8 space-y-6">
      {/* Header */}
      <div className="relative border border-border bg-card p-5 sm:p-6 rounded-none">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-foreground font-mono">
                PLANS & BILLING
              </h1>
              <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 border border-border bg-muted/40 text-muted-foreground">
                RAZORPAY STANDARD GATEWAY
              </span>
            </div>
            <p className="text-muted-foreground text-xs font-mono">
              Transactional subscription settlement via Razorpay. Upgrade or switch tiers anytime.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 border border-border bg-muted/20">
              <span className="font-mono text-xs text-foreground">
                Current plan:{" "}
                <span className="font-bold uppercase text-foreground underline decoration-1 underline-offset-2">
                  {currentPlan}
                </span>
              </span>
            </div>

            {expiryDate && currentPlan !== "free" && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 border border-border bg-background font-mono text-xs text-muted-foreground">
                <Clock className="w-3.5 h-3.5 text-foreground/70" />
                <span>Renews: {expiryDate}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Gateway Configuration Alert (if keys are not set in .env) */}
      {isGatewayConfigured === false && (
        <div className="border border-amber-500/40 bg-amber-500/10 p-4 rounded-none flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <div className="space-y-1 font-mono text-xs text-amber-200/90">
            <p className="font-semibold text-amber-300">
              Razorpay Setup Pending: Add API Keys in backend/.env
            </p>
            <p className="text-amber-200/80 leading-relaxed text-[11px]">
              Set <code className="bg-amber-950/60 px-1 py-0.5 text-amber-300">RAZORPAY_KEY_ID</code> and{" "}
              <code className="bg-amber-950/60 px-1 py-0.5 text-amber-300">RAZORPAY_KEY_SECRET</code> in{" "}
              <code className="bg-amber-950/60 px-1 py-0.5 text-amber-300">backend/.env</code> to test
              or process payments. You can get test keys from your Razorpay Dashboard at{" "}
              <span className="underline">dashboard.razorpay.com/app/keys</span>.
            </p>
          </div>
        </div>
      )}

      {/* Plans grid sharing clean straight borders */}
      <div className="relative border border-border bg-card">
        {/* Top millimeter track */}
        <div
          aria-hidden="true"
          className="h-[2px] w-full border-b border-border/60 bg-muted/20"
          style={{
            backgroundImage:
              "repeating-linear-gradient(to right, var(--border) 0px, var(--border) 1px, transparent 1px, transparent 16px)",
          }}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 divide-x-0 md:divide-x divide-border">
          {UI_PLANS.map((plan) => {
            const isCurrent = currentPlan.toLowerCase() === plan.id;
            const isProcessing = processingPlan === plan.id;

            return (
              <div
                key={plan.name}
                className={cn(
                  "p-8 flex flex-col justify-between transition-colors relative group",
                  plan.highlighted ? "bg-muted/10" : "hover:bg-muted/5",
                  isCurrent && "border-t-2 md:border-t-0 md:border-l-2 border-foreground"
                )}
              >
                {plan.highlighted && (
                  <div className="absolute top-0 right-0 border-l border-b border-border bg-foreground text-background px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-wider font-semibold">
                    RECOMMENDED
                  </div>
                )}

                {/* Plan Header */}
                <div className="space-y-4 mb-6">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground font-semibold">
                        {plan.name}
                      </span>
                      {isCurrent && (
                        <span className="font-mono text-[9px] uppercase tracking-wider px-1.5 py-0.5 border border-border text-foreground bg-background font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                          ACTIVE PLAN
                        </span>
                      )}
                    </div>
                    <div className="flex items-baseline gap-1 mt-2">
                      <span className="font-mono text-4xl font-bold tracking-tight text-foreground">
                        {plan.price}
                      </span>
                      <span className="font-mono text-xs text-muted-foreground">{plan.period}</span>
                      <span className="font-mono text-[10px] text-muted-foreground/70 ml-1.5">
                        ({plan.priceSub})
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed min-h-[32px]">
                    {plan.description}
                  </p>

                  {/* Features List */}
                  <ul className="space-y-2.5 border-t border-border/60 pt-4">
                    {plan.features.map((f) => (
                      <li
                        key={f}
                        className="flex items-start gap-2.5 text-xs text-foreground font-mono"
                      >
                        <span className="text-foreground/60 shrink-0 font-bold">+</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Button */}
                <div>
                  {isCurrent ? (
                    <button
                      disabled
                      className="w-full py-2.5 font-mono text-xs uppercase tracking-wider rounded-none border border-border bg-muted/30 text-muted-foreground cursor-not-allowed select-none flex items-center justify-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5 text-emerald-500" /> Current Plan
                    </button>
                  ) : plan.id === "free" ? (
                    <button
                      disabled
                      className="w-full py-2.5 border border-border bg-card/60 text-muted-foreground font-mono text-xs uppercase tracking-wider rounded-none cursor-not-allowed"
                    >
                      Standard Tier
                    </button>
                  ) : (
                    <button
                      onClick={() => handleSubscribe(plan.id)}
                      disabled={processingPlan !== null}
                      className={cn(
                        "w-full py-2.5 font-mono text-xs uppercase tracking-wider font-semibold rounded-none flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
                        plan.highlighted
                          ? "bg-foreground text-background hover:bg-foreground/90"
                          : "border border-border bg-card hover:bg-muted text-foreground"
                      )}
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          Processing Order...
                        </>
                      ) : (
                        <>
                          Upgrade to {plan.name} <ArrowRight size={13} />
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Transaction & Payment History */}
      <div className="border border-border bg-card p-6 rounded-none space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <Receipt className="w-4 h-4 text-foreground/80" />
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-foreground">
              Billing & Transaction History
            </h3>
          </div>
          <span className="font-mono text-[10px] text-muted-foreground">
            {transactions.length} record{transactions.length === 1 ? "" : "s"}
          </span>
        </div>

        {loadingHistory ? (
          <div className="py-8 flex items-center justify-center gap-2 text-muted-foreground font-mono text-xs">
            <Loader2 className="w-4 h-4 animate-spin" /> Loading transactions...
          </div>
        ) : transactions.length === 0 ? (
          <div className="py-6 text-center space-y-1">
            <p className="font-mono text-xs text-muted-foreground">
              No transactions recorded yet.
            </p>
            <p className="font-mono text-[11px] text-muted-foreground/60">
              When you upgrade via Razorpay, your payment receipts and invoice records will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs border-collapse">
              <thead>
                <tr className="border-b border-border text-muted-foreground text-[10px] uppercase tracking-wider bg-muted/10">
                  <th className="py-2 px-3">Date</th>
                  <th className="py-2 px-3">Order ID</th>
                  <th className="py-2 px-3">Payment ID</th>
                  <th className="py-2 px-3">Plan</th>
                  <th className="py-2 px-3">Amount</th>
                  <th className="py-2 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-muted/5 transition-colors">
                    <td className="py-2.5 px-3 text-muted-foreground text-[11px]">
                      {new Date(tx.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-2.5 px-3 text-foreground font-mono text-[11px]">
                      {tx.orderId}
                    </td>
                    <td className="py-2.5 px-3 text-muted-foreground font-mono text-[11px]">
                      {tx.paymentId || "—"}
                    </td>
                    <td className="py-2.5 px-3 uppercase text-foreground font-semibold">
                      {tx.plan}
                    </td>
                    <td className="py-2.5 px-3 text-foreground font-semibold">
                      ₹{(tx.amount / 100).toFixed(2)}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <span
                        className={cn(
                          "px-2 py-0.5 text-[9px] uppercase tracking-wider font-semibold border",
                          tx.status === "captured"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                            : tx.status === "failed"
                            ? "bg-rose-500/10 text-rose-400 border-rose-500/30"
                            : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                        )}
                      >
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Subscription Policies & Gateway Architecture Details */}
      <div className="border border-border bg-card p-6 rounded-none space-y-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-foreground/80" />
          <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-foreground">
            Billing & Razorpay Integration Specifications
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-muted-foreground font-mono">
          <p>
            &bull; <strong className="text-foreground">Standard Checkout:</strong> End-to-end PCI-DSS compliant
            modal using Razorpay standard web checkout with UPI, Credit/Debit Cards, NetBanking, and Wallets.
          </p>
          <p>
            &bull; <strong className="text-foreground">Signature Verification:</strong> Every payment response is
            cryptographically validated on the server using HMAC-SHA256 digests before plan upgrades.
          </p>
          <p>
            &bull; <strong className="text-foreground">Webhooks Redundancy:</strong> Server webhook listener
            synchronizes asynchronous settlement even if client browser tabs close mid-transaction.
          </p>
          <p>
            &bull; <strong className="text-foreground">Enterprise Support:</strong> Custom invoice requirements or
            volume team seats can contact operations directly via support@careercrew.ai.
          </p>
        </div>
      </div>
    </div>
  );
}
