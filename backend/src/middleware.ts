import { NextFunction, Request, Response } from "express";
import { initializeApp, cert } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'

const app = initializeApp({
    credential: cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT))
})
export const auth = getAuth(app)

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
    const idToken = req.headers['idtoken']
    if (typeof idToken !== 'string') return res.status(401).send('Unauthorized');
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
