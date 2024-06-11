"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = __importDefault(require("express"));
const db_1 = require("./db");
exports.userRouter = express_1.default.Router();
// get all users
exports.userRouter.get('/', async (req, res) => {
    const users = await db_1.prisma.user.findMany();
    const responseBody = [];
    for (const user of users) {
        responseBody.push(user);
    }
    res.json(responseBody);
});
// create a new user
exports.userRouter.post('/', async (req, res) => {
    const { email, name } = req.body;
    const newUser = await db_1.prisma.user.create({
        data: {
            email,
            name
        }
    });
    res.json({
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
    });
});
//# sourceMappingURL=user-router.js.map