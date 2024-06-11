"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = __importDefault(require("express"));
const db_1 = require("./db");
const middleware_1 = require("./middleware");
exports.userRouter = express_1.default.Router();
// get all users
exports.userRouter.get('/', async (req, res) => {
    const users = await db_1.prisma.user.findMany();
    const responseBody = [];
    for (const user of users) {
        responseBody.push({
            // important!!! we only return non-sensitive data
            name: user.name,
            id: user.id,
        });
    }
    res.json(responseBody);
});
// create a new user
exports.userRouter.post('/', middleware_1.requireAuth, async (req, res) => {
    const { email, uid } = req.token;
    const firebaseUser = await middleware_1.auth.getUser(uid);
    if (email.trim().length === 0)
        throw new Error('email is required');
    const newUser = await db_1.prisma.user.upsert({
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
    });
    res.json({
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
    });
});
//# sourceMappingURL=user-router.js.map