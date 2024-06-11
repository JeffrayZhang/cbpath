import { NextFunction, Request, Response } from "express";
import { initializeApp, cert } from 'firebase-admin/app'
import { DecodedIdToken, getAuth } from 'firebase-admin/auth'
import { prisma } from "./db";

const app = initializeApp({
    credential: cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT))
})
export const auth = getAuth(app)

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
    const idToken = req.headers['idtoken']
    if (typeof idToken !== 'string') return res.status(401).send('Unauthorized');
    
    // bypass for development
    if(process.env.NODE_ENV !== 'production' && req.headers['test-user-override']) {
        const user = await getOrCreateTestUser()
        req.token = { email: user.email, uid: user.firebase_uid } as DecodedIdToken
        next()
        return
    }
    
    try {
        const decodedToken = await auth.verifyIdToken(idToken)
        req.token = decodedToken
        next()
        return
    } catch(error) {
        console.error('failed to verify ID token', error)
        return res.status(401).send('Unauthorized');
    }
}


async function getOrCreateTestUser() {
    let user = await prisma.user.findUnique({ where: { firebase_uid: 'abc' }})
    if(!user) {
        user = await prisma.user.create({
            data: {
                email: 'test@oisdjoiajcoia.com',
                firebase_uid: 'abc',
                name: 'testuser',
            }
        })
    }
    return user
}
