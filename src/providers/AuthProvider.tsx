"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, ActiveOrganization, OrganizationMembership } from "@/types";
import { apiClient } from "@/lib/api/client";

interface AuthContextType {
  user: User | null;
  activeOrg: ActiveOrganization | null;
  organizations: OrganizationMembership[];
  isLoading: boolean;
  login: (token: string, user: User, activeOrg: ActiveOrganization, orgs: OrganizationMembership[]) => void;
  logout: () => Promise<void>;
  switchOrganization: (orgId: string) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [activeOrg, setActiveOrg] = useState<ActiveOrganization | null>(null);
  const [organizations, setOrganizations] = useState<OrganizationMembership[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  const refreshUser = async () => {
    try {
      const token = localStorage.getItem("xenstaff_token");
      if (!token) {
        setIsLoading(false);
        return;
      }

      const res = await apiClient.get<any>("/auth/me");
      setUser(res.user);
      setActiveOrg(res.active_organization);
      setOrganizations(res.organizations || []);

      if (res.active_organization?.id) {
        localStorage.setItem("xenstaff_active_org_id", res.active_organization.id);
      }
    } catch (err) {
      localStorage.removeItem("xenstaff_token");
      localStorage.removeItem("xenstaff_active_org_id");
      setUser(null);
      setActiveOrg(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = (token: string, userData: User, orgData: ActiveOrganization, orgsList: OrganizationMembership[]) => {
    localStorage.setItem("xenstaff_token", token);
    if (orgData?.id) {
      localStorage.setItem("xenstaff_active_org_id", orgData.id);
    }
    setUser(userData);
    setActiveOrg(orgData);
    setOrganizations(orgsList);

    if (orgData?.role === "EMPLOYEE") {
      router.push("/employee");
    } else {
      router.push("/dashboard");
    }
  };

  const logout = async () => {
    try {
      await apiClient.post("/auth/logout");
    } catch (err) {
      // Continue cleanup regardless
    }
    localStorage.removeItem("xenstaff_token");
    localStorage.removeItem("xenstaff_active_org_id");
    setUser(null);
    setActiveOrg(null);
    setOrganizations([]);
    router.push("/login");
  };

  const switchOrganization = async (orgId: string) => {
    try {
      const res = await apiClient.post<any>("/auth/switch-organization", { organization_id: orgId });
      setActiveOrg(res.active_organization);
      localStorage.setItem("xenstaff_active_org_id", orgId);
      window.location.reload();
    } catch (err) {
      console.error("Failed to switch organization", err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        activeOrg,
        organizations,
        isLoading,
        login,
        logout,
        switchOrganization,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
