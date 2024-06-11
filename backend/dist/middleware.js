"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = exports.auth = void 0;
const app_1 = require("firebase-admin/app");
const auth_1 = require("firebase-admin/auth");
const db_1 = require("./db");
const app = (0, app_1.initializeApp)({
    credential: (0, app_1.cert)(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT))
});
exports.auth = (0, auth_1.getAuth)(app);
async function requireAuth(req, res, next) {
    const idToken = req.headers['idtoken'];
    if (typeof idToken !== 'string')
        return res.status(401).send('Unauthorized');
    // bypass for development
    if (process.env.NODE_ENV !== 'production' && req.headers['test-user-override']) {
        const user = await getOrCreateTestUser();
        req.token = { email: user.email, uid: user.firebase_uid };
        next();
        return;
    }
    try {
        const decodedToken = await exports.auth.verifyIdToken(idToken);
        req.token = decodedToken;
        next();
        return;
    }
    catch (error) {
        console.error('failed to verify ID token', error);
        return res.status(401).send('Unauthorized');
    }
}
exports.requireAuth = requireAuth;
async function getOrCreateTestUser() {
    let user = await db_1.prisma.user.findUnique({ where: { firebase_uid: 'abc' } });
    if (!user) {
        user = await db_1.prisma.user.create({
            data: {
                email: 'test@oisdjoiajcoia.com',
                firebase_uid: 'abc',
                name: 'testuser',
            }
        });
    }
    return user;
}
//# sourceMappingURL=middleware.js.map