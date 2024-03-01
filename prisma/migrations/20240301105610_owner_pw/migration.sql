/*
  Warnings:

  - You are about to drop the column `passwords` on the `Owner` table. All the data in the column will be lost.
  - Added the required column `password` to the `Owner` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Owner" DROP COLUMN "passwords",
ADD COLUMN     "password" TEXT NOT NULL;
