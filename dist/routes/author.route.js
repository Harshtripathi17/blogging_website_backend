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
const author_interface_1 = require("../db/interfaces/author.interface");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const sequelize_1 = require("sequelize");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jwtGenerator_1 = require("../middleware/jwtGenerator");
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const post_interface_1 = require("../db/interfaces/post.interface");
const BASE_URL = process.env.BASE_URL;
const authorRoute = express_1.default.Router();
const deleteFile = require("../utils/deletefile");
// ! -------------IMAGE UPLOAD-------------------
const storage = multer_1.default.diskStorage({
    destination: "./uploadedImages",
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
authorRoute.use("/image", express_1.default.static("uploadedImages/"));
// ! -------------------------------------------------
// ! ----------------------------------------------------------------------
// !-------------------REGISTER-----------------------
authorRoute.post("/register", upload.single("profile_picture"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (!req.file) {
        console.log("there is no image so return...");
        return;
    }
    const postData = req.body;
    const isAvailable = yield author_interface_1.Author.findOne({
        where: {
            email: {
                [sequelize_1.Op.iLike]: postData.email,
            },
        },
    });
    // check if user already exists or not if exist show user exist else registration is successful and user is directed to login page
    if (isAvailable) {
        res.status(400).send("User Already Exists");
        return;
    }
    // creating password
    const salt = yield bcryptjs_1.default.genSaltSync(10);
    postData.password = yield bcryptjs_1.default.hashSync(postData.password, salt);
    postData.profile_picture = (_a = req.file) === null || _a === void 0 ? void 0 : _a.filename;
    // ADDING THE REGISTERED DATA IN DB (author)
    var user = yield author_interface_1.Author.create(postData);
    if (!user) {
        return res.status(400).json("unable to register");
    }
    return res.status(200).json(user);
}));
// ! ----------------------------------------------------------------------
// !-------------------LOGIN-----------------------
authorRoute.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = yield author_interface_1.Author.findOne({
        where: {
            email: {
                [sequelize_1.Op.iLike]: email,
            },
        },
    });
    // user exists or not
    if (!user) {
        res.status(400).send("User not exist.");
        return;
    }
    // checking the password provided is correct or not
    const passMatch = yield bcryptjs_1.default.compareSync(password, user.password);
    if (!passMatch) {
        res.status(400).send({ message: "Password is incorrect" });
        return;
    }
    const token = (0, jwtGenerator_1.generateToken)({ email: user.email, id: user.id });
    return res.status(200).json({ token });
}));
// ! ----------------------------------------------------------------------
// !-------------------GET SINGLE AUTHOR-----------------------
authorRoute.get("/getauthor", authMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user_id = req.user.id;
        const user = yield author_interface_1.Author.findOne({
            where: {
                id: user_id,
            },
        });
        if (!user) {
            return res.json("User not Exist");
        }
        try {
            const response = {
                id: user_id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                website_name: user.website_name,
                linkedin_url: user.linkedin_url,
                twitter_url: user.twitter_url,
                bio: user.bio,
                profile_picture: `${BASE_URL}/image/${user.profile_picture}`,
            };
            return res.status(200).send(response);
        }
        catch (error) { }
        // return res.status(200).json(user);
    }
    catch (error) { }
}));
// ! ----------------------------------------------------------------------
// !-------------------GET SINGLE AUTHOR-----------------------
authorRoute.get("/getauthor/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user_id = parseInt(req.params.id);
        const user = yield author_interface_1.Author.findOne({
            where: {
                id: user_id,
            },
        });
        if (!user) {
            return res.status(404).json("User not Exist");
        }
        const response = {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            website_name: user.website_name,
            linkedin_url: user.linkedin_url,
            twitter_url: user.twitter_url,
            bio: user.bio,
            profile_picture: `${BASE_URL}/image/${user.profile_picture}`,
        };
        return res.status(200).send(response);
    }
    catch (error) {
        return res.status(500).json("An error occurred");
    }
}));
// ! ----------------------------------------------------------------------
// !-------------------GET ALL AUTHORS-----------------------
authorRoute.get("/getallauthor", authMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield author_interface_1.Author.findAll();
        if (!users) {
            return res.json("User not Exist");
        }
        return res.status(200).json(users);
    }
    catch (error) { }
}));
// ! ----------------------------------------------------------------------
// !-------------------GET ALL BLOGS-----------------------
authorRoute.get("/getallblogs", authMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield post_interface_1.Post.findAll({
            where: {
                author_id: req.user.id,
            },
        });
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
// !--------------------------------------------------------------
// !--------------------DELETE A PARTICULAR AUTHOR AND LOGOUT----
authorRoute.delete("/deleteauthor", authMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield author_interface_1.Author.findOne({
            where: {
                id: req.user.id,
            },
        });
        if (!user) {
            return res.json("User not Exist");
        }
        if (user.profile_picture) {
            // Delete the image
            deleteFile(path_1.default.join("uploadedImages", user.profile_picture));
        }
        const deletedAuthor = yield author_interface_1.Author.destroy({
            where: {
                id: req.user.id,
            },
        });
        return res.status(200).json(deletedAuthor);
    }
    catch (error) { }
}));
// ! update the author
authorRoute.put("/updateauthor", authMiddleware_1.default, upload.single("profile_picture"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const authorData = req.body;
    let profile_picture;
    if (req.file) {
        profile_picture = req.file.filename;
    }
    try {
        const author = yield author_interface_1.Author.findByPk(req.user.id);
        if (!author) {
            return res.status(404).json({ error: "Author Data not found" });
        }
        const existingImage = author.profile_picture;
        // Check if the new image is different
        if (profile_picture && existingImage !== profile_picture) {
            // Delete the old image if different
            deleteFile(path_1.default.join("uploadedImages", existingImage));
        }
        const updatedAuthor = yield author.update({
            name: authorData.name || author.name,
            email: authorData.email || author.email,
            phone: authorData.phone || author.phone,
            bio: authorData.bio || author.bio,
            website_name: authorData.website_name || author.website_name,
            twitter_url: authorData.twitter_url || author.twitter_url,
            linkedin_url: authorData.linkedin_url || author.linkedin_url,
            profile_picture: profile_picture || author.profile_picture,
        });
        return res.status(200).json(updatedAuthor);
    }
    catch (error) {
        console.error("Error updating author record:", error);
        res
            .status(500)
            .json({ error: "An error occurred while updating the author record" });
    }
}));
exports.default = authorRoute;
