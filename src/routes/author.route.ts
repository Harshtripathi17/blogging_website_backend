/** @format */

import express, { Router, Request, Response } from "express";
import { Author } from "../db/interfaces/author.interface";
import multer from "multer";
import path from "path";
import { Op } from "sequelize";
import bcrypt from "bcryptjs";
import { generateToken } from "../middleware/jwtGenerator";
import authenticateToken from "../middleware/authMiddleware";
import { Post } from "../db/interfaces/post.interface";
const BASE_URL = process.env.BASE_URL;

const authorRoute: Router = express.Router();
const deleteFile = require("../utils/deletefile");

// ! -------------IMAGE UPLOAD-------------------

const storage = multer.diskStorage({
  destination: "./uploadedImages",
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
authorRoute.use("/image", express.static("uploadedImages/"));
// ! -------------------------------------------------

// ! ----------------------------------------------------------------------
// !-------------------REGISTER-----------------------
authorRoute.post(
  "/register",
  upload.single("profile_picture"),
  async (req: Request, res: Response) => {
    if (!req.file) {
      console.log("there is no image so return...");
      return;
    }

    const postData = req.body;
    const isAvailable = await Author.findOne({
      where: {
        email: {
          [Op.iLike]: postData.email,
        },
      },
    });
    // check if user already exists or not if exist show user exist else registration is successful and user is directed to login page
    if (isAvailable) {
      res.status(400).send("User Already Exists");
      return;
    }

    // creating password
    const salt = await bcrypt.genSaltSync(10);
    postData.password = await bcrypt.hashSync(postData.password, salt);
    postData.profile_picture = req.file?.filename;

    // ADDING THE REGISTERED DATA IN DB (author)
    var user = await Author.create(postData);
    if (!user) {
      return res.status(400).json("unable to register");
    }
    return res.status(200).json(user);
  }
);

// ! ----------------------------------------------------------------------
// !-------------------LOGIN-----------------------
authorRoute.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await Author.findOne({
    where: {
      email: {
        [Op.iLike]: email,
      },
    },
  });

  // user exists or not
  if (!user) {
    res.status(400).send("User not exist.");
    return;
  }

  // checking the password provided is correct or not
  const passMatch = await bcrypt.compareSync(password, user.password);

  if (!passMatch) {
    res.status(400).send({ message: "Password is incorrect" });
    return;
  }
  const token = generateToken({ email: user.email, id: user.id });
  return res.status(200).json({ token });
});

// ! ----------------------------------------------------------------------
// !-------------------GET SINGLE AUTHOR-----------------------
authorRoute.get(
  "/getauthor",
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const user_id = req.user.id;
      const user = await Author.findOne({
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
      } catch (error: any) {}
      // return res.status(200).json(user);
    } catch (error: any) {}
  }
);

// ! ----------------------------------------------------------------------
// !-------------------GET SINGLE AUTHOR-----------------------
authorRoute.get("/getauthor/:id", async (req: Request, res: Response) => {
  try {
    const user_id = parseInt(req.params.id);
    const user = await Author.findOne({
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
  } catch (error: any) {
    return res.status(500).json("An error occurred");
  }
});

// ! ----------------------------------------------------------------------
// !-------------------GET ALL AUTHORS-----------------------
authorRoute.get(
  "/getallauthor",
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const users = await Author.findAll();
      if (!users) {
        return res.json("User not Exist");
      }
      return res.status(200).json(users);
    } catch (error: any) {}
  }
);

// ! ----------------------------------------------------------------------
// !-------------------GET ALL BLOGS-----------------------
authorRoute.get(
  "/getallblogs",
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const users = await Post.findAll({
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
      } catch (error: any) {}
    } catch (error: any) {}
  }
);

// !--------------------------------------------------------------
// !--------------------DELETE A PARTICULAR AUTHOR AND LOGOUT----
authorRoute.delete(
  "/deleteauthor",
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const user = await Author.findOne({
        where: {
          id: req.user.id,
        },
      });
      if (!user) {
        return res.json("User not Exist");
      }
      if (user.profile_picture) {
        // Delete the image
        deleteFile(path.join("uploadedImages", user.profile_picture));
      }
      const deletedAuthor = await Author.destroy({
        where: {
          id: req.user.id,
        },
      });
      return res.status(200).json(deletedAuthor);
    } catch (error: any) {}
  }
);

// ! update the author
authorRoute.put(
  "/updateauthor",
  authenticateToken,
  upload.single("profile_picture"),
  async (req: Request, res: Response) => {
    const authorData = req.body;
    let profile_picture;

    if (req.file) {
      profile_picture = req.file.filename;
    }

    try {
      const author = await Author.findByPk(req.user.id);
      if (!author) {
        return res.status(404).json({ error: "Author Data not found" });
      }

      const existingImage = author.profile_picture;

      // Check if the new image is different
      if (profile_picture && existingImage !== profile_picture) {
        // Delete the old image if different
        deleteFile(path.join("uploadedImages", existingImage));
      }

      const updatedAuthor = await author.update({
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
    } catch (error) {
      console.error("Error updating author record:", error);
      res
        .status(500)
        .json({ error: "An error occurred while updating the author record" });
    }
  }
);
export default authorRoute;
