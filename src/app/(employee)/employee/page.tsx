"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { useAuth } from "@/providers/AuthProvider";
import { formatINR } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  CalendarCheck,
  CalendarOff,
  FileText,
  Download,
  CheckCircle2,
  AlertCircle,
  Play,
  Square,
} from "lucide-react";

export default function EmployeeDashboardPage() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState<string>("");
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString("en-IN", { hour12: true }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const { data: attendanceData } = useQuery<any>({
    queryKey: ["myAttendanceSummary"],
    queryFn: () => apiClient.get("/attendance/"),
  });

  const { data: balancesData } = useQuery<any>({
    queryKey: ["myLeaveBalances"],
    queryFn: () => apiClient.get("/leave/balances"),
  });

  const { data: payslipsData } = useQuery<any>({
    queryKey: ["myPayslips"],
    queryFn: () => apiClient.get("/payslips/"),
  });

  const clockInMutation = useMutation({
    mutationFn: () =>
      apiClient.post<any>("/attendance/clock-in", {
        idempotency_key: `punch_in_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        source: "PWA",
      }),
    onSuccess: (data: any) => {
      setStatusMsg({ type: "success", text: data?.message || "Clock-in recorded successfully!" });
      queryClient.invalidateQueries({ queryKey: ["myAttendanceSummary"] });
    },
    onError: (err: any) => {
      setStatusMsg({ type: "error", text: err.message || "Clock-in failed." });
    },
  });

  const clockOutMutation = useMutation({
    mutationFn: () =>
      apiClient.post<any>("/attendance/clock-out", {
        idempotency_key: `punch_out_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        source: "PWA",
      }),
    onSuccess: (data: any) => {
      setStatusMsg({ type: "success", text: data?.message || "Clock-out recorded successfully!" });
      queryClient.invalidateQueries({ queryKey: ["myAttendanceSummary"] });
    },
    onError: (err: any) => {
      setStatusMsg({ type: "error", text: err.message || "Clock-out failed." });
    },
  });

  const todaySummary = attendanceData?.results?.[0];
  const isClockedIn = todaySummary?.first_clock_in && !todaySummary?.last_clock_out;
  const latestPayslip = payslipsData?.results?.[0];

  const handleDownloadPayslip = (id: string, number: string) => {
    const token = localStorage.getItem("xenstaff_token");
    const activeOrgId = localStorage.getItem("xenstaff_active_org_id");

    fetch(apiClient.getDownloadUrl(`/payslips/${id}/download`), {
      headers: {
        Authorization: `Bearer ${token}`,
        ...(activeOrgId ? { "X-Organization-ID": activeOrgId } : {}),
      },
    })
      .then((res) => res.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `payslip_${number}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2 border-b border-[#DFDFE2]">
        <div>
          <h1 className="text-2xl font-bold text-[#202B28] tracking-tight">
            Welcome back, {user?.first_name}!
          </h1>
          <p className="text-xs text-[#66736F]">Employee Self-Service (ESS) Portal</p>
        </div>
        <div className="text-xs font-semibold px-3 py-1.5 bg-[#F4F4F4] border border-[#DFDFE2] rounded-lg text-[#202B28]">
          {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "short", day: "numeric" })}
        </div>
      </div>

      {statusMsg && (
        <div
          className={`p-4 rounded-xl border flex items-center gap-2 text-xs ${
            statusMsg.type === "success"
              ? "bg-[#EBF4EF] border-[#3B7A57]/30 text-[#3B7A57]"
              : "bg-[#FBEBEB] border-[#B0413E]/30 text-[#B0413E]"
          }`}
        >
          {statusMsg.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-[#3B7A57] shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-[#B0413E] shrink-0" />
          )}
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* Clock In / Out Main Card */}
      <Card className="border-[#DFDFE2] bg-[#F4F4F4]">
        <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <div className="text-xs font-semibold text-[#66736F] uppercase tracking-wider">Authoritative Server Punch</div>
            <div className="text-4xl font-extrabold text-[#202B28] font-mono tracking-tight">{currentTime || "—:—:—"}</div>
            <div className="text-xs text-[#66736F] flex items-center justify-center md:justify-start gap-1.5 mt-1">
              <Clock className="w-3.5 h-3.5 text-[#708A83]" /> General Shift (09:00 AM — 06:00 PM)
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            {!isClockedIn ? (
              <Button
                size="lg"
                className="w-full md:w-auto gap-2 bg-[#476E66] hover:bg-[#3B5C55] text-[#FEFEFE] font-semibold shadow-sm"
                onClick={() => clockInMutation.mutate()}
                disabled={clockInMutation.isPending}
              >
                <Play className="w-4 h-4" /> Clock In
              </Button>
            ) : (
              <Button
                size="lg"
                className="w-full md:w-auto gap-2 bg-[#B0413E] hover:bg-[#8D3432] text-[#FEFEFE] font-semibold shadow-sm"
                onClick={() => clockOutMutation.mutate()}
                disabled={clockOutMutation.isPending}
              >
                <Square className="w-4 h-4" /> Clock Out
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Today's Punch Summary & Leave Quota */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-[#FEFEFE] border-[#DFDFE2]">
          <CardHeader>
            <CardTitle className="text-[#202B28]">Today's Attendance Status</CardTitle>
            <CardDescription className="text-[#66736F]">Punches recorded for {new Date().toISOString().split("T")[0]}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="flex justify-between items-center py-2 border-b border-[#DFDFE2]">
              <span className="text-[#66736F]">First Clock-In</span>
              <span className="font-semibold text-[#202B28]">
                {todaySummary?.first_clock_in
                  ? new Date(todaySummary.first_clock_in).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                  : "Not clocked in yet"}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-[#DFDFE2]">
              <span className="text-[#66736F]">Last Clock-Out</span>
              <span className="font-semibold text-[#202B28]">
                {todaySummary?.last_clock_out
                  ? new Date(todaySummary.last_clock_out).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                  : isClockedIn
                  ? "Active session in progress"
                  : "—"}
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-[#66736F]">Calculated Work Duration</span>
              <span className="font-bold text-[#3B7A57] text-sm">{todaySummary?.work_hours ?? 0} hrs</span>
            </div>
          </CardContent>
        </Card>

        {/* Leave Balances Card */}
        <Card className="bg-[#FEFEFE] border-[#DFDFE2]">
          <CardHeader>
            <CardTitle className="text-[#202B28]">Leave Quota Balances</CardTitle>
            <CardDescription className="text-[#66736F]">Available days for calendar year {new Date().getFullYear()}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {balancesData?.results && balancesData.results.length > 0 ? (
              balancesData.results.map((bal: any) => (
                <div key={bal.id} className="flex justify-between items-center p-2 rounded-lg bg-[#F4F4F4] border border-[#DFDFE2]">
                  <span className="text-xs font-semibold text-[#202B28]">
                    {bal.leave_type_name} ({bal.leave_type_code})
                  </span>
                  <div className="text-xs font-bold text-[#3B7A57]">{bal.available_days} days left</div>
                </div>
              ))
            ) : (
              <div className="py-4 text-center text-xs text-[#66736F]">Leave balances initialized on assignment.</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Latest Payslip Card */}
      {latestPayslip && (
        <Card className="border-[#DFDFE2] bg-[#FEFEFE]">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-base text-[#202B28]">Latest Published Payslip</CardTitle>
                <CardDescription className="text-[#66736F]">
                  Period: {String(latestPayslip.month).padStart(2, "0")}/{latestPayslip.year} • {latestPayslip.payslip_number}
                </CardDescription>
              </div>
              <div className="text-right">
                <div className="text-lg font-extrabold text-[#3B7A57]">{formatINR(latestPayslip.net_salary)}</div>
                <div className="text-[10px] text-[#66736F] font-semibold">Net Payable</div>
              </div>
            </div>
          </CardHeader>
          <CardFooter className="pt-0">
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5 border-[#476E66] text-[#476E66] hover:bg-[#F4F4F4] text-xs"
              onClick={() => handleDownloadPayslip(latestPayslip.id, latestPayslip.payslip_number)}
            >
              <Download className="w-3.5 h-3.5" /> Download Authentic PDF Payslip
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
