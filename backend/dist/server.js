"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const user_router_1 = require("./user-router");
const course_router_1 = require("./course-router");
const app = (0, express_1.default)();
const port = 8000;
app.use((0, cors_1.default)({ origin: '*' }));
app.use(express_1.default.json());
app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.use('/user', user_router_1.userRouter);
app.use('/course', course_router_1.courseRouter);
app.listen(port, () => {
    console.log(`Example app listening on http://localhost:${port}`);
});
//# sourceMappingURL=server.js.map