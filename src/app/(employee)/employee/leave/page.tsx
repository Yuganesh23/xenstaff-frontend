"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { LeaveRequest, LeaveType } from "@/types";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { CalendarOff, Plus, X, AlertCircle, CheckCircle2 } from "lucide-react";

export default function MyLeavePage() {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [leaveTypeId, setLeaveTypeId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [totalDays, setTotalDays] = useState(1);
  const [reason, setReason] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { data: requestsData, isLoading } = useQuery<any>({
    queryKey: ["myLeaveRequests"],
    queryFn: () => apiClient.get("/leave/requests"),
  });

  const { data: balancesData } = useQuery<any>({
    queryKey: ["myLeaveBalances"],
    queryFn: () => apiClient.get("/leave/balances"),
  });

  const { data: leaveTypesData } = useQuery<any>({
    queryKey: ["leaveTypesList"],
    queryFn: () => apiClient.get("/leave/types"),
  });

  const applyMutation = useMutation({
    mutationFn: (data: any) => apiClient.post("/leave/requests", data),
    onSuccess: () => {
      setShowModal(false);
      setErrorMsg(null);
      setReason("");
      queryClient.invalidateQueries({ queryKey: ["myLeaveRequests"] });
      queryClient.invalidateQueries({ queryKey: ["myLeaveBalances"] });
    },
    onError: (err: any) => setErrorMsg(err.message || "Failed to submit leave request."),
  });

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    const typeId = leaveTypeId || leaveTypesData?.results?.[0]?.id;
    if (!typeId) {
      setErrorMsg("Please select a valid leave type.");
      return;
    }

    applyMutation.mutate({
      leave_type: typeId,
      start_date: startDate,
      end_date: endDate,
      total_days: Number(totalDays),
      reason,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#202B28] tracking-tight">Apply for Leave</h1>
          <p className="text-xs text-[#66736F]">Check remaining balance quotas and submit leave applications</p>
        </div>

        <Button size="sm" onClick={() => setShowModal(true)} className="gap-1.5 bg-[#476E66] hover:bg-[#3B5C55] text-[#FEFEFE]">
          <Plus className="w-4 h-4" /> Request Leave
        </Button>
      </div>

      {/* Balances Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {balancesData?.results?.map((bal: any) => (
          <Card key={bal.id} className="bg-[#FEFEFE] border-[#DFDFE2]">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-semibold text-[#66736F]">{bal.leave_type_name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#3B7A57]">{bal.available_days}</div>
              <div className="text-[10px] text-[#66736F] mt-1">Used: {bal.used_days} / {bal.allocated_days} days</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Application History */}
      <Card className="bg-[#FEFEFE] border-[#DFDFE2]">
        <CardHeader>
          <CardTitle className="text-[#202B28]">My Leave Applications</CardTitle>
          <CardDescription className="text-[#66736F]">Track managerial and HR approval status</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-[#F4F4F4]">
              <TableRow className="border-b border-[#DFDFE2]">
                <TableHead className="text-[#66736F]">Type</TableHead>
                <TableHead className="text-[#66736F]">Duration</TableHead>
                <TableHead className="text-[#66736F]">Total Days</TableHead>
                <TableHead className="text-[#66736F]">Reason</TableHead>
                <TableHead className="text-[#66736F]">Status</TableHead>
                <TableHead className="text-[#66736F]">Applied On</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-[#BEC0BF] text-xs">
                    Loading requests...
                  </TableCell>
                </TableRow>
              ) : requestsData?.results && requestsData.results.length > 0 ? (
                requestsData.results.map((req: LeaveRequest) => (
                  <TableRow key={req.id} className="border-b border-[#DFDFE2] hover:bg-[#F4F4F4]/50">
                    <TableCell className="font-semibold text-[#202B28]">{req.leave_type_name}</TableCell>
                    <TableCell className="text-xs font-mono text-[#202B28]">
                      {req.start_date} → {req.end_date}
                    </TableCell>
                    <TableCell className="font-semibold text-[#202B28]">{req.total_days} days</TableCell>
                    <TableCell className="text-xs text-[#66736F] max-w-xs truncate">{req.reason || "—"}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          req.status === "APPROVED"
                            ? "success"
                            : req.status === "PENDING"
                            ? "warning"
                            : "destructive"
                        }
                      >
                        {req.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-[#66736F]">
                      {new Date(req.created_at).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-[#BEC0BF] text-xs">
                    No leave applications found. Click "Request Leave" to submit.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Leave Application Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-[#202B28]/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FEFEFE] border border-[#DFDFE2] rounded-xl shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-[#DFDFE2]">
              <h3 className="font-bold text-base text-[#202B28]">Apply for Leave</h3>
              <button onClick={() => setShowModal(false)} className="text-[#66736F] hover:text-[#202B28]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleApply} className="space-y-4">
              {errorMsg && (
                <div className="p-3 bg-[#FBEBEB] border border-[#B0413E]/30 rounded-lg flex items-center gap-2 text-xs text-[#B0413E]">
                  <AlertCircle className="w-4 h-4 shrink-0 text-[#B0413E]" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#202B28]">Leave Type *</label>
                <select
                  className="w-full rounded-md border border-[#DFDFE2] text-sm p-2 bg-[#FEFEFE] text-[#202B28] focus:outline-none focus:ring-1 focus:ring-[#476E66]"
                  value={leaveTypeId}
                  onChange={(e) => setLeaveTypeId(e.target.value)}
                >
                  {leaveTypesData?.results?.map((lt: LeaveType) => (
                    <option key={lt.id} value={lt.id}>
                      {lt.name} ({lt.code})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#202B28]">Start Date *</label>
                  <Input type="date" required value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#202B28]">End Date *</label>
                  <Input type="date" required value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#202B28]">Total Days *</label>
                <Input
                  type="number"
                  step="0.5"
                  min="0.5"
                  required
                  value={totalDays}
                  onChange={(e) => setTotalDays(Number(e.target.value))}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#202B28]">Reason for Leave *</label>
                <textarea
                  required
                  rows={3}
                  className="w-full rounded-md border border-[#DFDFE2] text-xs p-2.5 focus:outline-none focus:ring-1 focus:ring-[#476E66] text-[#202B28] bg-[#FEFEFE]"
                  placeholder="Medical checkup / Vacation"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#DFDFE2]">
                <Button type="button" variant="outline" className="border-[#DFDFE2] text-[#202B28] hover:bg-[#F4F4F4]" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={applyMutation.isPending} className="bg-[#476E66] hover:bg-[#3B5C55] text-[#FEFEFE]">
                  {applyMutation.isPending ? "Submitting..." : "Submit Application"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
