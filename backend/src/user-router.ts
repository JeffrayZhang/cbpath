import express from 'express'
import { prisma } from './db';
import { requireAuth, auth } from './middleware';
export const userRouter = express.Router();

// get all users
userRouter.get('/', async (req, res) => {
    const users = await prisma.user.findMany()
    const responseBody = []
    for(const user of users) {
        responseBody.push({
            // important!!! we only return non-sensitive data
            name: user.name,
            id: user.id,
        })
    }
    res.json(responseBody)
})

// create a new user
userRouter.post('/', requireAuth, async (req, res) => {
    const { email, uid } = req.token!;
    const firebaseUser = await auth.getUser(uid)
    if(email.trim().length === 0) throw new Error('email is required')

    const newUser = await prisma.user.upsert({
        where: { firebase_uid: uid },
        create: {
            email,
            name: firebaseUser.displayName,
            firebase_uid: uid,
        },
        update: {
            email,
            name: firebaseUser.displayName,
        }
    })
    res.json({
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
    })
})
