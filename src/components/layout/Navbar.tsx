"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/providers/AuthProvider";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Building2, LogOut } from "lucide-react";

export function Navbar() {
  const { user, activeOrg, organizations, switchOrganization, logout } = useAuth();

  return (
    <header className="h-16 border-b border-[#DFDFE2] bg-[#FEFEFE] px-6 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
      <div className="flex items-center gap-4">
        <Link href={activeOrg?.role === "EMPLOYEE" ? "/employee" : "/dashboard"} className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#476E66] flex items-center justify-center text-[#FEFEFE] font-bold text-base shadow-xs">
            X
          </div>
          <span className="font-bold text-lg text-[#202B28] tracking-tight">XenStaff</span>
        </Link>

        {activeOrg && (
          <div className="hidden sm:flex items-center gap-2 pl-4 border-l border-[#DFDFE2]">
            <Building2 className="w-4 h-4 text-[#708A83]" />
            <select
              value={activeOrg.id}
              onChange={(e) => switchOrganization(e.target.value)}
              className="text-xs font-semibold text-[#202B28] bg-transparent border-0 focus:ring-0 cursor-pointer"
            >
              {organizations.map((org) => (
                <option key={org.organization_id} value={org.organization_id}>
                  {org.organization_name} ({org.role})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        <LanguageSwitcher />

        {user && (
          <div className="flex items-center gap-3 pl-3 border-l border-[#DFDFE2]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#F4F4F4] border border-[#DFDFE2] flex items-center justify-center text-[#476E66] font-semibold text-xs">
                {user.first_name[0]}
                {user.last_name ? user.last_name[0] : ""}
              </div>
              <div className="hidden md:block text-left">
                <div className="text-xs font-semibold text-[#202B28]">{user.first_name} {user.last_name}</div>
                <div className="text-[10px] text-[#66736F]">{activeOrg?.role || user.email}</div>
              </div>
            </div>

            <button
              onClick={() => logout()}
              className="p-1.5 text-[#66736F] hover:text-[#B0413E] hover:bg-[#FBEBEB] rounded-md transition"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
