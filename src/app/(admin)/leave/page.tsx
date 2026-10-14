"use client";

import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { LeaveRequest, LeaveBalance } from "@/types";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { CheckCircle2, XCircle, CalendarOff, UserCheck } from "lucide-react";

export default function LeaveManagementPage() {
  const queryClient = useQueryClient();

  const { data: requestsData, isLoading: reqsLoading } = useQuery<any>({
    queryKey: ["leaveRequestsList"],
    queryFn: () => apiClient.get("/leave/requests"),
  });

  const { data: balancesData, isLoading: balancesLoading } = useQuery<any>({
    queryKey: ["leaveBalancesList"],
    queryFn: () => apiClient.get("/leave/balances"),
  });

  const approveMutation = useMutation({
    mutationFn: (id: string) => apiClient.post(`/leave/requests/${id}/approve`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leaveRequestsList"] });
      queryClient.invalidateQueries({ queryKey: ["leaveBalancesList"] });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (id: string) => apiClient.post(`/leave/requests/${id}/reject`, { rejection_reason: "Rejected by HR" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leaveRequestsList"] });
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#202B28] tracking-tight">Leave Management</h1>
          <p className="text-xs text-[#66736F]">Review employee leave applications, approvals and annual quotas</p>
        </div>
      </div>

      {/* Leave Requests Queue */}
      <Card className="bg-[#FEFEFE] border-[#DFDFE2]">
        <CardHeader>
          <CardTitle className="text-[#202B28]">Leave Applications</CardTitle>
          <CardDescription className="text-[#66736F]">Employee requests requiring administrative review</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-[#F4F4F4]">
              <TableRow className="border-b border-[#DFDFE2]">
                <TableHead className="text-[#66736F]">Employee</TableHead>
                <TableHead className="text-[#66736F]">Type</TableHead>
                <TableHead className="text-[#66736F]">Duration</TableHead>
                <TableHead className="text-[#66736F]">Days</TableHead>
                <TableHead className="text-[#66736F]">Reason</TableHead>
                <TableHead className="text-[#66736F]">Status</TableHead>
                <TableHead className="text-right text-[#66736F]">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reqsLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-[#BEC0BF] text-xs">
                    Loading requests...
                  </TableCell>
                </TableRow>
              ) : requestsData?.results && requestsData.results.length > 0 ? (
                requestsData.results.map((req: LeaveRequest) => (
                  <TableRow key={req.id} className="border-b border-[#DFDFE2] hover:bg-[#F4F4F4]/50">
                    <TableCell className="font-semibold text-[#202B28]">
                      {req.employee_name} ({req.employee_code})
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-[#DFDFE2] text-[#202B28]">{req.leave_type_code}</Badge>
                    </TableCell>
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
                    <TableCell className="text-right">
                      {req.status === "PENDING" ? (
                        <div className="flex justify-end gap-1.5">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs border-[#3B7A57] text-[#3B7A57] hover:bg-[#EBF4EF]"
                            onClick={() => approveMutation.mutate(req.id)}
                            disabled={approveMutation.isPending}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-[#3B7A57]" /> Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs border-[#B0413E] text-[#B0413E] hover:bg-[#FBEBEB]"
                            onClick={() => rejectMutation.mutate(req.id)}
                            disabled={rejectMutation.isPending}
                          >
                            <XCircle className="w-3.5 h-3.5 mr-1 text-[#B0413E]" /> Reject
                          </Button>
                        </div>
                      ) : (
                        <span className="text-xs text-[#66736F]">Processed</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-[#BEC0BF] text-xs">
                    No leave requests found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Leave Balances Table */}
      <Card className="bg-[#FEFEFE] border-[#DFDFE2]">
        <CardHeader>
          <CardTitle className="text-[#202B28]">Employee Leave Quotas & Balances</CardTitle>
          <CardDescription className="text-[#66736F]">Allocated versus utilized days for active calendar year</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-[#F4F4F4]">
              <TableRow className="border-b border-[#DFDFE2]">
                <TableHead className="text-[#66736F]">Employee</TableHead>
                <TableHead className="text-[#66736F]">Leave Type</TableHead>
                <TableHead className="text-[#66736F]">Allocated</TableHead>
                <TableHead className="text-[#66736F]">Used</TableHead>
                <TableHead className="text-[#66736F]">Pending</TableHead>
                <TableHead className="text-[#66736F]">Available</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {balancesLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-[#BEC0BF] text-xs">
                    Loading balances...
                  </TableCell>
                </TableRow>
              ) : balancesData?.results && balancesData.results.length > 0 ? (
                balancesData.results.map((bal: LeaveBalance) => (
                  <TableRow key={bal.id} className="border-b border-[#DFDFE2] hover:bg-[#F4F4F4]/50">
                    <TableCell className="font-medium text-[#202B28]">{bal.employee}</TableCell>
                    <TableCell className="text-[#202B28]">{bal.leave_type_name} ({bal.leave_type_code})</TableCell>
                    <TableCell className="text-[#202B28]">{bal.allocated_days} days</TableCell>
                    <TableCell className="text-[#B0413E] font-semibold">{bal.used_days} days</TableCell>
                    <TableCell className="text-[#B37D28]">{bal.pending_days} days</TableCell>
                    <TableCell className="text-[#3B7A57] font-bold">{bal.available_days} days</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-[#BEC0BF] text-xs">
                    No leave balance ledgers recorded.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
