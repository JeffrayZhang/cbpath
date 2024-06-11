"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.courseRouter = void 0;
const express_1 = __importDefault(require("express"));
const db_1 = require("./db");
const middleware_1 = require("./middleware");
exports.courseRouter = express_1.default.Router();
//get all courses a course leads to
exports.courseRouter.get("/:courseCode/leadsTo", async (req, res) => {
    const code = req.params["courseCode"];
    const course = await db_1.prisma.course.findUnique({ where: { code: code } });
    if (!course) {
        res.status(400).send(`Could not find a course with code ${code}`);
        return;
    }
    const leadsTo = await db_1.prisma.course.findMany({
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
exports.courseRouter.get("/", middleware_1.requireAuth, async (req, res) => {
    const courses = await db_1.prisma.course.findMany({
        include: { student_relationships: true },
    });
    const loggedInUser = await db_1.prisma.user.findUnique({
        where: { firebase_uid: req.token.uid },
    });
    const cleanedCourses = [];
    for (const course of courses) {
        cleanedCourses.push({
            code: course.code,
            title: course.title,
            description: course.description,
            is_ib_course: course.is_ib_course,
            is_enrolled: !!course.student_relationships.find((rel) => rel.user_id === loggedInUser.id),
            enrollment_count: course.student_relationships.length,
        });
    }
    res.status(200).json(cleanedCourses);
});
// create a new course
exports.courseRouter.post("/", middleware_1.requireAuth, async (req, res) => {
    const courseData = req.body;
    await db_1.prisma.course.create({
        data: courseData,
    });
    res.status(200).send("success");
});
// tell DB that I took that course
exports.courseRouter.patch("/:courseCode/enroll", middleware_1.requireAuth, async (req, res) => {
    const courseCode = req.params["courseCode"];
    const course = await db_1.prisma.course.findUnique({
        where: { code: courseCode },
    });
    if (!course) {
        res.status(400).send(`Could not find a course with code ${courseCode}`);
        return;
    }
    const loggedInUser = await db_1.prisma.user.findUnique({
        where: { firebase_uid: req.token.uid },
    });
    await db_1.prisma.studentRelationship.create({
        data: {
            course_code: courseCode,
            user_id: loggedInUser.id,
        },
    });
    res.status(200).send("success");
});
exports.courseRouter.get("/:courseCode", async (req, res) => {
    const code = req.params["courseCode"];
    const Course = await db_1.prisma.course.findUnique({
        where: {
            code: code,
        },
    });
    res.status(200).json(Course);
});
//# sourceMappingURL=course-router.js.map