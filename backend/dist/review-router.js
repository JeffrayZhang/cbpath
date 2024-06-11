"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewRouter = void 0;
const express_1 = __importDefault(require("express"));
const db_1 = require("./db");
const middleware_1 = require("./middleware");
exports.reviewRouter = express_1.default.Router();
//Update the user's original review
exports.reviewRouter.put("/update/:courseID", middleware_1.requireAuth, async (req, res) => {
    const { courseID: courseCode } = req.params;
    const loggedInUser = await db_1.prisma.user.findUnique({
        where: { firebase_uid: req.token.uid },
    });
    const reviewData = req.body;
    const reviews = await db_1.prisma.reviews.update({
        where: {
            course_code_user_id: {
                user_id: loggedInUser.id,
                course_code: courseCode,
            },
        },
        data: reviewData,
    });
    res.status(200).send("success");
});
// Get all reviews under a course
exports.reviewRouter.get("/:courseID", async (req, res) => {
    const { courseID: courseCode } = req.params;
    try {
        const reviews = await db_1.prisma.reviews.findMany({
            where: {
                course_code: courseCode,
            },
        });
        const avgReviews = await db_1.prisma.reviews.aggregate({
            where: {
                course_code: courseCode,
            },
            _avg: {
                difficulty: true,
                interesting: true,
            },
        });
        const numLiked = await db_1.prisma.reviews.count({
            where: {
                course_code: courseCode,
                liked: true,
            },
        });
        res.json({ reviews, avgReviews, numLiked });
    }
    catch (error) {
        console.error("Error fetching reviews:", error);
        res.status(500).json({ error: "Failed to fetch reviews" });
    }
});
//Get the user's review
exports.reviewRouter.get("/:courseID/myreview", middleware_1.requireAuth, async (req, res) => {
    const { courseID: courseCode } = req.params;
    const loggedInUser = await db_1.prisma.user.findUnique({
        where: { firebase_uid: req.token.uid },
    });
    try {
        const reviews = await db_1.prisma.reviews.findUnique({
            where: {
                course_code_user_id: {
                    user_id: loggedInUser.id,
                    course_code: courseCode,
                },
            },
        });
        res.json(reviews);
    }
    catch (error) {
        console.error("Error fetching reviews:", error);
        res.status(500).json({ error: "Failed to fetch reviews" });
    }
});
// Get the average reviews of a course
exports.reviewRouter.get("/:courseID/avgreviews", async (req, res) => {
    const { courseID: courseCode } = req.params;
    try {
        const avgReviews = await db_1.prisma.reviews.aggregate({
            where: {
                course_code: courseCode,
            },
            _avg: {
                difficulty: true,
                interesting: true,
            },
        });
        const numLiked = await db_1.prisma.reviews.count({
            where: {
                course_code: courseCode,
                liked: true,
            },
        });
        res.json({ avgReviews, numLiked });
    }
    catch (error) {
        console.error("Error fetching average reviews:", error);
        res.status(500).json({ error: "Failed to fetch average reviews" });
    }
});
// create a new review or update existing review
exports.reviewRouter.post("/", middleware_1.requireAuth, async (req, res) => {
    const { uid } = req.token;
    const { title, content, course_code, difficulty, interesting, liked, lastUpdated, } = req.body;
    const loggedInUser = await db_1.prisma.user.findUnique({
        where: { firebase_uid: req.token.uid },
    });
    if (!title || !content) {
        return res.status(400).json({ error: "Title and content are needed" });
    }
    // Check if the user has already submitted a review for the given course
    const existingReview = await db_1.prisma.reviews.findUnique({
        where: {
            course_code_user_id: {
                user_id: loggedInUser.id,
                course_code: course_code,
            },
        },
    });
    if (existingReview) {
        // Update existing review
        const updatedReview = await db_1.prisma.reviews.update({
            where: { id: existingReview.id },
            data: {
                title,
                content,
                difficulty,
                interesting,
                liked,
                lastUpdated,
            },
        });
        return res.json(updatedReview);
    }
    else {
        // Create new review
        const newReview = await db_1.prisma.reviews.create({
            data: {
                title,
                content,
                user: { connect: { id: loggedInUser.id } },
                course: { connect: { code: course_code } },
                difficulty,
                interesting,
                liked,
                lastUpdated,
            },
        });
        return res.json(newReview);
    }
});
//# sourceMappingURL=review-router.js.map