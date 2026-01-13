-- CreateEnum
CREATE TYPE "AdminRole" AS ENUM ('ADMIN', 'SUPER_ADMIN');

-- CreateEnum
CREATE TYPE "TenantStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'NOT_ACTIVE');

-- CreateEnum
CREATE TYPE "PermissionType" AS ENUM ('READ', 'WRITE');

-- CreateEnum
CREATE TYPE "PlanTier" AS ENUM ('FREE', 'PAID_TIER_1', 'PAID_TIER_2');

-- CreateEnum
CREATE TYPE "BillingPeriod" AS ENUM ('MONTHLY', 'YEARLY');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('ACTIVE', 'CANCELLED', 'PAST_DUE', 'UNPAID');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('SUCCEEDED', 'FAILED', 'PENDING', 'REFUNDED');

-- CreateEnum
CREATE TYPE "FeatureType" AS ENUM ('MOBILITY');

-- CreateEnum
CREATE TYPE "UserFeatureStatus" AS ENUM ('ACTIVE', 'CANCELLED', 'PAST_DUE', 'EXPIRED');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password_hash" VARCHAR(255),
    "full_name" VARCHAR(255) NOT NULL,
    "google_oauth_id" VARCHAR(255),
    "email_verified" BOOLEAN NOT NULL DEFAULT false,
    "email_verified_at" TIMESTAMP(3),
    "stripe_customer_id" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_users" (
    "id" UUID NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "role" "AdminRole" NOT NULL DEFAULT 'ADMIN',
    "last_login_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admin_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenants" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "siret" VARCHAR(14) NOT NULL,
    "kbis" VARCHAR(255),
    "activity_domain_id" UUID,
    "speciality_id" UUID,
    "address" JSONB,
    "creation_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "logo_url" VARCHAR(500),
    "cover_image_url" VARCHAR(500),
    "status" "TenantStatus" NOT NULL DEFAULT 'ACTIVE',
    "owner_id" UUID NOT NULL,
    "subscription_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tenants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenant_memberships" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "role_id" UUID NOT NULL,
    "is_owner" BOOLEAN NOT NULL DEFAULT false,
    "invited_by" UUID,
    "invited_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tenant_memberships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" UUID NOT NULL,
    "tenant_id" UUID,
    "name" VARCHAR(100) NOT NULL,
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "is_system" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,
    "created_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role_permissions" (
    "id" UUID NOT NULL,
    "role_id" UUID NOT NULL,
    "module" VARCHAR(100) NOT NULL,
    "permission" "PermissionType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "role_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscriptions" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "plan_tier" "PlanTier" NOT NULL,
    "billing_period" "BillingPeriod",
    "stripe_subscription_id" VARCHAR(255),
    "stripe_customer_id" VARCHAR(255) NOT NULL,
    "max_users" INTEGER NOT NULL DEFAULT 1,
    "status" "SubscriptionStatus" NOT NULL DEFAULT 'ACTIVE',
    "current_period_start" TIMESTAMP(3) NOT NULL,
    "current_period_end" TIMESTAMP(3) NOT NULL,
    "cancel_at_period_end" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "subscription_id" UUID NOT NULL,
    "stripe_payment_intent_id" VARCHAR(255) NOT NULL,
    "stripe_invoice_id" VARCHAR(255),
    "amount" DECIMAL(10,2) NOT NULL,
    "currency" VARCHAR(3) NOT NULL DEFAULT 'EUR',
    "status" "PaymentStatus" NOT NULL,
    "payment_method" VARCHAR(50),
    "invoice_url" VARCHAR(500),
    "paid_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_features" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "feature_type" "FeatureType" NOT NULL DEFAULT 'MOBILITY',
    "stripe_product_id" VARCHAR(255) NOT NULL,
    "stripe_subscription_id" VARCHAR(255) NOT NULL,
    "status" "UserFeatureStatus" NOT NULL,
    "current_period_start" TIMESTAMP(3) NOT NULL,
    "current_period_end" TIMESTAMP(3) NOT NULL,
    "cancel_at_period_end" BOOLEAN NOT NULL DEFAULT false,
    "activated_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_features_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documents" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "category_id" UUID NOT NULL,
    "file_url" VARCHAR(500) NOT NULL,
    "file_size" INTEGER NOT NULL,
    "mime_type" VARCHAR(100) NOT NULL,
    "uploaded_by" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "document_categories" (
    "id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "document_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activity_domains" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "code" VARCHAR(50),
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "activity_domains_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "specialities" (
    "id" UUID NOT NULL,
    "activity_domain_id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "specialities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "otps" (
    "id" UUID NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "code" VARCHAR(10) NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "otps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feature_flags" (
    "id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "feature_flags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plan_features" (
    "id" UUID NOT NULL,
    "plan_tier" "PlanTier" NOT NULL,
    "feature_flag_id" UUID NOT NULL,
    "is_enabled" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "plan_features_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_google_oauth_id_key" ON "users"("google_oauth_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_stripe_customer_id_key" ON "users"("stripe_customer_id");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "admin_users_email_key" ON "admin_users"("email");

-- CreateIndex
CREATE INDEX "admin_users_email_idx" ON "admin_users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "tenants_siret_key" ON "tenants"("siret");

-- CreateIndex
CREATE UNIQUE INDEX "tenants_subscription_id_key" ON "tenants"("subscription_id");

-- CreateIndex
CREATE INDEX "tenants_siret_idx" ON "tenants"("siret");

-- CreateIndex
CREATE INDEX "tenants_owner_id_idx" ON "tenants"("owner_id");

-- CreateIndex
CREATE INDEX "tenants_status_idx" ON "tenants"("status");

-- CreateIndex
CREATE INDEX "tenant_memberships_user_id_idx" ON "tenant_memberships"("user_id");

-- CreateIndex
CREATE INDEX "tenant_memberships_tenant_id_idx" ON "tenant_memberships"("tenant_id");

-- CreateIndex
CREATE UNIQUE INDEX "tenant_memberships_user_id_tenant_id_key" ON "tenant_memberships"("user_id", "tenant_id");

-- CreateIndex
CREATE INDEX "roles_tenant_id_idx" ON "roles"("tenant_id");

-- CreateIndex
CREATE INDEX "role_permissions_role_id_idx" ON "role_permissions"("role_id");

-- CreateIndex
CREATE UNIQUE INDEX "role_permissions_role_id_module_permission_key" ON "role_permissions"("role_id", "module", "permission");

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_tenant_id_key" ON "subscriptions"("tenant_id");

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_stripe_subscription_id_key" ON "subscriptions"("stripe_subscription_id");

-- CreateIndex
CREATE INDEX "subscriptions_tenant_id_idx" ON "subscriptions"("tenant_id");

-- CreateIndex
CREATE INDEX "subscriptions_status_idx" ON "subscriptions"("status");

-- CreateIndex
CREATE INDEX "payments_tenant_id_idx" ON "payments"("tenant_id");

-- CreateIndex
CREATE INDEX "payments_subscription_id_idx" ON "payments"("subscription_id");

-- CreateIndex
CREATE INDEX "payments_status_idx" ON "payments"("status");

-- CreateIndex
CREATE UNIQUE INDEX "user_features_stripe_subscription_id_key" ON "user_features"("stripe_subscription_id");

-- CreateIndex
CREATE INDEX "user_features_user_id_idx" ON "user_features"("user_id");

-- CreateIndex
CREATE INDEX "user_features_status_idx" ON "user_features"("status");

-- CreateIndex
CREATE INDEX "documents_tenant_id_idx" ON "documents"("tenant_id");

-- CreateIndex
CREATE INDEX "documents_category_id_idx" ON "documents"("category_id");

-- CreateIndex
CREATE UNIQUE INDEX "document_categories_name_key" ON "document_categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "activity_domains_name_key" ON "activity_domains"("name");

-- CreateIndex
CREATE UNIQUE INDEX "activity_domains_code_key" ON "activity_domains"("code");

-- CreateIndex
CREATE INDEX "specialities_activity_domain_id_idx" ON "specialities"("activity_domain_id");

-- CreateIndex
CREATE INDEX "otps_email_idx" ON "otps"("email");

-- CreateIndex
CREATE UNIQUE INDEX "feature_flags_name_key" ON "feature_flags"("name");

-- CreateIndex
CREATE INDEX "plan_features_plan_tier_idx" ON "plan_features"("plan_tier");

-- CreateIndex
CREATE UNIQUE INDEX "plan_features_plan_tier_feature_flag_id_key" ON "plan_features"("plan_tier", "feature_flag_id");

-- AddForeignKey
ALTER TABLE "tenants" ADD CONSTRAINT "tenants_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenants" ADD CONSTRAINT "tenants_activity_domain_id_fkey" FOREIGN KEY ("activity_domain_id") REFERENCES "activity_domains"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenants" ADD CONSTRAINT "tenants_speciality_id_fkey" FOREIGN KEY ("speciality_id") REFERENCES "specialities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant_memberships" ADD CONSTRAINT "tenant_memberships_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant_memberships" ADD CONSTRAINT "tenant_memberships_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant_memberships" ADD CONSTRAINT "tenant_memberships_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roles" ADD CONSTRAINT "roles_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_subscription_id_fkey" FOREIGN KEY ("subscription_id") REFERENCES "subscriptions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_features" ADD CONSTRAINT "user_features_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "document_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_uploaded_by_fkey" FOREIGN KEY ("uploaded_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "specialities" ADD CONSTRAINT "specialities_activity_domain_id_fkey" FOREIGN KEY ("activity_domain_id") REFERENCES "activity_domains"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plan_features" ADD CONSTRAINT "plan_features_feature_flag_id_fkey" FOREIGN KEY ("feature_flag_id") REFERENCES "feature_flags"("id") ON DELETE CASCADE ON UPDATE CASCADE;
