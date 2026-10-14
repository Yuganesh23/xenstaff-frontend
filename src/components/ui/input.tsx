import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border border-[#DFDFE2] bg-[#FEFEFE] px-3 py-1 text-sm shadow-2xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[#BEC0BF] text-[#202B28] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#476E66] focus-visible:border-[#476E66] disabled:cursor-not-allowed disabled:bg-[#F4F4F4] disabled:text-[#BEC0BF]",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
