/*
  Warnings:

  - Added the required column `updatedAt` to the `Reorder` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vendorId` to the `Reorder` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Reorder" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "vendorId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "ReorderItems" (
    "id" SERIAL NOT NULL,
    "reorderId" TEXT NOT NULL,
    "productId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReorderItems_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Reorder" ADD CONSTRAINT "Reorder_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReorderItems" ADD CONSTRAINT "ReorderItems_reorderId_fkey" FOREIGN KEY ("reorderId") REFERENCES "Reorder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReorderItems" ADD CONSTRAINT "ReorderItems_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
