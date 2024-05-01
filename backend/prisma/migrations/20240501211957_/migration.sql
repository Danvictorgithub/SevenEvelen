/*
  Warnings:

  - Added the required column `image` to the `VendorProduct` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `upcCode` on the `VendorProduct` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "VendorProduct" ADD COLUMN     "image" TEXT NOT NULL,
DROP COLUMN "upcCode",
ADD COLUMN     "upcCode" INTEGER NOT NULL;
