"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/providers/LanguageProvider";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  Clock,
  CalendarOff,
  Calculator,
  FileText,
  BarChart3,
  CreditCard,
  Settings,
} from "lucide-react";

export function AdminSidebar() {
  const pathname = usePathname();
  const { t } = useLanguage();

  const links = [
    { href: "/dashboard", label: t("nav.dashboard"), icon: LayoutDashboard },
    { href: "/employees", label: t("nav.employees"), icon: Users },
    { href: "/attendance", label: t("nav.attendance"), icon: CalendarCheck },
    { href: "/shifts", label: t("nav.shifts"), icon: Clock },
    { href: "/leave", label: t("nav.leave"), icon: CalendarOff },
    { href: "/payroll", label: t("nav.payroll"), icon: Calculator },
    { href: "/payslips", label: t("nav.payslips"), icon: FileText },
    { href: "/reports", label: t("nav.reports"), icon: BarChart3 },
    { href: "/billing", label: t("nav.billing"), icon: CreditCard },
    { href: "/settings", label: t("nav.settings"), icon: Settings },
  ];

  return (
    <aside className="w-64 border-r border-[#DFDFE2] bg-[#F4F4F4] min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between hidden md:flex">
      <div className="space-y-1">
        <div className="px-3 py-2 text-[11px] font-semibold tracking-wider text-[#66736F] uppercase">
          Administration
        </div>
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
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
        <div className="text-xs font-semibold text-[#202B28]">XenStaff v1.0</div>
        <div className="text-[10px] text-[#66736F]">By XenFirm Technologies</div>
      </div>
    </aside>
  );
}
