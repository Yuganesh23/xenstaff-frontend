"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { Employee, Branch, Department } from "@/types";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Plus, Download, Search, AlertCircle, X, Mail, Copy, Check, ShieldCheck } from "lucide-react";

export default function EmployeesPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [inviteInfo, setInviteInfo] = useState<{ name: string; email: string; url: string } | null>(null);
  const [copied, setCopied] = useState(false);

  // Form State
  const [code, setCode] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [designation, setDesignation] = useState("");
  const [joiningDate, setJoiningDate] = useState("2026-04-01");
  const [branchId, setBranchId] = useState("");
  const [departmentId, setDepartmentId] = useState("");

  const { data: employeesData, isLoading } = useQuery<any>({
    queryKey: ["employeesList", search],
    queryFn: () => apiClient.get("/employees/", { search }),
  });

  const { data: branchesData } = useQuery<any>({
    queryKey: ["branchesList"],
    queryFn: () => apiClient.get("/organizations/branches"),
  });

  const { data: departmentsData } = useQuery<any>({
    queryKey: ["departmentsList"],
    queryFn: () => apiClient.get("/organizations/departments"),
  });

  const createMutation = useMutation({
    mutationFn: (newEmp: any) => apiClient.post("/employees/", newEmp),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["employeesList"] });
      setShowModal(false);
      resetForm();
      if (data?.activation_url) {
        setInviteInfo({
          name: `${data.first_name} ${data.last_name || ""}`.trim(),
          email: data.email,
          url: data.activation_url,
        });
      }
    },
    onError: (err: any) => {
      setFormError(err.message || "Failed to create employee.");
    },
  });

  const inviteMutation = useMutation({
    mutationFn: (empId: string) => apiClient.post<any>("/auth/invite", { employee_id: empId }),
    onSuccess: (data: any, empId: string) => {
      const emp = employeesData?.results?.find((e: Employee) => e.id === empId);
      setInviteInfo({
        name: emp?.full_name || "Employee",
        email: data.recipient || emp?.email || "",
        url: data.activation_url,
      });
    },
    onError: (err: any) => {
      alert(err.message || "Failed to send invitation.");
    },
  });

  const handleCopyLink = () => {
    if (inviteInfo?.url) {
      navigator.clipboard.writeText(inviteInfo.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const resetForm = () => {
    setCode("");
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhone("");
    setDesignation("");
    setFormError(null);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const bId = branchId || branchesData?.results?.[0]?.id;
    const dId = departmentId || departmentsData?.results?.[0]?.id;

    if (!bId || !dId) {
      setFormError("Branch and Department are required.");
      return;
    }

    createMutation.mutate({
      employee_code: code,
      first_name: firstName,
      last_name: lastName,
      email,
      phone,
      designation,
      joining_date: joiningDate,
      branch: bId,
      department: dId,
    });
  };

  const handleExportCSV = () => {
    const url = apiClient.getDownloadUrl("/employees/export");
    window.open(url, "_blank");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#202B28] tracking-tight">Employee Directory</h1>
          <p className="text-xs text-[#66736F]">Manage employee master records, designations and branch assignments</p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExportCSV} className="gap-1.5 border-[#DFDFE2] text-[#202B28] hover:bg-[#F4F4F4]">
            <Download className="w-4 h-4 text-[#708A83]" /> Export CSV
          </Button>
          <Button size="sm" onClick={() => setShowModal(true)} className="gap-1.5 bg-[#476E66] hover:bg-[#3B5C55] text-[#FEFEFE]">
            <Plus className="w-4 h-4" /> Add Employee
          </Button>
        </div>
      </div>

      {/* Search Filter */}
      <Card className="bg-[#FEFEFE] border-[#DFDFE2]">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 max-w-md">
            <Search className="w-4 h-4 text-[#708A83]" />
            <Input
              placeholder="Search by employee code, name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border-0 shadow-none focus-visible:ring-0 text-sm text-[#202B28] placeholder-[#BEC0BF]"
            />
          </div>
        </CardContent>
      </Card>

      {/* Employees Table */}
      <Card className="bg-[#FEFEFE] border-[#DFDFE2]">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-[#F4F4F4]">
              <TableRow className="border-b border-[#DFDFE2]">
                <TableHead className="text-[#66736F]">Code</TableHead>
                <TableHead className="text-[#66736F]">Name</TableHead>
                <TableHead className="text-[#66736F]">Department</TableHead>
                <TableHead className="text-[#66736F]">Branch</TableHead>
                <TableHead className="text-[#66736F]">Designation</TableHead>
                <TableHead className="text-[#66736F]">Joining Date</TableHead>
                <TableHead className="text-[#66736F]">Status</TableHead>
                <TableHead className="text-right text-[#66736F]">Security & Onboarding</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-[#BEC0BF] text-xs">
                    Loading directory...
                  </TableCell>
                </TableRow>
              ) : employeesData?.results && employeesData.results.length > 0 ? (
                employeesData.results.map((emp: Employee) => (
                  <TableRow key={emp.id} className="border-b border-[#DFDFE2] hover:bg-[#F4F4F4]/50">
                    <TableCell className="font-bold text-[#202B28]">{emp.employee_code}</TableCell>
                    <TableCell>
                      <div className="font-medium text-[#202B28]">{emp.full_name}</div>
                      <div className="text-xs text-[#66736F]">{emp.email}</div>
                    </TableCell>
                    <TableCell className="text-[#202B28]">{emp.department_name}</TableCell>
                    <TableCell className="text-[#202B28]">{emp.branch_name}</TableCell>
                    <TableCell className="text-[#202B28]">{emp.designation}</TableCell>
                    <TableCell className="text-[#202B28]">{emp.joining_date}</TableCell>
                    <TableCell>
                      <Badge variant={emp.employment_status === "ACTIVE" ? "success" : "secondary"}>
                        {emp.employment_status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => inviteMutation.mutate(emp.id)}
                        disabled={inviteMutation.isPending}
                        className="text-xs gap-1.5 h-8 border-[#DFDFE2] text-[#476E66] hover:bg-[#F4F4F4]"
                      >
                        <Mail className="w-3.5 h-3.5 text-[#708A83]" />
                        Send Invite
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-[#BEC0BF] text-xs">
                    No employee records found. Click "Add Employee" to create one.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Employee Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-[#202B28]/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FEFEFE] border border-[#DFDFE2] rounded-xl shadow-xl max-w-lg w-full p-6 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-[#DFDFE2]">
              <h3 className="font-bold text-lg text-[#202B28]">Add New Employee</h3>
              <button onClick={() => setShowModal(false)} className="text-[#66736F] hover:text-[#202B28]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              {formError && (
                <div className="p-3 bg-[#FBEBEB] border border-[#B0413E]/30 rounded-lg flex items-center gap-2 text-xs text-[#B0413E]">
                  <AlertCircle className="w-4 h-4 shrink-0 text-[#B0413E]" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#202B28]">Employee Code *</label>
                  <Input required placeholder="EMP-001" value={code} onChange={(e) => setCode(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#202B28]">Joining Date *</label>
                  <Input type="date" required value={joiningDate} onChange={(e) => setJoiningDate(e.target.value)} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#202B28]">First Name *</label>
                  <Input required placeholder="Rajesh" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#202B28]">Last Name</label>
                  <Input placeholder="Sundar" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#202B28]">Work Email *</label>
                  <Input type="email" required placeholder="rajesh@acme.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#202B28]">Phone</label>
                  <Input placeholder="+91 9876543210" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#202B28]">Designation *</label>
                <Input required placeholder="Software Engineer" value={designation} onChange={(e) => setDesignation(e.target.value)} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#202B28]">Branch *</label>
                  <select
                    className="w-full rounded-md border border-[#DFDFE2] text-sm p-2 bg-[#FEFEFE] text-[#202B28] focus:outline-none focus:ring-1 focus:ring-[#476E66]"
                    value={branchId}
                    onChange={(e) => setBranchId(e.target.value)}
                  >
                    {branchesData?.results?.map((b: Branch) => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#202B28]">Department *</label>
                  <select
                    className="w-full rounded-md border border-[#DFDFE2] text-sm p-2 bg-[#FEFEFE] text-[#202B28] focus:outline-none focus:ring-1 focus:ring-[#476E66]"
                    value={departmentId}
                    onChange={(e) => setDepartmentId(e.target.value)}
                  >
                    {departmentsData?.results?.map((d: Department) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#DFDFE2]">
                <Button type="button" variant="outline" className="border-[#DFDFE2] text-[#202B28] hover:bg-[#F4F4F4]" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createMutation.isPending} className="bg-[#476E66] hover:bg-[#3B5C55] text-[#FEFEFE]">
                  {createMutation.isPending ? "Saving..." : "Create Employee"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Employee Activation & Invite Modal */}
      {inviteInfo && (
        <div className="fixed inset-0 z-50 bg-[#202B28]/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FEFEFE] border border-[#DFDFE2] rounded-xl shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-[#DFDFE2]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#3B7A57]" />
                <h3 className="font-bold text-lg text-[#202B28]">Activation Link Ready</h3>
              </div>
              <button onClick={() => setInviteInfo(null)} className="text-[#66736F] hover:text-[#202B28]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-[#EBF4EF] border border-[#3B7A57]/30 rounded-lg text-xs text-[#3B7A57] space-y-1">
                <div className="font-semibold flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-[#3B7A57]" />
                  Invitation dispatched to {inviteInfo.name}
                </div>
                <p className="text-[11px] text-[#202B28]">
                  An email has been sent to <strong>{inviteInfo.email}</strong> with secure activation instructions.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#202B28]">Direct Activation Link (48h Validity)</label>
                <div className="flex gap-2">
                  <Input
                    readOnly
                    value={inviteInfo.url}
                    className="text-xs bg-[#F4F4F4] border-[#DFDFE2] font-mono select-all text-[#202B28]"
                  />
                  <Button
                    type="button"
                    onClick={handleCopyLink}
                    className="shrink-0 gap-1 bg-[#476E66] hover:bg-[#3B5C55] text-[#FEFEFE] text-xs"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-[#FEFEFE]" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? "Copied!" : "Copy"}
                  </Button>
                </div>
                <p className="text-[10px] text-[#66736F]">
                  The employee can open this link to set their confidential password.
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-[#DFDFE2]">
              <Button onClick={() => setInviteInfo(null)} className="bg-[#476E66] hover:bg-[#3B5C55] text-[#FEFEFE] text-xs">
                Done
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
