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
// get all reviews
exports.reviewRouter.get('/', async (req, res) => {
    const reviews = await db_1.prisma.user.findMany();
    res.json(reviews);
});
// create a new review or update existing review
exports.reviewRouter.post('/', middleware_1.requireAuth, async (req, res) => {
    const { uid } = req.token;
    const { title, content, course_code, difficulty, interesting, liked, lastUpdated } = req.body;
    const loggedInUser = await db_1.prisma.user.findUnique({ where: { firebase_uid: req.token.uid } });
    if (!title || !content) {
        return res.status(400).json({ error: 'Title and content are needed' });
    }
    // Check if the user has already submitted a review for the given course
    const existingReview = await db_1.prisma.reviews.findFirst({
        where: {
            user_id: loggedInUser.id,
            course_code: course_code
        }
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
                lastUpdated
            }
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
                lastUpdated
            }
        });
        return res.json(newReview);
    }
});
//# sourceMappingURL=review-router.js.map