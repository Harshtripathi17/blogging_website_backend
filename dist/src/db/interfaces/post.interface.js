"use strict";
/** @format */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Post = void 0;
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../database"));
class Post extends sequelize_1.Model {
}
exports.Post = Post;
Post.init({
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: sequelize_1.DataTypes.INTEGER,
    },
    author_id: {
        allowNull: false,
        type: sequelize_1.DataTypes.INTEGER,
        references: {
            model: {
                tableName: "author",
            },
            key: "id",
        },
        comment: "Foreign key of the author table.",
    },
    isPublished: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false, // means draft and true = published
    },
    title: {
        type: sequelize_1.DataTypes.STRING,
    },
    summary: {
        type: sequelize_1.DataTypes.STRING,
    },
    content: {
        type: sequelize_1.DataTypes.INTEGER,
    },
    cover_image: {
        type: sequelize_1.DataTypes.STRING,
    },
    tags: {
        type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
        allowNull: true,
    },
}, {
    sequelize: database_1.default,
    modelName: "Post",
    tableName: "post",
});
