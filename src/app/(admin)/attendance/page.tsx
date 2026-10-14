"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { AttendanceSummary } from "@/types";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { CheckCircle2, XCircle, Clock, CalendarCheck } from "lucide-react";

export default function AttendancePage() {
  const queryClient = useQueryClient();
  const [selectedDate, setSelectedDate] = useState("");

  const { data: attendanceData, isLoading } = useQuery<any>({
    queryKey: ["attendanceList", selectedDate],
    queryFn: () => apiClient.get("/attendance/", selectedDate ? { date: selectedDate } : undefined),
  });

  const { data: correctionsData } = useQuery<any>({
    queryKey: ["attendanceCorrections"],
    queryFn: () => apiClient.get("/attendance/corrections"),
  });

  const approveCorrectionMutation = useMutation({
    mutationFn: (id: string) => apiClient.post(`/attendance/corrections/${id}/approve`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendanceCorrections"] });
      queryClient.invalidateQueries({ queryKey: ["attendanceList"] });
    },
  });

  const rejectCorrectionMutation = useMutation({
    mutationFn: (id: string) => apiClient.post(`/attendance/corrections/${id}/reject`, { rejection_reason: "Rejected by Administrator" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendanceCorrections"] });
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#202B28] tracking-tight">Attendance Management</h1>
          <p className="text-xs text-[#66736F]">Inspect daily attendance logs, work hours, and approve regularizations</p>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="date"
            className="border border-[#DFDFE2] rounded-md text-xs px-3 py-1.5 bg-[#FEFEFE] text-[#202B28] shadow-xs"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
          {selectedDate && (
            <Button size="sm" variant="ghost" onClick={() => setSelectedDate("")} className="text-[#66736F] hover:bg-[#F4F4F4]">
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Pending Regularizations Queue */}
      {correctionsData?.results && correctionsData.results.filter((c: any) => c.status === "PENDING").length > 0 && (
        <Card className="border-[#B37D28]/30 bg-[#FCF7EE]">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-[#B37D28] flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#B37D28]" /> Pending Regularization Requests
            </CardTitle>
            <CardDescription className="text-[#66736F]">
              Employees requested adjustments to their clock punch times
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-[#FCF7EE] border-b border-[#B37D28]/20">
                <TableRow>
                  <TableHead className="text-[#66736F]">Employee</TableHead>
                  <TableHead className="text-[#66736F]">Date</TableHead>
                  <TableHead className="text-[#66736F]">Requested In / Out</TableHead>
                  <TableHead className="text-[#66736F]">Reason</TableHead>
                  <TableHead className="text-right text-[#66736F]">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {correctionsData.results
                  .filter((c: any) => c.status === "PENDING")
                  .map((corr: any) => (
                    <TableRow key={corr.id} className="border-b border-[#B37D28]/10 hover:bg-[#FCF7EE]/80">
                      <TableCell className="font-semibold text-[#202B28]">
                        {corr.employee_name} ({corr.employee_code})
                      </TableCell>
                      <TableCell className="text-[#202B28]">{corr.date}</TableCell>
                      <TableCell className="text-xs text-[#202B28]">
                        {new Date(corr.requested_clock_in).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -{" "}
                        {new Date(corr.requested_clock_out).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </TableCell>
                      <TableCell className="text-xs text-[#66736F]">{corr.reason}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs border-[#3B7A57] text-[#3B7A57] hover:bg-[#EBF4EF]"
                          onClick={() => approveCorrectionMutation.mutate(corr.id)}
                          disabled={approveCorrectionMutation.isPending}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-[#3B7A57]" /> Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs border-[#B0413E] text-[#B0413E] hover:bg-[#FBEBEB]"
                          onClick={() => rejectCorrectionMutation.mutate(corr.id)}
                          disabled={rejectCorrectionMutation.isPending}
                        >
                          <XCircle className="w-3.5 h-3.5 mr-1 text-[#B0413E]" /> Reject
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Daily Attendance Summaries */}
      <Card className="bg-[#FEFEFE] border-[#DFDFE2]">
        <CardHeader>
          <CardTitle className="text-[#202B28]">Attendance Log Summaries</CardTitle>
          <CardDescription className="text-[#66736F]">Daily punch records and calculated working durations</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-[#F4F4F4]">
              <TableRow className="border-b border-[#DFDFE2]">
                <TableHead className="text-[#66736F]">Date</TableHead>
                <TableHead className="text-[#66736F]">Employee</TableHead>
                <TableHead className="text-[#66736F]">First In</TableHead>
                <TableHead className="text-[#66736F]">Last Out</TableHead>
                <TableHead className="text-[#66736F]">Work Hours</TableHead>
                <TableHead className="text-[#66736F]">Overtime</TableHead>
                <TableHead className="text-[#66736F]">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-[#BEC0BF] text-xs">
                    Loading attendance...
                  </TableCell>
                </TableRow>
              ) : attendanceData?.results && attendanceData.results.length > 0 ? (
                attendanceData.results.map((item: AttendanceSummary) => (
                  <TableRow key={item.id} className="border-b border-[#DFDFE2] hover:bg-[#F4F4F4]/50">
                    <TableCell className="font-medium text-[#202B28]">{item.date}</TableCell>
                    <TableCell>
                      <div className="font-semibold text-[#202B28]">{item.employee_name}</div>
                      <div className="text-[11px] text-[#66736F]">{item.employee_code}</div>
                    </TableCell>
                    <TableCell className="text-xs text-[#202B28]">
                      {item.first_clock_in
                        ? new Date(item.first_clock_in).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        : "—"}
                      {item.is_late && <Badge variant="warning" className="ml-2 text-[10px]">Late</Badge>}
                    </TableCell>
                    <TableCell className="text-xs text-[#202B28]">
                      {item.last_clock_out
                        ? new Date(item.last_clock_out).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        : "—"}
                    </TableCell>
                    <TableCell className="font-semibold text-[#202B28]">{item.work_hours} hrs</TableCell>
                    <TableCell className="text-xs text-[#66736F]">
                      {item.overtime_minutes > 0 ? `${Math.round(item.overtime_minutes / 60 * 10) / 10} hrs` : "—"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          item.status === "PRESENT"
                            ? "success"
                            : item.status === "HALF_DAY"
                            ? "warning"
                            : item.status === "PAID_LEAVE"
                            ? "secondary"
                            : "destructive"
                        }
                      >
                        {item.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-[#BEC0BF] text-xs">
                    No attendance records for the selected criteria.
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
