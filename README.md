# XenStaff Frontend

Production-grade Next.js web application and Employee Self-Service (ESS) Progressive Web App (PWA) for the XenStaff HRMS & Deterministic Payroll SaaS platform by XenFirm Technologies.

## 🚀 Key Features

- **Executive HR & Admin Portal**:
  - Live organization workforce analytics & KPI cards
  - Employee Master Directory with CSV export & branch/department assignment
  - Confidential onboarding via 48-hour secure activation invite links
  - Attendance log review & employee punch regularization approval queue
  - Deterministic payroll processing runs with line-item detail inspect modal
  - PDF payslip distribution & archive
  - Flexible Shift & Overtime template management (supports overnight shifts)
  - Leave allocation, request approval workflow, and real-time ledger balances
  - Multi-tier SaaS subscription plans with Razorpay checkout & billing interval toggles
  - Statutory company fiscal settings (GSTIN, PAN, Timezone)
- **Employee Self-Service (ESS) PWA**:
  - Authoritative server clock-in / clock-out with duplicate punch prevention
  - Shift timetable and daily work duration calculator
  - Punch regularization requests
  - Leave quota balances and leave applications
  - One-click authentic PDF payslip downloads in English and Tamil
- **Official XenStaff Brand Design System**:
  - White: `#FEFEFE` (main background)
  - Light Gray: `#F4F4F4` (sidebars, table headers, grouped panels)
  - Cool Gray: `#DFDFE2` (borders, table dividers)
  - Neutral Gray: `#BEC0BF` (placeholders, disabled states)
  - Sage Teal: `#708A83` (supporting icons, secondary accents)
  - Deep Teal: `#476E66` (primary buttons, active navigation, key CTAs)
  - Primary Text: `#202B28`
  - Secondary Text: `#66736F`
- **Internationalization (i18n)**: Instant English and Tamil language switching across key interfaces.

## 🛠 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Library**: React 19
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State & Data Fetching**: TanStack React Query v5
- **Type Safety**: TypeScript 5

## 🏁 Getting Started

### 1. Prerequisites
- Node.js 18.18 or newer
- npm or yarn

### 2. Setup & Installation
```bash
# Clone the repository
git clone <your-frontend-repo-url>
cd xenstaff-frontend

# Install dependencies
npm install

# Start Next.js development server
npm run dev

# Or build and run production server
npm run build
npm run start -p 3000
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

---
© 2026 XenFirm Technologies. All rights reserved.
