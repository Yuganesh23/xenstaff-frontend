import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "sage";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variants = {
    default: "border-transparent bg-[#476E66] text-[#FEFEFE]",
    secondary: "border border-[#DFDFE2] bg-[#F4F4F4] text-[#66736F]",
    destructive: "border border-[#B0413E]/20 bg-[#FBEBEB] text-[#B0413E]",
    outline: "border border-[#DFDFE2] bg-[#FEFEFE] text-[#202B28]",
    success: "border border-[#3B7A57]/20 bg-[#EBF4EF] text-[#3B7A57]",
    warning: "border border-[#B37D28]/20 bg-[#FCF7EE] text-[#B37D28]",
    sage: "border border-[#708A83]/20 bg-[#EBF2F0] text-[#708A83]",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[#476E66] focus:ring-offset-2",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}

export { Badge };
