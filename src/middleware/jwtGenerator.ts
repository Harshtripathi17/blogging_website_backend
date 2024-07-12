/** @format */

import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const secretKey: any = process.env.SECRET_KEY;
export function generateToken(user: any): string {
  // return type is string
  return jwt.sign(user, secretKey, { expiresIn: process.env.EXPIRE_TIME });
}
