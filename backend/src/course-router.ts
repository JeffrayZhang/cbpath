import express from "express";
import { prisma } from "./db";
import { requireAuth, auth } from "./middleware";
export const courseRouter = express.Router();

//get all courses a course leads to
courseRouter.get("/:courseCode/leadsTo", async (req, res) => {
  const code = req.params["courseCode"];
  const course = await prisma.course.findUnique({ where: { code: code } });
  if (!course) {
    res.status(400).send(`Could not find a course with code ${code}`);
    return;
  }
  const leadsTo = await prisma.course.findMany({
    select: { code: true },
    where: {
      prerequesites: {
        has: code,
      },
    },
  });
  const leadsToArray = leadsTo.map((course) => course.code);
  res.status(200).json(leadsToArray);
});

// get all courses
courseRouter.get("/", requireAuth, async (req, res) => {
  const courses = await prisma.course.findMany({
    include: { student_relationships: true },
  });
  const loggedInUser = await prisma.user.findUnique({
    where: { firebase_uid: req.token!.uid },
  });

  const cleanedCourses = [];
  for (const course of courses) {
    cleanedCourses.push({
      code: course.code,
      title: course.title,
      description: course.description,
      is_ib_course: course.is_ib_course,
      is_enrolled: !!course.student_relationships.find(
        (rel) => rel.user_id === loggedInUser.id,
      ),
      enrollment_count: course.student_relationships.length,
    });
  }
  res.status(200).json(cleanedCourses);
});

// create a new course
courseRouter.post("/", requireAuth, async (req, res) => {
  const courseData = req.body;
  await prisma.course.create({
    data: courseData,
  });
  res.status(200).send("success");
});

// tell DB that I took that course
courseRouter.patch("/:courseCode/enroll", requireAuth, async (req, res) => {
  const courseCode = req.params["courseCode"];
  const course = await prisma.course.findUnique({
    where: { code: courseCode },
  });
  if (!course) {
    res.status(400).send(`Could not find a course with code ${courseCode}`);
    return;
  }

  const loggedInUser = await prisma.user.findUnique({
    where: { firebase_uid: req.token!.uid },
  });
  await prisma.studentRelationship.create({
    data: {
      course_code: courseCode,
      user_id: loggedInUser.id,
    },
  });
  res.status(200).send("success");
});

courseRouter.get("/:courseCode", async (req, res) => {
  const code = req.params["courseCode"];
  const Course = await prisma.course.findUnique({
    where: {
      code: code,
    },
  });
  res.status(200).json(Course);
});
