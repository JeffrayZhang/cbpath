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
exports.userRouter.delete("/delete", middleware_1.requireAuth, async (req, res) => {
    const { uid } = req.token;
    const user = await db_1.prisma.user.findUnique({
        where: { firebase_uid: uid },
    });
    await db_1.prisma.reviews.deleteMany({
        where: {
            user_id: user.id,
        },
    });
    await db_1.prisma.user.delete({
        where: {
            id: user.id,
        },
    });
    res.status(200).send("success");
});
// get all users
exports.userRouter.get("/", async (req, res) => {
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
exports.userRouter.post("/", middleware_1.requireAuth, async (req, res) => {
    const { email, uid } = req.token;
    const firebaseUser = await middleware_1.auth.getUser(uid);
    if (email.trim().length === 0)
        throw new Error("email is required");
    const oldUser = await db_1.prisma.user.findUnique({
        where: { firebase_uid: uid },
    });
    const needsMoreInfo = !oldUser;
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
        },
    });
    res.json({
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        needsMoreInfo,
    });
});
exports.userRouter.put("/", middleware_1.requireAuth, async (req, res) => {
    const { email, uid } = req.token;
    const firebaseUser = await middleware_1.auth.getUser(uid);
    const userData = req.body;
    const user = await db_1.prisma.user.update({
        where: {
            firebase_uid: uid,
        },
        data: userData,
    });
    res.status(200).send("success");
});
exports.userRouter.get("/currentUser", middleware_1.requireAuth, async (req, res) => {
    const { email, uid } = req.token;
    const firebaseUser = await middleware_1.auth.getUser(uid);
    const userData = req.body;
    const user = await db_1.prisma.user.findUnique({
        where: {
            firebase_uid: uid,
        },
    });
    res.status(200).json(user);
});
//# sourceMappingURL=user-router.js.map