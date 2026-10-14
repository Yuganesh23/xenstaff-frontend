"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import { Navbar } from "@/components/layout/Navbar";
import { AdminSidebar } from "@/components/layout/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, activeOrg, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FEFEFE]">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-4 border-[#476E66] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-[#66736F] font-medium">Loading XenStaff...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FEFEFE] flex flex-col text-[#202B28]">
      <Navbar />
      <div className="flex flex-1">
        <AdminSidebar />
        <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full bg-[#FEFEFE]">{children}</main>
      </div>
    </div>
  );
}
