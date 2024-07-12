/** @format */

import { Sequelize } from "sequelize-typescript";
import express from "express";
import dotenv from "dotenv";
dotenv.config();

const database = process.env.DATABASE;
const username = process.env.USER_NAME;
const password = process.env.PASSWORD;
const host = process.env.HOST;

let sequelize: any;

if (process.env.DB_URL) {
  sequelize = new Sequelize(process.env.DB_URL);
} else {
  sequelize = new Sequelize({
    database: database,
    username: username,
    password: password,
    host: host,
    port: 5432,
    dialect: "postgres",
  });
}

sequelize
  .authenticate()
  .then(() => {
    console.log("connection successful");
  })
  .catch((err: any) => {
    console.error(err);
  });
export default sequelize;
