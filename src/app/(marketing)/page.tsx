"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/providers/LanguageProvider";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import {
  CheckCircle2,
  ShieldCheck,
  Calculator,
  CalendarCheck,
  Building,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default function MarketingPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-[#FEFEFE] flex flex-col text-[#202B28]">
      {/* Header */}
      <header className="h-16 border-b border-[#DFDFE2] bg-[#FEFEFE] px-8 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#476E66] flex items-center justify-center text-[#FEFEFE] font-bold text-base shadow-sm">
            X
          </div>
          <span className="font-bold text-xl text-[#202B28] tracking-tight">XenStaff</span>
          <span className="text-xs text-[#66736F] font-medium hidden sm:inline">by XenFirm Technologies</span>
        </div>

        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <Link href="/login">
            <Button variant="ghost" className="text-[#202B28] hover:bg-[#F4F4F4]">Sign In</Button>
          </Link>
          <Link href="/register">
            <Button className="bg-[#476E66] hover:bg-[#3B5C55] text-[#FEFEFE]">Get Started Free</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6 max-w-6xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#DFDFE2] bg-[#F4F4F4] text-[#476E66] text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-[#708A83]" />
          Engineered for Indian SMBs & MSMEs
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-[#202B28] tracking-tight max-w-4xl mx-auto leading-tight">
          Reliable Attendance & Deterministic Payroll SaaS
        </h1>

        <p className="text-lg text-[#66736F] max-w-2xl mx-auto">
          Simplify employee records, record shift attendance, manage leave balances, and compute exact, tamper-proof payroll with professional PDF payslips in English and Tamil.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Link href="/register">
            <Button size="lg" className="w-full sm:w-auto gap-2 bg-[#476E66] hover:bg-[#3B5C55] text-[#FEFEFE]">
              Start 14-Day Free Trial <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline" className="w-full sm:w-auto border-[#DFDFE2] text-[#202B28] hover:bg-[#F4F4F4]">
              Live Demo Sign In
            </Button>
          </Link>
        </div>
      </section>

      {/* Core Capabilities Grid */}
      <section className="py-12 px-6 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-[#FEFEFE] border-[#DFDFE2] shadow-sm">
          <CardHeader>
            <ShieldCheck className="w-8 h-8 text-[#708A83] mb-2" />
            <CardTitle className="text-[#202B28]">Strict Multi-Tenancy</CardTitle>
            <CardDescription className="text-[#66736F]">
              Guaranteed tenant data isolation at the model, queryset and service layers. Zero cross-organization leakage.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="bg-[#FEFEFE] border-[#DFDFE2] shadow-sm">
          <CardHeader>
            <Calculator className="w-8 h-8 text-[#476E66] mb-2" />
            <CardTitle className="text-[#202B28]">Deterministic Payroll</CardTitle>
            <CardDescription className="text-[#66736F]">
              Fixed precision decimal arithmetic, formula proration for mid-month joining, LOP deductions, overtime, and frozen state machine.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="bg-[#FEFEFE] border-[#DFDFE2] shadow-sm">
          <CardHeader>
            <CalendarCheck className="w-8 h-8 text-[#708A83] mb-2" />
            <CardTitle className="text-[#202B28]">Attendance & Shift Engine</CardTitle>
            <CardDescription className="text-[#66736F]">
              Authoritative server clock punches, idempotency keys, overnight shifts, late arrival thresholds, and regularizations.
            </CardDescription>
          </CardHeader>
        </Card>
      </section>

      {/* Pricing Proposal */}
      <section className="py-16 px-6 max-w-6xl mx-auto text-center space-y-8 bg-[#F4F4F4] border-y border-[#DFDFE2]">
        <div>
          <h2 className="text-3xl font-bold text-[#202B28]">Simple, Transparent Pricing</h2>
          <p className="text-[#66736F] text-sm mt-1">Scale effortlessly as your business grows</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left max-w-5xl mx-auto">
          <Card className="bg-[#FEFEFE] border-[#DFDFE2]">
            <CardHeader>
              <CardTitle className="text-[#202B28]">Starter</CardTitle>
              <CardDescription className="text-[#66736F]">Ideal for micro-enterprises</CardDescription>
              <div className="pt-4 text-3xl font-extrabold text-[#202B28]">₹399<span className="text-sm font-normal text-[#66736F]"> /month</span></div>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-[#66736F]">
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#3B7A57]" /> Up to 10 Employees</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#3B7A57]" /> Attendance & Clock-in</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#3B7A57]" /> Deterministic Payroll</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#3B7A57]" /> PDF Payslips</div>
            </CardContent>
            <CardFooter>
              <Link href="/register" className="w-full">
                <Button variant="outline" className="w-full border-[#DFDFE2] text-[#202B28] hover:bg-[#F4F4F4]">Select Starter</Button>
              </Link>
            </CardFooter>
          </Card>

          <Card className="bg-[#FEFEFE] border-2 border-[#476E66] shadow-md relative">
            <div className="absolute -top-3 right-6 px-2.5 py-0.5 rounded-full bg-[#476E66] text-[#FEFEFE] text-[10px] font-bold tracking-wider uppercase">
              Popular
            </div>
            <CardHeader>
              <CardTitle className="text-[#202B28]">Growth</CardTitle>
              <CardDescription className="text-[#66736F]">For expanding SMB businesses</CardDescription>
              <div className="pt-4 text-3xl font-extrabold text-[#202B28]">₹999<span className="text-sm font-normal text-[#66736F]"> /month</span></div>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-[#66736F]">
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#3B7A57]" /> Up to 30 Employees</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#3B7A57]" /> Multi-Branch & Department</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#3B7A57]" /> Leave Balance Ledgers</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#3B7A57]" /> Advanced Reports & CSV Export</div>
            </CardContent>
            <CardFooter>
              <Link href="/register" className="w-full">
                <Button className="w-full bg-[#476E66] hover:bg-[#3B5C55] text-[#FEFEFE]">Select Growth</Button>
              </Link>
            </CardFooter>
          </Card>

          <Card className="bg-[#FEFEFE] border-[#DFDFE2]">
            <CardHeader>
              <CardTitle className="text-[#202B28]">Business</CardTitle>
              <CardDescription className="text-[#66736F]">Full workforce management</CardDescription>
              <div className="pt-4 text-3xl font-extrabold text-[#202B28]">₹1,999<span className="text-sm font-normal text-[#66736F]"> /month</span></div>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-[#66736F]">
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#3B7A57]" /> Up to 100 Employees</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#3B7A57]" /> Overnight & Custom Shifts</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#3B7A57]" /> Audit Trail Logging</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#3B7A57]" /> Priority Support</div>
            </CardContent>
            <CardFooter>
              <Link href="/register" className="w-full">
                <Button variant="outline" className="w-full border-[#DFDFE2] text-[#202B28] hover:bg-[#F4F4F4]">Select Business</Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-[#DFDFE2] bg-[#FEFEFE] py-6 px-8 text-center text-xs text-[#66736F]">
        © 2026 XenFirm Technologies. XenStaff is a registered B2B SaaS platform.
      </footer>
    </div>
  );
}
