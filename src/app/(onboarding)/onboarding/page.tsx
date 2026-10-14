"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import { apiClient } from "@/lib/api/client";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle2, Building, Clock, Users, ArrowRight } from "lucide-react";

export default function OnboardingPage() {
  const router = useRouter();
  const { activeOrg } = useAuth();
  const [step, setStep] = useState(1);
  const [gstin, setGstin] = useState("");
  const [city, setCity] = useState("Chennai");
  const [state, setState] = useState("Tamil Nadu");
  const [loading, setLoading] = useState(false);

  const handleComplete = async () => {
    setLoading(true);
    try {
      await apiClient.patch("/organizations/current", {
        gstin,
        onboarding_completed: true,
        onboarding_step: "COMPLETED",
      });
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex w-12 h-12 rounded-xl bg-slate-900 items-center justify-center text-white font-bold text-2xl shadow-sm mb-2">
            X
          </div>
          <h1 className="text-3xl font-extrabold text-slate-950 tracking-tight">
            Welcome to XenStaff, {activeOrg?.name}!
          </h1>
          <p className="text-sm text-slate-500">
            Let's configure your organization essentials in under 2 minutes.
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex justify-between items-center px-6">
          <div className={`flex items-center gap-2 text-xs font-semibold ${step >= 1 ? "text-blue-600" : "text-slate-400"}`}>
            <span className="w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold">1</span>
            Organization
          </div>
          <div className="h-0.5 w-12 bg-slate-200" />
          <div className={`flex items-center gap-2 text-xs font-semibold ${step >= 2 ? "text-blue-600" : "text-slate-400"}`}>
            <span className="w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold">2</span>
            Schedule & Shifts
          </div>
          <div className="h-0.5 w-12 bg-slate-200" />
          <div className={`flex items-center gap-2 text-xs font-semibold ${step >= 3 ? "text-blue-600" : "text-slate-400"}`}>
            <span className="w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold">3</span>
            Finish
          </div>
        </div>

        <Card>
          {step === 1 && (
            <div>
              <CardHeader>
                <CardTitle>Organization Statutory Registration</CardTitle>
                <CardDescription>Enter company details for invoices and payslips</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">GSTIN (Optional)</label>
                  <Input placeholder="33AAAAA0000A1Z5" value={gstin} onChange={(e) => setGstin(e.target.value)} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Primary City</label>
                    <Input value={city} onChange={(e) => setCity(e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">State</label>
                    <Input value={state} onChange={(e) => setState(e.target.value)} />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end pt-2 border-t border-slate-200">
                <Button onClick={() => setStep(2)} className="gap-1.5 bg-blue-600 hover:bg-blue-700">
                  Next: Schedule <ArrowRight className="w-4 h-4" />
                </Button>
              </CardFooter>
            </div>
          )}

          {step === 2 && (
            <div>
              <CardHeader>
                <CardTitle>Work Schedule & Punctuality</CardTitle>
                <CardDescription>Default General Shift created: 09:00 AM — 06:00 PM</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-xs">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                  <div className="font-semibold text-slate-900">Standard Workweek: Monday to Saturday</div>
                  <div className="text-slate-500">Grace Period: 15 minutes before marking late arrival</div>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                  <div className="font-semibold text-slate-900">Configured Leave Policies</div>
                  <div className="text-slate-500">Casual Leave (12), Sick Leave (12), Earned Leave (15)</div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between pt-2 border-t border-slate-200">
                <Button variant="outline" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button onClick={() => setStep(3)} className="gap-1.5 bg-blue-600 hover:bg-blue-700">
                  Next: Complete <ArrowRight className="w-4 h-4" />
                </Button>
              </CardFooter>
            </div>
          )}

          {step === 3 && (
            <div>
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-2">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <CardTitle className="text-xl">You're All Set!</CardTitle>
                <CardDescription>Your multi-tenant workspace is live and configured</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-center text-xs text-slate-600">
                <p>Default headquarters branch, engineering departments, general shifts, and salary structures have been established.</p>
                <p>You can now add your team members, record attendance, and execute monthly payroll runs.</p>
              </CardContent>
              <CardFooter className="flex justify-center pt-2 border-t border-slate-200">
                <Button onClick={handleComplete} disabled={loading} className="gap-1.5 bg-blue-600 hover:bg-blue-700">
                  {loading ? "Launching Dashboard..." : "Go to Dashboard"}
                </Button>
              </CardFooter>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
