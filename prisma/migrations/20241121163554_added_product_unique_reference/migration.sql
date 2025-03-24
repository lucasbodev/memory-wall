/*
  Warnings:

  - A unique constraint covering the columns `[reference]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
  - The required column `reference` was added to the `Product` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "reference" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Product_reference_key" ON "Product"("reference");
