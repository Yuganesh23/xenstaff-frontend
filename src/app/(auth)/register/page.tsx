"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/providers/AuthProvider";
import { apiClient } from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { AlertCircle } from "lucide-react";

export default function RegisterPage() {
  const { login } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await apiClient.post<any>("/auth/register", {
        first_name: firstName,
        last_name: lastName,
        company_name: companyName,
        email,
        password,
      });

      login(res.token, res.user, res.organization, [
        {
          id: res.organization.id,
          organization_id: res.organization.id,
          organization_name: res.organization.name,
          organization_slug: res.organization.slug,
          role: res.organization.role,
          is_active: true,
        },
      ]);
    } catch (err: any) {
      setError(err.message || "Failed to register organization.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FEFEFE] flex flex-col justify-center items-center px-4 py-12 relative">
      <div className="absolute top-6 right-6">
        <LanguageSwitcher />
      </div>

      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-1">
          <div className="inline-flex w-10 h-10 rounded-xl bg-[#476E66] items-center justify-center text-[#FEFEFE] font-bold text-xl shadow-xs mb-2">
            X
          </div>
          <h1 className="text-2xl font-bold text-[#202B28] tracking-tight">Register Your Organization</h1>
          <p className="text-xs text-[#66736F]">14-day full-access trial. No credit card required.</p>
        </div>

        <Card className="border-[#DFDFE2] bg-[#FEFEFE] shadow-2xs">
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4 pt-6">
              {error && (
                <div className="p-3 bg-[#FBEBEB] border border-[#B0413E]/20 rounded-lg flex items-center gap-2 text-xs text-[#B0413E]">
                  <AlertCircle className="w-4 h-4 shrink-0 text-[#B0413E]" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#202B28]">Company / Organization Name</label>
                <Input
                  required
                  placeholder="Acme Technologies Pvt Ltd"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#202B28]">First Name</label>
                  <Input
                    required
                    placeholder="Arun"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#202B28]">Last Name</label>
                  <Input
                    placeholder="Kumar"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#202B28]">Work Email</label>
                <Input
                  type="email"
                  required
                  placeholder="arun@acme.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#202B28]">Password</label>
                <Input
                  type="password"
                  required
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-3">
              <Button type="submit" disabled={loading} className="w-full bg-[#476E66] hover:bg-[#3B5C55] text-[#FEFEFE]">
                {loading ? "Creating Organization..." : "Start Free Trial"}
              </Button>

              <div className="text-center text-xs text-[#66736F]">
                Already registered?{" "}
                <Link href="/login" className="text-[#476E66] font-semibold hover:underline">
                  Sign In
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
