/** @format */

import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const secretKey: any = process.env.SECRET_KEY;

async function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.headers["authorization"]?.split(" ")[1];

    if (!token) {
      return res.sendStatus(401); // Unauthorized
    }

    jwt.verify(token, secretKey, (err: any, user: any) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          return res.status(401).json({ message: "Token Expired" });
        }
        return res.status(401).json({ message: "Unauthorized" });
      }

      req.user = {
        email: user.email,
        id: user.id,
      };
      next();
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

export default authenticateToken;
