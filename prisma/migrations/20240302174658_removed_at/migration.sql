-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "removed" BOOLEAN,
ADD COLUMN     "removedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "removed" BOOLEAN,
ADD COLUMN     "removedAt" TIMESTAMP(3);
