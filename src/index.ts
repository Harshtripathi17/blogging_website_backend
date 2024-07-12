/** @format */

import express, { Express } from "express";
import dotenv from "dotenv";
dotenv.config();
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

const app: Express = express();
import cors from "cors";
import authorRoute from "./routes/author.route";
import postRoute from "./routes/blog-post.route";
var corsOption = {
  origin: "http://localhost:4200",
};
app.use(cors(corsOption));
app.use(bodyParser.json());
app.use(cookieParser());

// ! author
app.use("/", authorRoute);

// ! posting
app.use("/", postRoute);

const port = process.env.BACKEND_PORT_NUMBER || 4000;

app.listen(port, () => {
  console.log(`[server]: Server is running`);
});
