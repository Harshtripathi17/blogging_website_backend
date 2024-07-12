"use strict";
/** @format */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Author = void 0;
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../database"));
const post_interface_1 = require("./post.interface");
class Author extends sequelize_1.Model {
}
exports.Author = Author;
Author.init({
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: sequelize_1.DataTypes.INTEGER,
    },
    isActive: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
    },
    isVerified: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
    },
    phone: {
        type: sequelize_1.DataTypes.INTEGER,
    },
    profile_picture: {
        type: sequelize_1.DataTypes.STRING,
    },
    website_name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    linkedin_url: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    twitter_url: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    bio: {
        type: sequelize_1.DataTypes.STRING,
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
    },
}, {
    sequelize: database_1.default,
    modelName: "Author",
    tableName: "author",
});
Author.hasMany(post_interface_1.Post, {
    foreignKey: "author_id",
});
