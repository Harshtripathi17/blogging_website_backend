/** @format */

import express, { Router, Request, Response } from "express";
import { Post } from "../db/interfaces/post.interface";

import { Author } from "../db/interfaces/author.interface";
import multer from "multer";
import path from "path";
import authenticateToken from "../middleware/authMiddleware";
const BASE_URL = process.env.BASE_URL;

const postRoute: Router = express.Router();
const deleteFile = require("../utils/deleteFile");

// ! -------------IMAGE UPLOAD-------------------

const storage = multer.diskStorage({
  destination: "./uploadedCoverImages",
  filename: (req, image, callback) => {
    console.log("===========uploading image==============");
    const uniqueName =
      image.originalname.split(".")[0] +
      "_" +
      Date.now() +
      path.extname(image.originalname);
    return callback(null, uniqueName);
  },
});

const upload = multer({
  storage: storage,
});
postRoute.use("/image", express.static("uploadedCoverImages/"));
// ! -------------------------------------------------

// ! ----------------------------------------------------------------------
// !-------------------GET ALL AUTHORS-----------------------
postRoute.post(
  "/addpost",
  authenticateToken,
  upload.single("cover_image"),
  async (req: Request, res: Response) => {
    if (!req.file) {
      console.log("there is no image so return...");
      return;
    }

    // Parse tags to ensure it's an array
    let tags: string[];
    try {
      tags = JSON.parse(req.body.tags);
      if (!Array.isArray(tags)) {
        throw new Error("Tags should be an array");
      }
    } catch (error) {
      return res.status(400).json({ error: "Invalid tags format" });
    }

    const postData: any = {
      author_id: req.user.id,
      isPublished: true,
      title: req.body.title,
      content: req.body.content,
      summary: req.body.summary,
      cover_image: req.file.filename,
      tags: tags,
    };
    const isAvailable = await Author.findOne({
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
    var user = await Post.create(postData);
    if (!user) {
      return res.status(400).json("unable to add");
    }
    return res.status(200).json(user);
  }
);

// !--------------------------------------------------------------
// !--------------------DELETE A PARTICULAR POST OF A PARTICULAR AUTHOR---
postRoute.delete(
  "/deletepost/:id",
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const post = await Post.findOne({
        where: {
          id: parseInt(req.params.id),
        },
      });
      if (!post) {
        return res.json("post does not exists");
      }
      if (post.cover_image) {
        // Delete the image
        deleteFile(path.join("uploadedCoverImages", post.cover_image));
      }
      const deletedPost = await Post.destroy({
        where: {
          id: parseInt(req.params.id),
        },
      });
      return res.status(200).json(deletedPost);
    } catch (error: any) {}
  }
);

// ! ----------------------------------------------------------------------
// !-------------------GET ALL BLOGS-----------------------
postRoute.get("/getallpost", async (req: Request, res: Response) => {
  try {
    const users = await Post.findAll();
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
    } catch (error: any) {}
  } catch (error: any) {}
});

// ! ----------------------------------------------------------------------
// !-------------------GET BLOG BY ID-----------------------
postRoute.get("/getblog/:id", async (req: Request, res: Response) => {
  try {
    const post = await Post.findOne({
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
  } catch (error: any) {
    return res.status(500).json("An error occurred");
  }
});

// ! updating the post
postRoute.put(
  "/updatepost/:id",
  authenticateToken,
  upload.single("cover_image"),
  async (req: Request, res: Response) => {
    const postId = req.params.id;
    const { title, content, summary, tags } = req.body;
    let cover_image;

    if (req.file) {
      cover_image = req.file.filename;
    }

    try {
      // Fetch the existing post
      const post = await Post.findByPk(postId);

      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }

      // Check if the cover image is different
      if (cover_image && post.cover_image !== cover_image) {
        // Delete the old image
        deleteFile(path.join("uploadedCoverImages", post.cover_image));
      }

      // Update the post
      await post.update({
        title,
        content,
        summary,
        tags: JSON.parse(tags),
        cover_image: cover_image || post.cover_image, // Use existing image if new one not provided
      });

      return res.status(200).json(post);
    } catch (error) {
      console.error("Error updating post:", error);
      return res
        .status(500)
        .json({ error: "An error occurred while updating the post" });
    }
  }
);
export default postRoute;
