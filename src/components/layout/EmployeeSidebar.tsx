"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/providers/LanguageProvider";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  CalendarCheck,
  CalendarOff,
  FileText,
} from "lucide-react";

export function EmployeeSidebar() {
  const pathname = usePathname();
  const { t } = useLanguage();

  const links = [
    { href: "/employee", label: t("nav.dashboard"), icon: LayoutDashboard },
    { href: "/employee/attendance", label: t("nav.my_attendance"), icon: CalendarCheck },
    { href: "/employee/leave", label: t("nav.my_leave"), icon: CalendarOff },
    { href: "/employee/payslips", label: t("nav.my_payslips"), icon: FileText },
  ];

  return (
    <aside className="w-64 border-r border-[#DFDFE2] bg-[#F4F4F4] min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between hidden md:flex">
      <div className="space-y-1">
        <div className="px-3 py-2 text-[11px] font-semibold tracking-wider text-[#66736F] uppercase">
          Employee Self-Service (ESS)
        </div>
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition",
                isActive
                  ? "bg-[#476E66] text-[#FEFEFE] shadow-xs font-semibold"
                  : "text-[#66736F] hover:text-[#202B28] hover:bg-[#EAEAEA]"
              )}
            >
              <Icon className={cn("w-4 h-4 shrink-0", isActive ? "text-[#FEFEFE]" : "text-[#708A83]")} />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </div>

      <div className="p-3 bg-[#FEFEFE] rounded-lg border border-[#DFDFE2] shadow-2xs">
        <div className="text-xs font-semibold text-[#202B28]">Self-Service Portal</div>
        <div className="text-[10px] text-[#66736F]">PWA & Mobile Ready</div>
      </div>
    </aside>
  );
}
