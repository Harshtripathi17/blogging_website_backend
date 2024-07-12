"use strict";
/** @format */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app = (0, express_1.default)();
const cors_1 = __importDefault(require("cors"));
const author_route_1 = __importDefault(require("./routes/author.route"));
const blog_post_route_1 = __importDefault(require("./routes/blog-post.route"));
var corsOption = {
    origin: "http://localhost:4200",
};
app.use((0, cors_1.default)(corsOption));
app.use(body_parser_1.default.json());
app.use((0, cookie_parser_1.default)());
// ! author
app.use("/", author_route_1.default);
// ! posting
app.use("/", blog_post_route_1.default);
const port = process.env.BACKEND_PORT_NUMBER || 4000;
app.listen(port, () => {
    console.log(`[server]: Server is running`);
});
