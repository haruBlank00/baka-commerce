/*
  Warnings:

  - Added the required column `passwords` to the `Owner` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Owner" ADD COLUMN     "passwords" TEXT NOT NULL;
