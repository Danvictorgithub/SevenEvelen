/*
  Warnings:

  - The values [test] on the enum `ReorderStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ReorderStatus_new" AS ENUM ('Pending', 'Approved', 'Delivered', 'Rejected');
ALTER TABLE "Reorder" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Reorder" ALTER COLUMN "status" TYPE "ReorderStatus_new" USING ("status"::text::"ReorderStatus_new");
ALTER TYPE "ReorderStatus" RENAME TO "ReorderStatus_old";
ALTER TYPE "ReorderStatus_new" RENAME TO "ReorderStatus";
DROP TYPE "ReorderStatus_old";
ALTER TABLE "Reorder" ALTER COLUMN "status" SET DEFAULT 'Pending';
COMMIT;
