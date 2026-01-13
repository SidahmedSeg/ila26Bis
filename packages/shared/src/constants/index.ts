// Shared constants
// Add shared constants here as needed

export const PLAN_TIERS = {
  FREE: 'FREE',
  PAID_TIER_1: 'PAID_TIER_1',
  PAID_TIER_2: 'PAID_TIER_2',
} as const;

export const BILLING_PERIODS = {
  MONTHLY: 'MONTHLY',
  YEARLY: 'YEARLY',
} as const;

export const TENANT_STATUS = {
  ACTIVE: 'ACTIVE',
  SUSPENDED: 'SUSPENDED',
  NOT_ACTIVE: 'NOT_ACTIVE',
} as const;

export const SUBSCRIPTION_STATUS = {
  ACTIVE: 'ACTIVE',
  CANCELLED: 'CANCELLED',
  PAST_DUE: 'PAST_DUE',
  UNPAID: 'UNPAID',
} as const;

export const PAYMENT_STATUS = {
  SUCCEEDED: 'SUCCEEDED',
  FAILED: 'FAILED',
  PENDING: 'PENDING',
  REFUNDED: 'REFUNDED',
} as const;

export const DEFAULT_ROLES = {
  ADMIN: 'Admin',
  MEMBER: 'Member',
  VIEWER: 'Viewer',
} as const;

