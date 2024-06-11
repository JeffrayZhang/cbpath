import express from 'express'
import { prisma } from './db';
import { requireAuth, auth } from './middleware';
export const reviewRouter = express.Router();

// get all reviews
reviewRouter.get('/', async (req, res) => {
    const reviews = await prisma.user.findMany()
    res.json(reviews);
})

// create a new review or update existing review
reviewRouter.post('/', requireAuth, async (req, res) => {
    const { uid } = req.token!;
    const { title, content, course_code, difficulty, interesting, liked, lastUpdated } = req.body!;
    const loggedInUser = await prisma.user.findUnique({ where: { firebase_uid: req.token!.uid } })

    if (!title || !content) {
        return res.status(400).json({ error: 'Title and content are needed' })
    }

    // Check if the user has already submitted a review for the given course
    const existingReview = await prisma.reviews.findFirst({
        where: {
            user_id: loggedInUser.id,
            course_code: course_code
        }
    });

    if (existingReview) {
        // Update existing review
        const updatedReview = await prisma.reviews.update({
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
    } else {
        // Create new review
        const newReview = await prisma.reviews.create({
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
