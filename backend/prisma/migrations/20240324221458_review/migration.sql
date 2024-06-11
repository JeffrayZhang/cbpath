/*
  Warnings:

  - Added the required column `elective` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `difficulty` to the `Reviews` table without a default value. This is not possible if the table is not empty.
  - Added the required column `interesting` to the `Reviews` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastUpdated` to the `Reviews` table without a default value. This is not possible if the table is not empty.
  - Added the required column `liked` to the `Reviews` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "elective" BOOLEAN NOT NULL,
ADD COLUMN     "prerequesites" TEXT[],
ALTER COLUMN "description" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Reviews" ADD COLUMN     "difficulty" INTEGER NOT NULL,
ADD COLUMN     "interesting" INTEGER NOT NULL,
ADD COLUMN     "lastUpdated" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "liked" BOOLEAN NOT NULL,
ALTER COLUMN "title" DROP NOT NULL,
ALTER COLUMN "content" DROP NOT NULL;
