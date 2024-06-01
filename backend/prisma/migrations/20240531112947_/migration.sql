/*
  Warnings:

  - You are about to drop the column `delivery` on the `Reorder` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Reorder" DROP COLUMN "delivery",
ADD COLUMN     "deliveryDate" TIMESTAMP(3);
