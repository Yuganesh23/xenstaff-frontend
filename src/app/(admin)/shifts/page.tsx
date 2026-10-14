"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { ShiftTemplate } from "@/types";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Clock, Plus, X, Moon, AlertCircle } from "lucide-react";

export default function ShiftsPage() {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("18:00");
  const [gracePeriod, setGracePeriod] = useState(15);
  const [breakDuration, setBreakDuration] = useState(60);
  const [error, setError] = useState<string | null>(null);

  const { data: shiftsData, isLoading } = useQuery<any>({
    queryKey: ["shiftsList"],
    queryFn: () => apiClient.get("/shifts/"),
  });

  const createMutation = useMutation({
    mutationFn: (newShift: any) => apiClient.post("/shifts/", newShift),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shiftsList"] });
      setShowModal(false);
      setName("");
      setError(null);
    },
    onError: (err: any) => {
      setError(err.message || "Failed to create shift template.");
    },
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      name,
      start_time: startTime,
      end_time: endTime,
      grace_period_minutes: Number(gracePeriod),
      break_duration_minutes: Number(breakDuration),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#202B28] tracking-tight">Shift Templates & Schedules</h1>
          <p className="text-xs text-[#66736F]">Configure working hours, overnight policies and grace periods</p>
        </div>

        <Button size="sm" onClick={() => setShowModal(true)} className="gap-1.5 bg-[#476E66] hover:bg-[#3B5C55] text-[#FEFEFE]">
          <Plus className="w-4 h-4" /> Create Shift Template
        </Button>
      </div>

      <Card className="bg-[#FEFEFE] border-[#DFDFE2]">
        <CardHeader>
          <CardTitle className="text-[#202B28]">Configured Shift Templates</CardTitle>
          <CardDescription className="text-[#66736F]">Shift parameters used for punctuality and overtime calculations</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-[#F4F4F4]">
              <TableRow className="border-b border-[#DFDFE2]">
                <TableHead className="text-[#66736F]">Shift Name</TableHead>
                <TableHead className="text-[#66736F]">Timings</TableHead>
                <TableHead className="text-[#66736F]">Working Hours</TableHead>
                <TableHead className="text-[#66736F]">Grace Period</TableHead>
                <TableHead className="text-[#66736F]">Break Duration</TableHead>
                <TableHead className="text-[#66736F]">Type</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-[#BEC0BF] text-xs">
                    Loading shifts...
                  </TableCell>
                </TableRow>
              ) : shiftsData?.results && shiftsData.results.length > 0 ? (
                shiftsData.results.map((shift: ShiftTemplate) => (
                  <TableRow key={shift.id} className="border-b border-[#DFDFE2] hover:bg-[#F4F4F4]/50">
                    <TableCell className="font-semibold text-[#202B28]">{shift.name}</TableCell>
                    <TableCell className="font-mono text-xs text-[#202B28]">
                      {shift.start_time} — {shift.end_time}
                    </TableCell>
                    <TableCell className="text-[#202B28]">{shift.working_hours} hrs</TableCell>
                    <TableCell className="text-[#202B28]">{shift.grace_period_minutes} mins</TableCell>
                    <TableCell className="text-[#202B28]">{shift.break_duration_minutes} mins</TableCell>
                    <TableCell>
                      {shift.is_overnight ? (
                        <Badge variant="secondary" className="gap-1 bg-[#F4F4F4] text-[#202B28] border border-[#DFDFE2]">
                          <Moon className="w-3 h-3 text-[#708A83]" /> Overnight
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="border-[#DFDFE2] text-[#202B28]">Day Shift</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-[#BEC0BF] text-xs">
                    No shift templates configured yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-[#202B28]/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FEFEFE] border border-[#DFDFE2] rounded-xl shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-[#DFDFE2]">
              <h3 className="font-bold text-lg text-[#202B28]">Create Shift Template</h3>
              <button onClick={() => setShowModal(false)} className="text-[#66736F] hover:text-[#202B28]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              {error && (
                <div className="p-3 bg-[#FBEBEB] border border-[#B0413E]/30 rounded-lg flex items-center gap-2 text-xs text-[#B0413E]">
                  <AlertCircle className="w-4 h-4 shrink-0 text-[#B0413E]" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#202B28]">Shift Name *</label>
                <Input required placeholder="Night Shift" value={name} onChange={(e) => setName(e.target.value)} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#202B28]">Start Time *</label>
                  <Input type="time" required value={startTime} onChange={(e) => setStartTime(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#202B28]">End Time *</label>
                  <Input type="time" required value={endTime} onChange={(e) => setEndTime(e.target.value)} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#202B28]">Grace Period (Mins)</label>
                  <Input type="number" min="0" value={gracePeriod} onChange={(e) => setGracePeriod(Number(e.target.value))} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#202B28]">Break Duration (Mins)</label>
                  <Input type="number" min="0" value={breakDuration} onChange={(e) => setBreakDuration(Number(e.target.value))} />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#DFDFE2]">
                <Button type="button" variant="outline" className="border-[#DFDFE2] text-[#202B28] hover:bg-[#F4F4F4]" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createMutation.isPending} className="bg-[#476E66] hover:bg-[#3B5C55] text-[#FEFEFE]">
                  {createMutation.isPending ? "Saving..." : "Save Template"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
