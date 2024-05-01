/*
  Warnings:

  - Made the column `address` on table `Store` required. This step will fail if there are existing NULL values in that column.
  - Made the column `opening_hours` on table `Store` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Store" ALTER COLUMN "address" SET NOT NULL,
ALTER COLUMN "opening_hours" SET NOT NULL;
