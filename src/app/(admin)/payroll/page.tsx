"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { PayrollRun } from "@/types";
import { formatINR } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import {
  Calculator,
  Plus,
  Play,
  CheckCircle2,
  Send,
  Lock,
  Eye,
  AlertCircle,
  X,
  FileCheck,
} from "lucide-react";

export default function PayrollPage() {
  const queryClient = useQueryClient();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedRunId, setSelectedRunId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // New Run Form State
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [divisor, setDivisor] = useState("CALENDAR_DAYS");

  const { data: runsData, isLoading } = useQuery<any>({
    queryKey: ["payrollRuns"],
    queryFn: () => apiClient.get("/payroll/runs"),
  });

  const { data: runDetail, isLoading: detailLoading } = useQuery<any>({
    queryKey: ["payrollRunDetail", selectedRunId],
    queryFn: () => apiClient.get(`/payroll/runs/${selectedRunId}`),
    enabled: !!selectedRunId,
  });

  const createRunMutation = useMutation({
    mutationFn: (data: any) => apiClient.post("/payroll/runs", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payrollRuns"] });
      setShowCreateModal(false);
      setErrorMsg(null);
    },
    onError: (err: any) => setErrorMsg(err.message || "Failed to create run."),
  });

  const calculateMutation = useMutation({
    mutationFn: (id: string) => apiClient.post(`/payroll/runs/${id}/calculate`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payrollRuns"] });
      if (selectedRunId) queryClient.invalidateQueries({ queryKey: ["payrollRunDetail", selectedRunId] });
    },
    onError: (err: any) => setErrorMsg(err.message || "Calculation failed."),
  });

  const approveMutation = useMutation({
    mutationFn: (id: string) => apiClient.post(`/payroll/runs/${id}/approve`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payrollRuns"] });
      if (selectedRunId) queryClient.invalidateQueries({ queryKey: ["payrollRunDetail", selectedRunId] });
    },
    onError: (err: any) => setErrorMsg(err.message || "Approval failed."),
  });

  const publishMutation = useMutation({
    mutationFn: (id: string) => apiClient.post(`/payroll/runs/${id}/publish`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payrollRuns"] });
      if (selectedRunId) queryClient.invalidateQueries({ queryKey: ["payrollRunDetail", selectedRunId] });
    },
    onError: (err: any) => setErrorMsg(err.message || "Publishing failed."),
  });

  const closeMutation = useMutation({
    mutationFn: (id: string) => apiClient.post(`/payroll/runs/${id}/close`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payrollRuns"] });
      if (selectedRunId) queryClient.invalidateQueries({ queryKey: ["payrollRunDetail", selectedRunId] });
    },
    onError: (err: any) => setErrorMsg(err.message || "Close failed."),
  });

  const handleCreateRun = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Compute period start and end
    const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
    const lastDay = new Date(year, month, 0).getDate();
    const endDate = `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;

    createRunMutation.mutate({
      month: Number(month),
      year: Number(year),
      period_start: startDate,
      period_end: endDate,
      calculation_divisor_type: divisor,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#202B28] tracking-tight">Deterministic Payroll Engine</h1>
          <p className="text-xs text-[#66736F]">Calculate salaries, resolve exceptions, and distribute cryptographically verified payslips</p>
        </div>

        <Button size="sm" onClick={() => setShowCreateModal(true)} className="gap-1.5 bg-[#476E66] hover:bg-[#3B5C55] text-[#FEFEFE]">
          <Plus className="w-4 h-4" /> Initialize Payroll Cycle
        </Button>
      </div>

      {errorMsg && (
        <div className="p-4 bg-[#FBEBEB] border border-[#B0413E]/30 rounded-xl flex items-center justify-between text-xs text-[#B0413E]">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-[#B0413E] shrink-0" />
            <span>{errorMsg}</span>
          </div>
          <button onClick={() => setErrorMsg(null)} className="text-[#66736F] hover:text-[#202B28]">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Payroll Runs Master Table */}
      <Card className="bg-[#FEFEFE] border-[#DFDFE2]">
        <CardHeader>
          <CardTitle className="text-[#202B28]">Payroll Processing Cycles</CardTitle>
          <CardDescription className="text-[#66736F]">Multi-tenant frozen cycles governed by the state machine</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-[#F4F4F4]">
              <TableRow className="border-b border-[#DFDFE2]">
                <TableHead className="text-[#66736F]">Period</TableHead>
                <TableHead className="text-[#66736F]">Divisor</TableHead>
                <TableHead className="text-[#66736F]">Employees</TableHead>
                <TableHead className="text-[#66736F]">Gross Liabilities</TableHead>
                <TableHead className="text-[#66736F]">Deductions</TableHead>
                <TableHead className="text-[#66736F]">Net Payable</TableHead>
                <TableHead className="text-[#66736F]">State</TableHead>
                <TableHead className="text-right text-[#66736F]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-[#BEC0BF] text-xs">
                    Loading payroll cycles...
                  </TableCell>
                </TableRow>
              ) : runsData?.results && runsData.results.length > 0 ? (
                runsData.results.map((run: PayrollRun) => (
                  <TableRow key={run.id} className="border-b border-[#DFDFE2] hover:bg-[#F4F4F4]/50">
                    <TableCell className="font-bold text-[#202B28]">
                      {String(run.month).padStart(2, '0')}/{run.year}
                    </TableCell>
                    <TableCell className="text-xs text-[#202B28]">{run.calculation_divisor_type}</TableCell>
                    <TableCell className="font-medium text-[#202B28]">{run.items_count} staff</TableCell>
                    <TableCell className="font-semibold text-[#202B28]">{formatINR(run.total_gross)}</TableCell>
                    <TableCell className="text-[#B0413E]">{formatINR(run.total_deductions)}</TableCell>
                    <TableCell className="font-extrabold text-[#3B7A57]">{formatINR(run.total_net)}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          run.state === "APPROVED"
                            ? "success"
                            : run.state === "PUBLISHED"
                            ? "default"
                            : run.state === "CLOSED"
                            ? "secondary"
                            : run.state === "REVIEW"
                            ? "warning"
                            : "outline"
                        }
                      >
                        {run.state}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-1.5">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 px-2 text-xs text-[#202B28] hover:bg-[#F4F4F4]"
                        onClick={() => setSelectedRunId(run.id)}
                      >
                        <Eye className="w-3.5 h-3.5 mr-1 text-[#708A83]" /> View Details
                      </Button>

                      {run.state === "DRAFT" || run.state === "REVIEW" ? (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 text-xs bg-[#F4F4F4] text-[#476E66] hover:bg-[#DFDFE2] border-[#DFDFE2]"
                          onClick={() => calculateMutation.mutate(run.id)}
                          disabled={calculateMutation.isPending}
                        >
                          <Play className="w-3.5 h-3.5 mr-1 text-[#476E66]" /> Calculate
                        </Button>
                      ) : null}

                      {run.state === "REVIEW" && (
                        <Button
                          size="sm"
                          className="h-8 text-xs bg-[#3B7A57] hover:bg-[#2E5E43] text-[#FEFEFE]"
                          onClick={() => approveMutation.mutate(run.id)}
                          disabled={approveMutation.isPending}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-[#FEFEFE]" /> Approve
                        </Button>
                      )}

                      {run.state === "APPROVED" && (
                        <Button
                          size="sm"
                          className="h-8 text-xs bg-[#476E66] hover:bg-[#3B5C55] text-[#FEFEFE]"
                          onClick={() => publishMutation.mutate(run.id)}
                          disabled={publishMutation.isPending}
                        >
                          <Send className="w-3.5 h-3.5 mr-1 text-[#FEFEFE]" /> Publish Payslips
                        </Button>
                      )}

                      {run.state === "PUBLISHED" && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 text-xs text-[#202B28] border-[#DFDFE2] hover:bg-[#F4F4F4]"
                          onClick={() => closeMutation.mutate(run.id)}
                          disabled={closeMutation.isPending}
                        >
                          <Lock className="w-3.5 h-3.5 mr-1 text-[#708A83]" /> Close Period
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-[#BEC0BF] text-xs">
                    No payroll cycles found. Click "Initialize Payroll Cycle" to begin.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Initialize Run Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-[#202B28]/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FEFEFE] border border-[#DFDFE2] rounded-xl shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-[#DFDFE2]">
              <h3 className="font-bold text-lg text-[#202B28]">Initialize Payroll Cycle</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-[#66736F] hover:text-[#202B28]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRun} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#202B28]">Month *</label>
                  <select
                    className="w-full rounded-md border border-[#DFDFE2] text-sm p-2 bg-[#FEFEFE] text-[#202B28] focus:outline-none focus:ring-1 focus:ring-[#476E66]"
                    value={month}
                    onChange={(e) => setMonth(Number(e.target.value))}
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((m) => (
                      <option key={m} value={m}>
                        {new Date(2026, m - 1).toLocaleString('default', { month: 'long' })}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#202B28]">Year *</label>
                  <Input type="number" required value={year} onChange={(e) => setYear(Number(e.target.value))} />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#202B28]">Calculation Divisor Policy *</label>
                <select
                  className="w-full rounded-md border border-[#DFDFE2] text-sm p-2 bg-[#FEFEFE] text-[#202B28] focus:outline-none focus:ring-1 focus:ring-[#476E66]"
                  value={divisor}
                  onChange={(e) => setDivisor(e.target.value)}
                >
                  <option value="CALENDAR_DAYS">Actual Calendar Days (28, 30, or 31)</option>
                  <option value="FIXED_30">Fixed 30-Day Divisor</option>
                  <option value="ACTUAL_WORKING_DAYS">Actual Working Days (Excluding Weekends)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#DFDFE2]">
                <Button type="button" variant="outline" className="border-[#DFDFE2] text-[#202B28] hover:bg-[#F4F4F4]" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createRunMutation.isPending} className="bg-[#476E66] hover:bg-[#3B5C55] text-[#FEFEFE]">
                  {createRunMutation.isPending ? "Initializing..." : "Create Cycle"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Selected Run Detailed Items Drawer / Modal */}
      {selectedRunId && runDetail && (
        <div className="fixed inset-0 z-50 bg-[#202B28]/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FEFEFE] border border-[#DFDFE2] rounded-xl shadow-2xl max-w-4xl w-full p-6 space-y-4 max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center pb-2 border-b border-[#DFDFE2]">
              <div>
                <h3 className="font-bold text-lg text-[#202B28]">
                  Payroll Cycle {String(runDetail.month).padStart(2, '0')}/{runDetail.year} Items
                </h3>
                <p className="text-xs text-[#66736F]">
                  Status: <Badge variant="outline">{runDetail.state}</Badge> • Gross: {formatINR(runDetail.total_gross)} • Net: {formatINR(runDetail.total_net)}
                </p>
              </div>
              <button onClick={() => setSelectedRunId(null)} className="text-[#66736F] hover:text-[#202B28]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1">
              <Table>
                <TableHeader className="bg-[#F4F4F4]">
                  <TableRow className="border-b border-[#DFDFE2]">
                    <TableHead className="text-[#66736F]">Employee</TableHead>
                    <TableHead className="text-[#66736F]">Payable / LOP Days</TableHead>
                    <TableHead className="text-[#66736F]">Overtime</TableHead>
                    <TableHead className="text-[#66736F]">Gross</TableHead>
                    <TableHead className="text-[#66736F]">Deductions</TableHead>
                    <TableHead className="text-[#66736F]">Net Salary</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {runDetail.items?.map((item: any) => (
                    <TableRow key={item.id} className="border-b border-[#DFDFE2] hover:bg-[#F4F4F4]/50">
                      <TableCell className="font-semibold text-[#202B28]">
                        {item.employee_name} ({item.employee_code})
                        <div className="text-[10px] text-[#66736F]">{item.designation}</div>
                      </TableCell>
                      <TableCell className="text-xs text-[#202B28]">
                        {item.payable_days} days (LOP: {item.lop_days})
                      </TableCell>
                      <TableCell className="text-xs font-mono text-[#202B28]">{item.overtime_hours} hrs</TableCell>
                      <TableCell className="font-medium text-[#202B28]">{formatINR(item.gross_earnings)}</TableCell>
                      <TableCell className="text-[#B0413E] font-medium">{formatINR(item.total_deductions)}</TableCell>
                      <TableCell className="font-bold text-[#3B7A57]">{formatINR(item.net_salary)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex justify-end pt-2 border-t border-[#DFDFE2]">
              <Button onClick={() => setSelectedRunId(null)} className="bg-[#476E66] hover:bg-[#3B5C55] text-[#FEFEFE]">Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
