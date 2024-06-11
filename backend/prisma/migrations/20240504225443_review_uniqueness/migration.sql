/*
  Warnings:

  - A unique constraint covering the columns `[course_code,user_id]` on the table `Reviews` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Reviews_course_code_user_id_key" ON "Reviews"("course_code", "user_id");
