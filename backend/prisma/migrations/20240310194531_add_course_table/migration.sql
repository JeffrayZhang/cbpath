-- CreateTable
CREATE TABLE "Course" (
    "code" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "is_ib_course" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "StudentRelationship" (
    "id" SERIAL NOT NULL,
    "course_code" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "StudentRelationship_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "StudentRelationship" ADD CONSTRAINT "StudentRelationship_course_code_fkey" FOREIGN KEY ("course_code") REFERENCES "Course"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentRelationship" ADD CONSTRAINT "StudentRelationship_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
