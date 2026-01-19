import DashboardClient from './dashboard-client';

// Prevent static generation since this page uses Convex
export const dynamic = 'force-dynamic';

export default function DashboardPage() {
  return <DashboardClient />;
}
