"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { SubscriptionInfo } from "@/types";
import { formatINR } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, ShieldCheck, Zap, AlertCircle, CreditCard } from "lucide-react";

export default function BillingPage() {
  const queryClient = useQueryClient();
  const [billingInterval, setBillingInterval] = useState<"MONTHLY" | "ANNUAL">("MONTHLY");
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const { data: subData, isLoading } = useQuery<SubscriptionInfo>({
    queryKey: ["currentSubscription"],
    queryFn: () => apiClient.get("/subscriptions/current"),
  });

  const { data: plansData } = useQuery<any>({
    queryKey: ["subscriptionPlans"],
    queryFn: () => apiClient.get("/subscriptions/plans"),
  });

  const checkoutMutation = useMutation({
    mutationFn: async (planCode: string) => {
      // 1. Create order
      const orderRes = await apiClient.post<any>("/subscriptions/checkout", {
        plan_code: planCode,
        billing_interval: billingInterval,
      });

      // 2. Mock payment signature verification (in sandbox/dev)
      const verifyRes = await apiClient.post<any>("/subscriptions/verify-payment", {
        plan_code: planCode,
        billing_interval: billingInterval,
        razorpay_order_id: orderRes.order_id,
        razorpay_payment_id: `pay_${Date.now()}`,
        razorpay_signature: "mock_signature_dev_approved",
      });

      return verifyRes;
    },
    onSuccess: (data: any) => {
      setSuccessMsg(data?.message || "Subscription activated successfully!");
      queryClient.invalidateQueries({ queryKey: ["currentSubscription"] });
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#202B28] tracking-tight">Subscription & Billing</h1>
          <p className="text-xs text-[#66736F]">Manage SaaS plan, employee seat limits and Razorpay invoices</p>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 bg-[#EBF4EF] border border-[#3B7A57]/30 rounded-xl flex items-center gap-2 text-xs text-[#3B7A57]">
          <CheckCircle2 className="w-4 h-4 text-[#3B7A57] shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Current Subscription Card */}
      {subData && (
        <Card className="border-[#DFDFE2] bg-[#F4F4F4]">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg text-[#202B28]">Active Plan: {subData.plan_name}</CardTitle>
                <CardDescription>
                  Status: <Badge variant={subData.status === "ACTIVE" ? "success" : "warning"}>{subData.status}</Badge>
                </CardDescription>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-[#202B28]">{formatINR(subData.monthly_price)} /mo</div>
                <div className="text-xs text-[#66736F]">{subData.billing_interval} billing</div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-[#DFDFE2]">
            <div>
              <div className="text-xs text-[#66736F]">Employee Seat Limit</div>
              <div className="text-base font-bold text-[#202B28]">
                {subData.active_employees_count} / {subData.max_employees} seats used
              </div>
              <div className="w-full bg-[#DFDFE2] h-1.5 rounded-full mt-1.5 overflow-hidden">
                <div
                  className="bg-[#476E66] h-full rounded-full"
                  style={{
                    width: `${Math.min(100, (subData.active_employees_count / subData.max_employees) * 100)}%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="text-xs text-[#66736F]">Remaining Period</div>
              <div className="text-base font-bold text-[#202B28]">
                {subData.days_remaining} days left
              </div>
              <div className="text-xs text-[#66736F] mt-1">
                Expires on {new Date(subData.current_period_end).toLocaleDateString()}
              </div>
            </div>

            <div>
              <div className="text-xs text-[#66736F]">Payment Gateway</div>
              <div className="text-sm font-semibold text-[#202B28] flex items-center gap-1.5 mt-0.5">
                <ShieldCheck className="w-4 h-4 text-[#3B7A57]" /> Razorpay Secured
              </div>
              <div className="text-[10px] text-[#66736F]">HMAC-SHA256 verified webhooks</div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Plan Upgrade Options */}
      <div className="space-y-4 pt-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold text-[#202B28]">Upgrade or Switch Plan</h3>
            <p className="text-xs text-[#66736F]">Select an employee seat quota that fits your workforce</p>
          </div>

          <div className="flex items-center gap-1 p-1 bg-[#F4F4F4] border border-[#DFDFE2] rounded-lg text-xs font-semibold">
            <button
              onClick={() => setBillingInterval("MONTHLY")}
              className={`px-3 py-1 rounded-md transition ${billingInterval === "MONTHLY" ? "bg-[#476E66] text-[#FEFEFE] shadow-xs" : "text-[#66736F] hover:text-[#202B28]"}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingInterval("ANNUAL")}
              className={`px-3 py-1 rounded-md transition ${billingInterval === "ANNUAL" ? "bg-[#476E66] text-[#FEFEFE] shadow-xs" : "text-[#66736F] hover:text-[#202B28]"}`}
            >
              Annual (Save 15%)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plansData?.results?.map((plan: any) => {
            const isCurrent = subData?.plan_code === plan.code;
            const price = billingInterval === "ANNUAL" ? plan.annual_price : plan.monthly_price;

            return (
              <Card key={plan.id} className={plan.code === "GROWTH" ? "border-2 border-[#476E66] bg-[#FEFEFE] shadow-md" : "border-[#DFDFE2] bg-[#FEFEFE]"}>
                <CardHeader>
                  <CardTitle className="text-[#202B28]">{plan.name}</CardTitle>
                  <CardDescription className="text-[#66736F]">Up to {plan.max_employees} employees</CardDescription>
                  <div className="pt-2 text-2xl font-extrabold text-[#202B28]">
                    {formatINR(price)}
                    <span className="text-xs font-normal text-[#66736F]">
                      /{billingInterval === "ANNUAL" ? "yr" : "mo"}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 text-xs text-[#66736F]">
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#3B7A57]" /> {plan.max_employees} employee accounts</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#3B7A57]" /> Shift & Attendance Engine</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#3B7A57]" /> Deterministic Payroll & Payslips</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#3B7A57]" /> Razorpay Automated Billing</div>
                </CardContent>
                <CardFooter>
                  <Button
                    className={`w-full text-xs ${isCurrent ? "border-[#DFDFE2] text-[#66736F]" : "bg-[#476E66] hover:bg-[#3B5C55] text-[#FEFEFE]"}`}
                    variant={isCurrent ? "outline" : "default"}
                    disabled={isCurrent || checkoutMutation.isPending}
                    onClick={() => checkoutMutation.mutate(plan.code)}
                  >
                    {isCurrent ? "Current Plan" : "Select & Pay"}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
