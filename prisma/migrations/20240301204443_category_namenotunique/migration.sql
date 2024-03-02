-- AlterEnum
ALTER TYPE "ProductStatus" ADD VALUE 'ARCHIVED';

-- DropIndex
DROP INDEX "Category_name_key";
