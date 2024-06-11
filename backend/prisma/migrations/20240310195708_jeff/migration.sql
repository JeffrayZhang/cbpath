-- CreateTable
CREATE TABLE "Reviews" (
    "id" SERIAL NOT NULL,
    "course_code" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "review" TEXT NOT NULL,

    CONSTRAINT "Reviews_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Reviews" ADD CONSTRAINT "Reviews_course_code_fkey" FOREIGN KEY ("course_code") REFERENCES "Course"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reviews" ADD CONSTRAINT "Reviews_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
