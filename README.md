# King Praise Techz — Agency Management Platform

A modern, full-stack web agency management platform built with Next.js 14, featuring role-based dashboards for Admin, Client, and Team members.

## 🚀 Features

### Authentication
- Multi-step login and signup flows with role selection
- Two-Factor Authentication (Google Authenticator) for all non-admin users
- Admin bypass: `chibuksai@gmail.com` / `Password123` — no 2FA required
- JWT-based session management with Zustand persistence

### Admin Dashboard
- **Projects**: Create, manage, and track all agency projects
- **Milestones**: Upload milestones sent to client email + displayed on client dashboard
- **Task Assignment**: Assign tasks to team members with payment and due dates
- **Team Management**: Promote team members to temporary or permanent admin
- **Reviews**: Approve or reject client reviews before website publication
- **Analytics**: Revenue charts, project metrics, team performance
- **Notifications**: Real-time notification center

### Client Dashboard
- Track active project progress per milestone
- View delivery dates and budget info
- Submit reviews for completed projects (pending admin approval)
- Milestone timeline view

### Team Dashboard
- View and manage assigned tasks
- Submit deliverables (admin notified immediately at chibuksai@gmail.com)
- Track earnings (per-task payments + totals)
- Temporary admin access when promoted by admin

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS + custom design system
- **Animation**: Framer Motion
- **State**: Zustand (with persistence)
- **HTTP**: Axios
- **Charts**: Recharts
- **Icons**: Lucide React
- **Fonts**: Syne (display) + DM Sans (body)
- **Email**: Resend (backend)
- **2FA**: Google Authenticator + TOTP (backend)

## 📁 Project Structure

```
king-praise-techz/
├── app/
│   ├── auth/
│   │   ├── login/          # Multi-step login (role selection → credentials)
│   │   ├── signup/         # Multi-step signup (role → details → skills)
│   │   └── 2fa/            # QR setup + code verification
│   ├── dashboard/
│   │   ├── admin/          # Admin-only pages
│   │   │   ├── page.tsx    # Overview + charts
│   │   │   ├── projects/   # Project management + [id] detail
│   │   │   ├── team/       # Team management + promote/revoke
│   │   │   ├── reviews/    # Review moderation
│   │   │   ├── analytics/  # Business analytics
│   │   │   └── settings/   # Admin settings
│   │   ├── client/         # Client-only pages
│   │   │   ├── page.tsx    # Overview + active project
│   │   │   ├── projects/   # All client projects
│   │   │   ├── milestones/ # Timeline view
│   │   │   ├── reviews/    # Submit reviews
│   │   │   └── settings/   # Client settings
│   │   └── team/           # Team-only pages
│   │       ├── page.tsx    # Overview + tasks
│   │       ├── tasks/      # Task management + submit deliverables
│   │       ├── projects/   # Projects contributing to
│   │       ├── earnings/   # Payment history
│   │       └── settings/   # Team settings
│   ├── layout.tsx
│   ├── page.tsx            # Redirect to dashboard or login
│   └── globals.css
├── components/
│   ├── ui/index.tsx        # Design system components
│   ├── dashboard/
│   │   └── DashboardLayout.tsx  # Sidebar + header
│   └── shared/
│       ├── AuthGuard.tsx   # Route protection
│       └── Providers.tsx   # App providers
├── lib/
│   ├── api.ts              # Axios client + all API functions
│   ├── store/authStore.ts  # Zustand auth store
│   └── utils.ts            # Utilities + helpers
└── types/index.ts          # TypeScript types
```

## 🎨 Design System

- **Colors**: Brand blue (`#1a4dff`), Gold (`#f59e0b`), Dark surface (`#0a0a0f`)
- **Glass morphism**: `glass-card` class for frosted glass cards
- **Role badges**: Gold (admin), Blue (client), Emerald (team)
- **Responsive**: Mobile sidebar overlay + desktop collapsible sidebar

## 🔧 Setup & Installation

### Prerequisites
- Node.js 18+
- Backend API running at `http://localhost:5000`

### Install & Run

```bash
cd king-praise-techz
npm install

# Copy env file
cp .env.example .env.local

# Edit .env.local with your API URL
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## 🔐 Default Admin Credentials

```
Email:    chibuksai@gmail.com
Password: Password123
Role:     Admin (bypasses 2FA)
```

## 📧 Email Integration

The backend uses **Resend** for:
- Project milestone notifications to clients
- Task submission alerts to admin (`chibuksai@gmail.com`)
- Welcome emails on signup

## 🗺️ User Flows

### Admin Flow
1. Login → Admin dashboard (no 2FA)
2. Create project → assign client email → add tasks for team
3. Upload milestones → client gets email + dashboard update
4. Review team deliverables on dashboard
5. Approve/reject client reviews
6. Promote team members to admin (temporary with expiry or permanent)

### Client Flow
1. Signup → 2FA setup → Client dashboard
2. View active project progress + milestones
3. Track delivery date and budget
4. On completion → submit review (pending admin approval)

### Team Flow
1. Signup → 2FA setup → Team dashboard
2. View assigned tasks + due dates + payment
3. Submit deliverables → admin notified immediately
4. Track earnings history
5. If promoted → dashboard switches to admin view
