/*
  Warnings:

  - Added the required column `status` to the `Reorder` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ReorderStatus" AS ENUM ('Pending', 'Approved', 'Rejected');

-- AlterTable
ALTER TABLE "Reorder" ADD COLUMN     "status" "ReorderStatus" NOT NULL;
