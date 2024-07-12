"use strict";
/** @format */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const post_interface_1 = require("../db/interfaces/post.interface");
const author_interface_1 = require("../db/interfaces/author.interface");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const BASE_URL = process.env.BASE_URL;
const postRoute = express_1.default.Router();
const deleteFile = require("../utils/deleteFile");
// ! -------------IMAGE UPLOAD-------------------
const storage = multer_1.default.diskStorage({
    destination: "./uploadedCoverImages",
    filename: (req, image, callback) => {
        console.log("===========uploading image==============");
        const uniqueName = image.originalname.split(".")[0] +
            "_" +
            Date.now() +
            path_1.default.extname(image.originalname);
        return callback(null, uniqueName);
    },
});
const upload = (0, multer_1.default)({
    storage: storage,
});
postRoute.use("/image", express_1.default.static("uploadedCoverImages/"));
// ! -------------------------------------------------
// ! ----------------------------------------------------------------------
// !-------------------GET ALL AUTHORS-----------------------
postRoute.post("/addpost", authMiddleware_1.default, upload.single("cover_image"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.file) {
        console.log("there is no image so return...");
        return;
    }
    // Parse tags to ensure it's an array
    let tags;
    try {
        tags = JSON.parse(req.body.tags);
        if (!Array.isArray(tags)) {
            throw new Error("Tags should be an array");
        }
    }
    catch (error) {
        return res.status(400).json({ error: "Invalid tags format" });
    }
    const postData = {
        author_id: req.user.id,
        isPublished: true,
        title: req.body.title,
        content: req.body.content,
        summary: req.body.summary,
        cover_image: req.file.filename,
        tags: tags,
    };
    const isAvailable = yield author_interface_1.Author.findOne({
        where: {
            id: req.user.id,
        },
    });
    // check if user already exists or not if exist show user exist else registration is successful and user is directed to login page
    if (!isAvailable) {
        res.status(400).send("User Not Exists");
        return;
    }
    // ADDING THE REGISTERED DATA IN DB (author)
    var user = yield post_interface_1.Post.create(postData);
    if (!user) {
        return res.status(400).json("unable to add");
    }
    return res.status(200).json(user);
}));
// !--------------------------------------------------------------
// !--------------------DELETE A PARTICULAR POST OF A PARTICULAR AUTHOR---
postRoute.delete("/deletepost/:id", authMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const post = yield post_interface_1.Post.findOne({
            where: {
                id: parseInt(req.params.id),
            },
        });
        if (!post) {
            return res.json("post does not exists");
        }
        if (post.cover_image) {
            // Delete the image
            deleteFile(path_1.default.join("uploadedCoverImages", post.cover_image));
        }
        const deletedPost = yield post_interface_1.Post.destroy({
            where: {
                id: parseInt(req.params.id),
            },
        });
        return res.status(200).json(deletedPost);
    }
    catch (error) { }
}));
// ! ----------------------------------------------------------------------
// !-------------------GET ALL BLOGS-----------------------
postRoute.get("/getallpost", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield post_interface_1.Post.findAll();
        if (!users) {
            return res.json("User not Exist");
        }
        try {
            const response = users.map((user) => ({
                id: user.id,
                author_id: user.author_id,
                title: user.title,
                content: user.content,
                cover_image: `${BASE_URL}/image/${user.cover_image}`,
                summary: user.summary,
                isPublished: user.isPublished,
            }));
            return res.status(200).send(response);
        }
        catch (error) { }
    }
    catch (error) { }
}));
// ! ----------------------------------------------------------------------
// !-------------------GET BLOG BY ID-----------------------
postRoute.get("/getblog/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const post = yield post_interface_1.Post.findOne({
            where: {
                id: parseInt(req.params.id),
            },
        });
        if (!post) {
            return res.status(404).json("Post not Exist");
        }
        const response = {
            id: post.id,
            author_id: post.author_id,
            title: post.title,
            content: post.content,
            cover_image: `${BASE_URL}/image/${post.cover_image}`,
            summary: post.summary,
            isPublished: post.isPublished,
        };
        return res.status(200).send(response);
    }
    catch (error) {
        return res.status(500).json("An error occurred");
    }
}));
// ! updating the post
postRoute.put("/updatepost/:id", authMiddleware_1.default, upload.single("cover_image"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = req.params.id;
    const { title, content, summary, tags } = req.body;
    let cover_image;
    if (req.file) {
        cover_image = req.file.filename;
    }
    try {
        // Fetch the existing post
        const post = yield post_interface_1.Post.findByPk(postId);
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }
        // Check if the cover image is different
        if (cover_image && post.cover_image !== cover_image) {
            // Delete the old image
            deleteFile(path_1.default.join("uploadedCoverImages", post.cover_image));
        }
        // Update the post
        yield post.update({
            title,
            content,
            summary,
            tags: JSON.parse(tags),
            cover_image: cover_image || post.cover_image, // Use existing image if new one not provided
        });
        return res.status(200).json(post);
    }
    catch (error) {
        console.error("Error updating post:", error);
        return res
            .status(500)
            .json({ error: "An error occurred while updating the post" });
    }
}));
exports.default = postRoute;
