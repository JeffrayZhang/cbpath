import { type DecodedIdToken } from 'firebase-admin/lib/auth'

declare module 'express-serve-static-core' {
    export interface Request {
        token?: DecodedIdToken
    }
}
