/**
 * User subscription plans.
 */
export type Plan = 'free' | 'pro' | 'team' | 'enterprise';

/**
 * Plan limits and features.
 */
export const PLAN_LIMITS: Record<
  Plan,
  {
    maxProjects: number;
    maxGenerationsPerDay: number;
    maxBuildsPerMonth: number;
    canExport: boolean;
    canCloudBuild: boolean;
    canSubmitToAppStore: boolean;
    priceMonthly: number;
  }
> = {
  free: {
    maxProjects: 2,
    maxGenerationsPerDay: 10,
    maxBuildsPerMonth: 0,
    canExport: true,
    canCloudBuild: false,
    canSubmitToAppStore: false,
    priceMonthly: 0,
  },
  pro: {
    maxProjects: 10,
    maxGenerationsPerDay: 100,
    maxBuildsPerMonth: 20,
    canExport: true,
    canCloudBuild: true,
    canSubmitToAppStore: true,
    priceMonthly: 29,
  },
  team: {
    maxProjects: 50,
    maxGenerationsPerDay: 500,
    maxBuildsPerMonth: 100,
    canExport: true,
    canCloudBuild: true,
    canSubmitToAppStore: true,
    priceMonthly: 99,
  },
  enterprise: {
    maxProjects: Infinity,
    maxGenerationsPerDay: Infinity,
    maxBuildsPerMonth: Infinity,
    canExport: true,
    canCloudBuild: true,
    canSubmitToAppStore: true,
    priceMonthly: 499,
  },
};

/**
 * User profile in SwiftShip.
 */
export interface User {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;

  // Subscription
  plan: Plan;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;

  // Usage tracking
  generationsToday: number;
  buildsThisMonth: number;

  // Apple Developer connection (for App Store submission)
  appleDeveloperTeamId: string | null;
  appStoreConnectApiKeyId: string | null;

  // Timestamps
  createdAt: Date;
  lastLoginAt: Date | null;
}
