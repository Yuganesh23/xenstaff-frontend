export type Role =
  | 'PLATFORM_ADMIN'
  | 'ORGANIZATION_OWNER'
  | 'HR_ADMIN'
  | 'PAYROLL_MANAGER'
  | 'BRANCH_MANAGER'
  | 'TEAM_LEAD'
  | 'EMPLOYEE'
  | 'AUDITOR';

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  is_platform_admin: boolean;
  is_active: boolean;
  created_at: string;
}

export interface ActiveOrganization {
  id: string;
  name: string;
  slug: string;
  role: Role;
  onboarding_completed: boolean;
  onboarding_step: string;
}

export interface OrganizationMembership {
  id: string;
  organization_id: string;
  organization_name: string;
  organization_slug: string;
  role: Role;
  is_active: boolean;
}

export interface Employee {
  id: string;
  employee_code: string;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  phone: string;
  date_of_birth?: string;
  gender?: string;
  joining_date: string;
  exit_date?: string;
  employment_status: 'ACTIVE' | 'PROBATION' | 'NOTICE_PERIOD' | 'TERMINATED' | 'RESIGNED';
  employment_type: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERN';
  branch: string;
  branch_name: string;
  department: string;
  department_name: string;
  designation: string;
  reporting_manager?: string;
  reporting_manager_name?: string;
  pan_number?: string;
  bank_account_number?: string;
  bank_name?: string;
  bank_ifsc?: string;
  created_at: string;
}

export interface Branch {
  id: string;
  name: string;
  code: string;
  city: string;
  state: string;
  address: string;
  is_headquarters: boolean;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  parent?: string;
  parent_name?: string;
}

export interface ShiftTemplate {
  id: string;
  name: string;
  start_time: string;
  end_time: string;
  is_overnight: boolean;
  grace_period_minutes: number;
  break_duration_minutes: number;
  working_hours: string;
}

export interface AttendanceSummary {
  id: string;
  employee: string;
  employee_code: string;
  employee_name: string;
  date: string;
  first_clock_in?: string;
  last_clock_out?: string;
  total_work_minutes: number;
  work_hours: number;
  break_minutes: number;
  overtime_minutes: number;
  status: 'PRESENT' | 'HALF_DAY' | 'ABSENT' | 'PAID_LEAVE' | 'UNPAID_LEAVE' | 'WEEKLY_OFF' | 'HOLIDAY';
  is_late: boolean;
  is_early_departure: boolean;
  is_locked: boolean;
}

export interface LeaveType {
  id: string;
  name: string;
  code: string;
  annual_quota: string;
  is_paid: boolean;
  allows_half_day: boolean;
}

export interface LeaveBalance {
  id: string;
  employee: string;
  leave_type: string;
  leave_type_name: string;
  leave_type_code: string;
  year: number;
  allocated_days: string;
  used_days: string;
  pending_days: string;
  available_days: string;
}

export interface LeaveRequest {
  id: string;
  employee: string;
  employee_name: string;
  employee_code: string;
  leave_type: string;
  leave_type_name: string;
  leave_type_code: string;
  start_date: string;
  end_date: string;
  total_days: string;
  is_half_day: boolean;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
  reviewed_by_name?: string;
  rejection_reason?: string;
  created_at: string;
}

export interface PayrollRun {
  id: string;
  period_start: string;
  period_end: string;
  month: number;
  year: number;
  state: 'DRAFT' | 'CALCULATING' | 'REVIEW' | 'APPROVED' | 'PUBLISHED' | 'CLOSED' | 'FAILED';
  calculation_divisor_type: string;
  total_gross: string;
  total_deductions: string;
  total_net: string;
  approved_by_name?: string;
  approved_at?: string;
  items_count: number;
  exceptions_count: number;
  created_at: string;
}

export interface Payslip {
  id: string;
  payslip_number: string;
  employee_code: string;
  employee_name: string;
  designation: string;
  department_name: string;
  month: number;
  year: number;
  calendar_days: number;
  payable_days: string;
  lop_days: string;
  gross_earnings: string;
  total_deductions: string;
  net_salary: string;
  is_published: boolean;
  published_at?: string;
  lines: Array<{
    id: string;
    component_name: string;
    component_code: string;
    component_type: 'EARNING' | 'DEDUCTION';
    base_amount: string;
    calculated_amount: string;
  }>;
}

export interface SubscriptionInfo {
  id: string;
  plan_name: string;
  plan_code: string;
  max_employees: number;
  monthly_price: string;
  billing_interval: 'MONTHLY' | 'ANNUAL';
  status: 'TRIALING' | 'ACTIVE' | 'PAST_DUE' | 'CANCELLED' | 'EXPIRED';
  current_period_start: string;
  current_period_end: string;
  active_employees_count: number;
  seats_remaining: number;
  days_remaining: number;
  is_trial: boolean;
}
