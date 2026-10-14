"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { Payslip } from "@/types";
import { formatINR } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { FileText, Download, ShieldCheck } from "lucide-react";

export default function PayslipsPage() {
  const { data: payslipsData, isLoading } = useQuery<any>({
    queryKey: ["payslipsList"],
    queryFn: () => apiClient.get("/payslips/"),
  });

  const handleDownload = (id: string, number: string) => {
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
      .catch((err) => console.error("Download error:", err));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#202B28] tracking-tight">Payslip Archive</h1>
          <p className="text-xs text-[#66736F]">Cryptographically generated, tamper-proof employee salary slips</p>
        </div>
      </div>

      <Card className="bg-[#FEFEFE] border-[#DFDFE2]">
        <CardHeader>
          <CardTitle className="text-[#202B28]">Published Organization Payslips</CardTitle>
          <CardDescription className="text-[#66736F]">Generated from frozen payroll item snapshots</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-[#F4F4F4]">
              <TableRow className="border-b border-[#DFDFE2]">
                <TableHead className="text-[#66736F]">Payslip No.</TableHead>
                <TableHead className="text-[#66736F]">Employee</TableHead>
                <TableHead className="text-[#66736F]">Department</TableHead>
                <TableHead className="text-[#66736F]">Cycle</TableHead>
                <TableHead className="text-[#66736F]">Payable Days</TableHead>
                <TableHead className="text-[#66736F]">Gross</TableHead>
                <TableHead className="text-[#66736F]">Net Pay</TableHead>
                <TableHead className="text-right text-[#66736F]">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-[#BEC0BF] text-xs">
                    Loading payslips...
                  </TableCell>
                </TableRow>
              ) : payslipsData?.results && payslipsData.results.length > 0 ? (
                payslipsData.results.map((ps: Payslip) => (
                  <TableRow key={ps.id} className="border-b border-[#DFDFE2] hover:bg-[#F4F4F4]/50">
                    <TableCell className="font-mono text-xs font-semibold text-[#202B28]">
                      {ps.payslip_number}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-[#202B28]">{ps.employee_name}</div>
                      <div className="text-[11px] text-[#66736F]">{ps.employee_code}</div>
                    </TableCell>
                    <TableCell className="text-[#202B28]">{ps.department_name}</TableCell>
                    <TableCell className="text-[#202B28]">
                      {String(ps.month).padStart(2, '0')}/{ps.year}
                    </TableCell>
                    <TableCell className="text-xs text-[#202B28]">{ps.payable_days} days</TableCell>
                    <TableCell className="font-medium text-[#202B28]">{formatINR(ps.gross_earnings)}</TableCell>
                    <TableCell className="font-bold text-[#3B7A57]">{formatINR(ps.net_salary)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 text-xs gap-1.5 border-[#DFDFE2] text-[#202B28] hover:bg-[#F4F4F4]"
                        onClick={() => handleDownload(ps.id, ps.payslip_number)}
                      >
                        <Download className="w-3.5 h-3.5 text-[#708A83]" /> PDF
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-[#BEC0BF] text-xs">
                    No published payslips found. Publish an approved payroll cycle to generate payslips.
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
