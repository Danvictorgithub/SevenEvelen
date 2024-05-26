/*
  Warnings:

  - You are about to drop the column `vendorId` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "User_vendorId_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "vendorId";
