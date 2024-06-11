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
// create a new review
exports.reviewRouter.post('/', middleware_1.requireAuth, async (req, res) => {
    const { uid } = req.token;
    const { title, content, course, difficulty, interesting, liked, lastUpdated } = req.body;
    const loggedInUser = await db_1.prisma.user.findUnique({ where: { firebase_uid: req.token.uid } });
    if (!title || !content) {
        return res.status(400).json({ error: 'Title and content are needed' });
    }
    const newReview = await db_1.prisma.reviews.create({
        data: {
            title,
            content, user: { connect: { id: loggedInUser.id } },
            course: { connect: { code: course } },
            difficulty, interesting, liked, lastUpdated
        }
    });
    res.json(newReview);
});
//# sourceMappingURL=review-router.js.map