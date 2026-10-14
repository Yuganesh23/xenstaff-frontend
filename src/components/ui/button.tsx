import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const variants = {
      default: "bg-[#476E66] text-[#FEFEFE] hover:bg-[#3B5C55] shadow-xs active:scale-[0.99] font-medium transition-all",
      destructive: "bg-[#B0413E] text-white hover:bg-[#913532] shadow-xs font-medium transition-all",
      outline: "border border-[#DFDFE2] bg-[#FEFEFE] hover:bg-[#F4F4F4] text-[#202B28] font-medium transition-all",
      secondary: "bg-[#F4F4F4] text-[#202B28] hover:bg-[#ECECEE] border border-[#DFDFE2] font-medium transition-all",
      ghost: "hover:bg-[#F4F4F4] text-[#66736F] hover:text-[#202B28] font-medium transition-all",
      link: "text-[#476E66] underline-offset-4 hover:underline font-medium transition-all",
    };

    const sizes = {
      default: "h-9 px-4 py-2 text-sm",
      sm: "h-8 rounded-md px-3 text-xs",
      lg: "h-11 rounded-md px-8 text-base",
      icon: "h-9 w-9",
    };

    return (
      <button
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#476E66] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:bg-[#BEC0BF] disabled:text-[#FEFEFE]",
          variants[variant],
          sizes[size],
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
