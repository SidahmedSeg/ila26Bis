/*
  Warnings:

  - You are about to drop the column `subscription_id` on the `tenants` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "tenants_subscription_id_key";

-- AlterTable
ALTER TABLE "tenants" DROP COLUMN "subscription_id";
