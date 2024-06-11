/*
  Warnings:

  - The `grade` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "grade",
ADD COLUMN     "grade" INTEGER;
