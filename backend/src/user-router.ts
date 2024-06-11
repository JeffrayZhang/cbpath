import express from 'express'
import { prisma } from './db';
export const userRouter = express.Router();

// get all users
userRouter.get('/', async (req, res) => {
    const users = await prisma.user.findMany()
    const responseBody = []
    for(const user of users) {
        responseBody.push(user)
    }
    res.json(responseBody)
})

// create a new user
userRouter.post('/', async (req, res) => {
    const { email, name } = req.body
    const newUser = await prisma.user.create({
        data: {
            email,
            name
        }
    })
    res.json({
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
    })
})
