"use client";

import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle2, AlertCircle } from "lucide-react";

export default function SettingsPage() {
  const queryClient = useQueryClient();
  const [legalName, setLegalName] = useState("");
  const [gstin, setGstin] = useState("");
  const [pan, setPan] = useState("");
  const [timezone, setTimezone] = useState("Asia/Kolkata");
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { data: orgData } = useQuery<any>({
    queryKey: ["currentOrganization"],
    queryFn: () => apiClient.get("/organizations/current"),
  });

  useEffect(() => {
    if (orgData) {
      setLegalName(orgData.legal_name || orgData.name || "");
      setGstin(orgData.gstin || "");
      setPan(orgData.pan || "");
      setTimezone(orgData.timezone || "Asia/Kolkata");
    }
  }, [orgData]);

  const updateMutation = useMutation({
    mutationFn: (data: any) => apiClient.patch("/organizations/current", data),
    onSuccess: () => {
      setSuccessMsg("Organization settings updated successfully.");
      queryClient.invalidateQueries({ queryKey: ["currentOrganization"] });
    },
    onError: (err: any) => {
      setErrorMsg(err.message || "Failed to update settings.");
    },
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg(null);
    setErrorMsg(null);
    updateMutation.mutate({
      legal_name: legalName,
      gstin,
      pan,
      timezone,
    });
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-[#202B28] tracking-tight">Organization Settings</h1>
        <p className="text-xs text-[#66736F]">Configure company statutory registration, timezone and payroll calendar parameters</p>
      </div>

      {successMsg && (
        <div className="p-3 bg-[#EBF4EF] border border-[#3B7A57]/30 rounded-lg flex items-center gap-2 text-xs text-[#3B7A57]">
          <CheckCircle2 className="w-4 h-4 text-[#3B7A57] shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3 bg-[#FBEBEB] border border-[#B0413E]/30 rounded-lg flex items-center gap-2 text-xs text-[#B0413E]">
          <AlertCircle className="w-4 h-4 text-[#B0413E] shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <Card className="bg-[#FEFEFE] border-[#DFDFE2]">
        <form onSubmit={handleSave}>
          <CardHeader>
            <CardTitle className="text-[#202B28]">Statutory & Fiscal Details</CardTitle>
            <CardDescription className="text-[#66736F]">Required for authentic Indian GST and tax compliance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#202B28]">Legal Business Name</label>
              <Input value={legalName} onChange={(e) => setLegalName(e.target.value)} required />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#202B28]">GSTIN (Goods & Services Tax)</label>
                <Input placeholder="33AAAAA0000A1Z5" value={gstin} onChange={(e) => setGstin(e.target.value)} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#202B28]">Company PAN</label>
                <Input placeholder="ABCDE1234F" value={pan} onChange={(e) => setPan(e.target.value)} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#202B28]">Organization Timezone</label>
                <select
                  className="w-full rounded-md border border-[#DFDFE2] text-sm p-2 bg-[#FEFEFE] text-[#202B28] focus:outline-none focus:ring-1 focus:ring-[#476E66]"
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                >
                  <option value="Asia/Kolkata">Asia/Kolkata (IST - UTC+05:30)</option>
                  <option value="UTC">UTC</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#202B28]">Base Currency</label>
                <Input value="INR (₹)" disabled className="bg-[#F4F4F4] text-[#BEC0BF] border-[#DFDFE2] cursor-not-allowed" />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end pt-2 border-t border-[#DFDFE2]">
            <Button type="submit" disabled={updateMutation.isPending} className="bg-[#476E66] hover:bg-[#3B5C55] text-[#FEFEFE]">
              {updateMutation.isPending ? "Saving..." : "Save Settings"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
