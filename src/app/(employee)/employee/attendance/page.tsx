"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { AttendanceSummary } from "@/types";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Clock, Plus, X, AlertCircle } from "lucide-react";

export default function MyAttendancePage() {
  const queryClient = useQueryClient();
  const [showCorrectionModal, setShowCorrectionModal] = useState(false);
  const [selectedSummary, setSelectedSummary] = useState<AttendanceSummary | null>(null);
  const [reqIn, setReqIn] = useState("09:00");
  const [reqOut, setReqOut] = useState("18:00");
  const [reason, setReason] = useState("");
  const [formMsg, setFormMsg] = useState<string | null>(null);

  const { data: attendanceData, isLoading } = useQuery<any>({
    queryKey: ["myAttendanceSummary"],
    queryFn: () => apiClient.get("/attendance/"),
  });

  const correctionMutation = useMutation({
    mutationFn: (data: any) => apiClient.post("/attendance/corrections", data),
    onSuccess: () => {
      setShowCorrectionModal(false);
      setFormMsg(null);
      setReason("");
      queryClient.invalidateQueries({ queryKey: ["myAttendanceSummary"] });
    },
    onError: (err: any) => setFormMsg(err.message || "Failed to submit request."),
  });

  const handleOpenCorrection = (summary: AttendanceSummary) => {
    setSelectedSummary(summary);
    setShowCorrectionModal(true);
  };

  const handleSubmitCorrection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSummary) return;

    const inDt = `${selectedSummary.date}T${reqIn}:00Z`;
    const outDt = `${selectedSummary.date}T${reqOut}:00Z`;

    correctionMutation.mutate({
      summary: selectedSummary.id,
      requested_clock_in: inDt,
      requested_clock_out: outDt,
      reason,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#202B28] tracking-tight">My Attendance History</h1>
        <p className="text-xs text-[#66736F]">View personal clock-in and clock-out punch timestamps and regularize missed punches</p>
      </div>

      <Card className="bg-[#FEFEFE] border-[#DFDFE2]">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-[#F4F4F4]">
              <TableRow className="border-b border-[#DFDFE2]">
                <TableHead className="text-[#66736F]">Date</TableHead>
                <TableHead className="text-[#66736F]">First In</TableHead>
                <TableHead className="text-[#66736F]">Last Out</TableHead>
                <TableHead className="text-[#66736F]">Hours Worked</TableHead>
                <TableHead className="text-[#66736F]">Status</TableHead>
                <TableHead className="text-right text-[#66736F]">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-[#BEC0BF] text-xs">
                    Loading attendance records...
                  </TableCell>
                </TableRow>
              ) : attendanceData?.results && attendanceData.results.length > 0 ? (
                attendanceData.results.map((item: AttendanceSummary) => (
                  <TableRow key={item.id} className="border-b border-[#DFDFE2] hover:bg-[#F4F4F4]/50">
                    <TableCell className="font-semibold text-[#202B28]">{item.date}</TableCell>
                    <TableCell className="text-xs text-[#202B28]">
                      {item.first_clock_in
                        ? new Date(item.first_clock_in).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                        : "—"}
                      {item.is_late && <Badge variant="warning" className="ml-1.5 text-[10px]">Late</Badge>}
                    </TableCell>
                    <TableCell className="text-xs text-[#202B28]">
                      {item.last_clock_out
                        ? new Date(item.last_clock_out).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                        : "—"}
                    </TableCell>
                    <TableCell className="font-semibold text-[#202B28]">{item.work_hours} hrs</TableCell>
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
                    <TableCell className="text-right">
                      {!item.is_locked && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 text-xs text-[#476E66] hover:text-[#3B5C55] hover:bg-[#F4F4F4]"
                          onClick={() => handleOpenCorrection(item)}
                        >
                          Request Regularization
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-[#BEC0BF] text-xs">
                    No punch records found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Regularization Modal */}
      {showCorrectionModal && selectedSummary && (
        <div className="fixed inset-0 z-50 bg-[#202B28]/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FEFEFE] border border-[#DFDFE2] rounded-xl shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-[#DFDFE2]">
              <h3 className="font-bold text-base text-[#202B28]">
                Regularize Attendance for {selectedSummary.date}
              </h3>
              <button onClick={() => setShowCorrectionModal(false)} className="text-[#66736F] hover:text-[#202B28]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitCorrection} className="space-y-4">
              {formMsg && (
                <div className="p-3 bg-[#FBEBEB] border border-[#B0413E]/30 rounded-lg flex items-center gap-2 text-xs text-[#B0413E]">
                  <AlertCircle className="w-4 h-4 shrink-0 text-[#B0413E]" />
                  <span>{formMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#202B28]">Actual Clock-In *</label>
                  <Input type="time" required value={reqIn} onChange={(e) => setReqIn(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#202B28]">Actual Clock-Out *</label>
                  <Input type="time" required value={reqOut} onChange={(e) => setReqOut(e.target.value)} />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#202B28]">Reason for Regularization *</label>
                <textarea
                  required
                  rows={3}
                  className="w-full rounded-md border border-[#DFDFE2] text-xs p-2.5 focus:outline-none focus:ring-1 focus:ring-[#476E66] text-[#202B28] bg-[#FEFEFE]"
                  placeholder="e.g. Card reader was offline / Client meeting off-site"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#DFDFE2]">
                <Button type="button" variant="outline" className="border-[#DFDFE2] text-[#202B28] hover:bg-[#F4F4F4]" onClick={() => setShowCorrectionModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={correctionMutation.isPending} className="bg-[#476E66] hover:bg-[#3B5C55] text-[#FEFEFE]">
                  {correctionMutation.isPending ? "Submitting..." : "Submit Request"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
