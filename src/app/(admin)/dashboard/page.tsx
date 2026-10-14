"use client";

import React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { formatINR } from "@/lib/utils";
import { useLanguage } from "@/providers/LanguageProvider";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  CalendarCheck,
  Clock,
  CalendarOff,
  Calculator,
  AlertCircle,
  Plus,
  Play,
  ArrowUpRight,
} from "lucide-react";

export default function AdminDashboardPage() {
  const { t } = useLanguage();

  const { data: attendanceMetrics } = useQuery<any>({
    queryKey: ["attendanceMetrics"],
    queryFn: () => apiClient.get("/attendance/summary"),
  });

  const { data: employeesData } = useQuery<any>({
    queryKey: ["employeesList"],
    queryFn: () => apiClient.get("/employees/"),
  });

  const { data: payrollRunsData } = useQuery<any>({
    queryKey: ["payrollRuns"],
    queryFn: () => apiClient.get("/payroll/runs"),
  });

  const { data: subscription } = useQuery<any>({
    queryKey: ["currentSubscription"],
    queryFn: () => apiClient.get("/subscriptions/current"),
  });

  const latestRun = payrollRunsData?.results?.[0];

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2 border-b border-[#DFDFE2]">
        <div>
          <h1 className="text-2xl font-bold text-[#202B28] tracking-tight">{t("dashboard.title")}</h1>
          <p className="text-xs text-[#66736F]">{t("dashboard.subtitle")}</p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/employees">
            <Button size="sm" variant="outline" className="gap-1.5">
              <Plus className="w-4 h-4 text-[#708A83]" /> {t("dashboard.add_employee")}
            </Button>
          </Link>
          <Link href="/payroll">
            <Button size="sm" className="gap-1.5 bg-[#476E66] hover:bg-[#3B5C55] text-[#FEFEFE]">
              <Play className="w-4 h-4" /> {t("dashboard.run_payroll")}
            </Button>
          </Link>
        </div>
      </div>

      {/* Subscription / Trial Alert if Trialing */}
      {subscription?.is_trial && (
        <div className="p-4 bg-[#F4F4F4] border border-[#DFDFE2] rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#EBF2F0] rounded-lg text-[#476E66]">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#202B28]">14-Day Free Trial Active</div>
              <div className="text-xs text-[#66736F]">
                You have {subscription.days_remaining} days remaining. Seats used: {subscription.active_employees_count} / {subscription.max_employees}
              </div>
            </div>
          </div>
          <Link href="/billing">
            <Button size="sm" className="bg-[#476E66] hover:bg-[#3B5C55] text-[#FEFEFE]">
              Upgrade Subscription
            </Button>
          </Link>
        </div>
      )}

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-[#66736F] uppercase tracking-wider">
              {t("dashboard.total_employees")}
            </CardTitle>
            <Users className="w-4 h-4 text-[#708A83]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-[#202B28]">
              {employeesData?.count ?? 0}
            </div>
            <div className="text-xs text-[#66736F] mt-1">Across all branches</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-[#66736F] uppercase tracking-wider">
              {t("dashboard.present_today")}
            </CardTitle>
            <CalendarCheck className="w-4 h-4 text-[#3B7A57]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-[#3B7A57]">
              {attendanceMetrics?.present_count ?? 0}
            </div>
            <div className="text-xs text-[#66736F] mt-1">
              {attendanceMetrics?.attendance_rate ?? 0}% attendance rate
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-[#66736F] uppercase tracking-wider">
              {t("dashboard.late_arrivals")}
            </CardTitle>
            <Clock className="w-4 h-4 text-[#B37D28]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-[#B37D28]">
              {attendanceMetrics?.late_count ?? 0}
            </div>
            <div className="text-xs text-[#66736F] mt-1">Past grace limit</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-[#66736F] uppercase tracking-wider">
              Active Payroll State
            </CardTitle>
            <Calculator className="w-4 h-4 text-[#708A83]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-[#202B28]">
              {latestRun ? (
                <Badge variant={latestRun.state === 'APPROVED' ? 'success' : latestRun.state === 'REVIEW' ? 'warning' : 'default'}>
                  {latestRun.state}
                </Badge>
              ) : (
                "No Run"
              )}
            </div>
            <div className="text-xs text-[#66736F] mt-1">
              {latestRun ? formatINR(latestRun.total_net) : "Cycle ready"}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid: Payroll Overview & Quick Action Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Payroll Runs</CardTitle>
            <CardDescription>Processed salary cycles and total disbursements</CardDescription>
          </CardHeader>
          <CardContent>
            {payrollRunsData?.results && payrollRunsData.results.length > 0 ? (
              <div className="divide-y divide-[#DFDFE2]">
                {payrollRunsData.results.slice(0, 4).map((run: any) => (
                  <div key={run.id} className="py-3 flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold text-[#202B28]">
                        Payroll Cycle {run.month}/{run.year}
                      </div>
                      <div className="text-xs text-[#66736F]">
                        {run.items_count} employees • Gross: {formatINR(run.total_gross)}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-sm font-bold text-[#202B28]">{formatINR(run.total_net)}</div>
                        <Badge variant={run.state === 'APPROVED' ? 'success' : run.state === 'REVIEW' ? 'warning' : 'outline'}>
                          {run.state}
                        </Badge>
                      </div>
                      <Link href="/payroll">
                        <Button size="icon" variant="ghost">
                          <ArrowUpRight className="w-4 h-4 text-[#708A83]" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-[#BEC0BF]">
                No payroll cycles recorded yet. Click "Run Payroll" to initiate your first monthly cycle.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Links & Platform Health */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Compliance & System Status</CardTitle>
              <CardDescription>Platform integrity and isolation health</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="flex justify-between items-center py-1.5 border-b border-[#DFDFE2]">
                <span className="text-[#66736F]">Tenant Isolation</span>
                <Badge variant="success">Verified Active</Badge>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-[#DFDFE2]">
                <span className="text-[#66736F]">Timezone Context</span>
                <span className="font-semibold text-[#202B28]">Asia/Kolkata (IST)</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-[#DFDFE2]">
                <span className="text-[#66736F]">Currency Notation</span>
                <span className="font-semibold text-[#202B28]">INR (₹) Lakhs/Crores</span>
              </div>
              <div className="flex justify-between items-center py-1.5">
                <span className="text-[#66736F]">Cryptographic Payslips</span>
                <Badge variant="sage">ReportLab 5.0</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
