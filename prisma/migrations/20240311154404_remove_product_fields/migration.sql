/*
  Warnings:

  - You are about to drop the column `costPerItem` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `crossedPrice` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `sellAfterOutOfStock` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `sellingPrice` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `sku` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `variants` on the `Product` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "InventoryStatus" AS ENUM ('IN_STOCK', 'OUT_OF_STOCK', 'DISCONTINUED');

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "costPerItem",
DROP COLUMN "crossedPrice",
DROP COLUMN "quantity",
DROP COLUMN "sellAfterOutOfStock",
DROP COLUMN "sellingPrice",
DROP COLUMN "sku",
DROP COLUMN "variants",
ADD COLUMN     "inventoryStatus" "InventoryStatus" NOT NULL DEFAULT 'IN_STOCK';

-- CreateTable
CREATE TABLE "Variant" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "productId" TEXT NOT NULL,

    CONSTRAINT "Variant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VariantValue" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "sellingPrice" DOUBLE PRECISION NOT NULL,
    "crossedPrice" DOUBLE PRECISION NOT NULL,
    "costPerItem" DOUBLE PRECISION NOT NULL,
    "quantity" INTEGER NOT NULL,
    "sku" TEXT NOT NULL,
    "sellAfterOutOfStock" BOOLEAN NOT NULL,
    "inventoryStatus" "InventoryStatus" NOT NULL,
    "images" TEXT[],
    "variantId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VariantValue_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Variant" ADD CONSTRAINT "Variant_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VariantValue" ADD CONSTRAINT "VariantValue_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "Variant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
