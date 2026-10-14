"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { apiClient } from "@/lib/api/client";
import { useAuth } from "@/providers/AuthProvider";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { Lock, CheckCircle2, AlertCircle, ShieldCheck, ArrowRight, Loader2 } from "lucide-react";

function SetPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { login } = useAuth();

  const uid = searchParams.get("uid") || "";
  const token = searchParams.get("token") || "";

  const [verifying, setVerifying] = useState(true);
  const [valid, setValid] = useState(false);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [orgName, setOrgName] = useState("");
  const [verifyError, setVerifyError] = useState<string | null>(null);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!uid || !token) {
      setVerifying(false);
      setVerifyError("No activation token or user identifier provided in link.");
      return;
    }

    const checkToken = async () => {
      try {
        const res = await apiClient.get<any>("/auth/verify-token", { uid, token });
        if (res.valid) {
          setValid(true);
          setUserName(res.user?.first_name || "Employee");
          setUserEmail(res.user?.email || "");
          setOrgName(res.organization_name || "your organization");
        }
      } catch (err: any) {
        setVerifyError(err.message || "This activation link is invalid, expired, or has already been used.");
      } finally {
        setVerifying(false);
      }
    };

    checkToken();
  }, [uid, token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (password.length < 8) {
      setFormError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setFormError("Passwords do not match.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await apiClient.post<any>("/auth/set-password", {
        uid,
        token,
        password,
        password_confirm: confirmPassword,
      });

      setSuccess(true);

      // Auto-login after 1.5 seconds
      setTimeout(() => {
        if (res.token && res.user) {
          login(res.token, res.user, res.active_organization, res.organizations || []);
        } else {
          router.push("/login");
        }
      }, 1500);
    } catch (err: any) {
      setFormError(err.message || "Failed to set password. The activation link may have expired.");
      setSubmitting(false);
    }
  };

  if (verifying) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4">
        <Loader2 className="w-8 h-8 text-[#476E66] animate-spin" />
        <p className="text-sm text-[#66736F] font-medium">Verifying your invitation link...</p>
      </div>
    );
  }

  if (verifyError || !valid) {
    return (
      <Card className="w-full max-w-md shadow-2xs border-[#DFDFE2] bg-[#FEFEFE]">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto w-12 h-12 rounded-full bg-[#FBEBEB] flex items-center justify-center mb-2">
            <AlertCircle className="w-6 h-6 text-[#B0413E]" />
          </div>
          <CardTitle className="text-xl font-bold text-[#202B28]">Activation Link Expired</CardTitle>
          <CardDescription className="text-xs text-[#66736F]">
            {verifyError || "This activation link is invalid or has already been used."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-xs text-[#66736F] bg-[#F4F4F4] p-3 rounded-lg border border-[#DFDFE2]">
            For security, employee invitation links expire after 48 hours. Please ask your HR administrator or manager to resend your invitation email.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link href="/login">
            <Button variant="outline" className="text-xs">
              Back to Sign In
            </Button>
          </Link>
        </CardFooter>
      </Card>
    );
  }

  if (success) {
    return (
      <Card className="w-full max-w-md shadow-2xs border-[#3B7A57]/20 bg-[#FEFEFE]">
        <CardContent className="pt-8 pb-8 text-center space-y-4">
          <div className="mx-auto w-12 h-12 rounded-full bg-[#EBF4EF] flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6 text-[#3B7A57]" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-[#202B28]">Account Activated!</h3>
            <p className="text-xs text-[#66736F] mt-1">
              Your password has been securely saved. Redirecting to your employee portal...
            </p>
          </div>
          <Loader2 className="w-5 h-5 text-[#476E66] animate-spin mx-auto" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md shadow-2xs border-[#DFDFE2] bg-[#FEFEFE]">
      <CardHeader className="text-center pb-3">
        <div className="inline-flex items-center gap-1.5 justify-center mb-1">
          <ShieldCheck className="w-5 h-5 text-[#708A83]" />
          <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-wider">
            {orgName}
          </Badge>
        </div>
        <CardTitle className="text-2xl font-bold text-[#202B28]">Welcome, {userName}!</CardTitle>
        <CardDescription className="text-xs text-[#66736F]">
          Create your private, confidential password to access your employee self-service portal ({userEmail})
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4 pt-2">
          {formError && (
            <div className="p-3 bg-[#FBEBEB] border border-[#B0413E]/20 rounded-lg flex items-center gap-2 text-xs text-[#B0413E]">
              <AlertCircle className="w-4 h-4 shrink-0 text-[#B0413E]" />
              <span>{formError}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#202B28] flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-[#708A83]" /> New Private Password *
            </label>
            <Input
              type="password"
              required
              placeholder="Minimum 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="text-sm"
              minLength={8}
            />
            <p className="text-[10px] text-[#66736F]">Must be at least 8 characters long</p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#202B28] flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-[#708A83]" /> Confirm Private Password *
            </label>
            <Input
              type="password"
              required
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="text-sm"
              minLength={8}
            />
          </div>

          <div className="bg-[#F4F4F4] p-3 rounded-lg border border-[#DFDFE2] text-[11px] text-[#66736F] space-y-1">
            <div className="font-semibold text-[#202B28] flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#476E66]" /> Confidential & Private:
            </div>
            <p className="text-[10px] text-[#66736F]">
              Your password is encrypted and never visible to HR or organization administrators. Only you can view your personal salary details and payslips.
            </p>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-2 pt-2">
          <Button
            type="submit"
            disabled={submitting}
            className="w-full bg-[#476E66] hover:bg-[#3B5C55] text-[#FEFEFE] font-medium text-sm gap-2"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Securing Account...
              </>
            ) : (
              <>
                Activate & Access Portal
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>

          <Link href="/login" className="text-center text-xs text-[#66736F] hover:text-[#202B28] mt-2">
            Already have an active account? Sign in
          </Link>
        </CardFooter>
      </form>
    </Card>
  );
}

export default function SetPasswordPage() {
  return (
    <div className="min-h-screen bg-[#FEFEFE] flex flex-col justify-center items-center px-4 relative">
      <div className="absolute top-6 right-6">
        <LanguageSwitcher />
      </div>

      <div className="w-full max-w-md space-y-4 mb-4 text-center">
        <div className="inline-flex w-10 h-10 rounded-xl bg-[#476E66] items-center justify-center text-[#FEFEFE] font-bold text-xl shadow-xs mb-1">
          X
        </div>
        <h2 className="text-sm font-semibold tracking-wide uppercase text-[#66736F]">XenStaff Security</h2>
      </div>

      <Suspense
        fallback={
          <div className="flex flex-col items-center justify-center p-8 space-y-4">
            <Loader2 className="w-8 h-8 text-[#476E66] animate-spin" />
            <p className="text-sm text-[#66736F] font-medium">Loading security portal...</p>
          </div>
        }
      >
        <SetPasswordContent />
      </Suspense>
    </div>
  );
}
