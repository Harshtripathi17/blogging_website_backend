"use strict";
/** @format */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const database = process.env.DATABASE;
const username = process.env.USER_NAME;
const password = process.env.PASSWORD;
const host = process.env.HOST;
let sequelize;
if (process.env.DB_URL) {
    sequelize = new sequelize_typescript_1.Sequelize(process.env.DB_URL);
}
else {
    sequelize = new sequelize_typescript_1.Sequelize({
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
    .catch((err) => {
    console.error(err);
});
exports.default = sequelize;
