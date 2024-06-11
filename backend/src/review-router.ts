import express from 'express'
import { prisma } from './db';
import { requireAuth, auth } from './middleware';
export const reviewRouter = express.Router();

// get all reviews
reviewRouter.get('/', async (req, res) => {
    const reviews = await prisma.user.findMany()
    res.json(reviews);
})

// create a new review
reviewRouter.post('/', requireAuth, async (req, res) => {
    const {uid} = req.token!;
    const {title, content, course } = req.body!;
    const loggedInUser = await prisma.user.findUnique({ where: { firebase_uid: req.token!.uid } })
 
if(!title || !content){
    return res.status(400).json({error:'Title and content are needed'})
}
 const newReview = await prisma.reviews.create({
    data: {
        title,
        content,user:{connect:{id:loggedInUser.id}},
        course:{connect:{code:course}}
    }
 })
 res.json(newReview);
})
