"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { formatINR } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Download, BarChart3, FileSpreadsheet } from "lucide-react";

export default function ReportsPage() {
  const [selectedRunId, setSelectedRunId] = useState<string>("");

  const { data: runsData } = useQuery<any>({
    queryKey: ["payrollRuns"],
    queryFn: () => apiClient.get("/payroll/runs"),
  });

  const { data: reportData, isLoading } = useQuery<any>({
    queryKey: ["payrollReport", selectedRunId],
    queryFn: () => apiClient.get("/reports/payroll", selectedRunId ? { payroll_run: selectedRunId } : undefined),
    enabled: !!selectedRunId,
  });

  const handleExportCSV = () => {
    if (!selectedRunId) return;
    const url = apiClient.getDownloadUrl(`/reports/payroll/export?payroll_run=${selectedRunId}`);
    window.open(url, "_blank");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#202B28] tracking-tight">Reports & Registers</h1>
          <p className="text-xs text-[#66736F]">Audit-ready monthly payroll registers and statutory deduction reports</p>
        </div>

        {selectedRunId && (
          <Button size="sm" variant="outline" onClick={handleExportCSV} className="gap-1.5 border-[#DFDFE2] text-[#202B28] hover:bg-[#F4F4F4]">
            <Download className="w-4 h-4 text-[#708A83]" /> Export Register CSV
          </Button>
        )}
      </div>

      {/* Select Run */}
      <Card className="bg-[#FEFEFE] border-[#DFDFE2]">
        <CardContent className="p-4 flex items-center gap-4">
          <label className="text-xs font-semibold text-[#202B28] whitespace-nowrap">Select Payroll Cycle:</label>
          <select
            className="rounded-md border border-[#DFDFE2] text-sm p-2 bg-[#FEFEFE] text-[#202B28] max-w-xs w-full focus:outline-none focus:ring-1 focus:ring-[#476E66]"
            value={selectedRunId}
            onChange={(e) => setSelectedRunId(e.target.value)}
          >
            <option value="">-- Choose a Cycle --</option>
            {runsData?.results?.map((r: any) => (
              <option key={r.id} value={r.id}>
                Cycle {r.month}/{r.year} ({r.state}) — {formatINR(r.total_net)}
              </option>
            ))}
          </select>
        </CardContent>
      </Card>

      {/* Report Table */}
      {selectedRunId && (
        <Card className="bg-[#FEFEFE] border-[#DFDFE2]">
          <CardHeader>
            <CardTitle className="text-[#202B28]">Monthly Payroll Register</CardTitle>
            <CardDescription className="text-[#66736F]">Line item audit breakdown of gross and deductions</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-[#F4F4F4]">
                <TableRow className="border-b border-[#DFDFE2]">
                  <TableHead className="text-[#66736F]">Code</TableHead>
                  <TableHead className="text-[#66736F]">Employee</TableHead>
                  <TableHead className="text-[#66736F]">Department</TableHead>
                  <TableHead className="text-[#66736F]">Calendar Days</TableHead>
                  <TableHead className="text-[#66736F]">Payable Days</TableHead>
                  <TableHead className="text-[#66736F]">LOP Days</TableHead>
                  <TableHead className="text-[#66736F]">Gross</TableHead>
                  <TableHead className="text-[#66736F]">Deductions</TableHead>
                  <TableHead className="text-[#66736F]">Net Pay</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-[#BEC0BF] text-xs">
                      Loading register...
                    </TableCell>
                  </TableRow>
                ) : reportData?.items && reportData.items.length > 0 ? (
                  reportData.items.map((item: any, idx: number) => (
                    <TableRow key={idx} className="border-b border-[#DFDFE2] hover:bg-[#F4F4F4]/50">
                      <TableCell className="font-bold text-[#202B28]">{item.employee_code}</TableCell>
                      <TableCell className="font-medium text-[#202B28]">{item.employee_name}</TableCell>
                      <TableCell className="text-[#202B28]">{item.department}</TableCell>
                      <TableCell className="text-[#202B28]">{item.calendar_days}</TableCell>
                      <TableCell className="text-[#202B28]">{item.payable_days}</TableCell>
                      <TableCell className="text-[#B0413E]">{item.lop_days}</TableCell>
                      <TableCell className="font-semibold text-[#202B28]">{formatINR(item.gross_earnings)}</TableCell>
                      <TableCell className="text-[#B0413E]">{formatINR(item.total_deductions)}</TableCell>
                      <TableCell className="font-extrabold text-[#3B7A57]">{formatINR(item.net_salary)}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-[#BEC0BF] text-xs">
                      No items for selected cycle.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
