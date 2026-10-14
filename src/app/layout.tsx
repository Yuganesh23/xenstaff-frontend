import type { Metadata } from "next";
import "./globals.css";
import { QueryProvider } from "@/providers/QueryProvider";
import { AuthProvider } from "@/providers/AuthProvider";
import { LanguageProvider } from "@/providers/LanguageProvider";

export const metadata: Metadata = {
  title: "XenStaff — Workforce Management & Payroll SaaS",
  description: "B2B HRMS, Attendance, Leave and Deterministic Payroll Platform for Indian SMBs & MSMEs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#FEFEFE] text-[#202B28] antialiased">
        <QueryProvider>
          <LanguageProvider>
            <AuthProvider>{children}</AuthProvider>
          </LanguageProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
