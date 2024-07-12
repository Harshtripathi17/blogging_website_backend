/** @format */

import { DataTypes, Model } from "sequelize";
import sequelize from "../database";

interface PostInterface {
  id: number;
  author_id: number;
  isPublished: boolean;
  title: string;
  content: string;
  summary: number;
  cover_image: string;
  tags: string[];
}

class Post extends Model<PostInterface> implements PostInterface {
  map(
    arg0: (user: any) => {
      id: any;
      author_id: any;
      title: any;
      content: any;
      cover_image: string;
      summary: any;
      isPublished: any;
    }
  ) {
    throw new Error("Method not implemented.");
  }
  id!: number;
  author_id!: number;
  isPublished!: boolean;
  title!: string;
  content!: string;
  summary!: number;
  cover_image!: string;
  tags!: string[];
}

Post.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    author_id: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: {
          tableName: "author",
        },
        key: "id",
      },
      comment: "Foreign key of the author table.",
    },
    isPublished: {
      type: DataTypes.BOOLEAN,
      defaultValue: false, // means draft and true = published
    },
    title: {
      type: DataTypes.STRING,
    },
    summary: {
      type: DataTypes.TEXT,
    },
    content: {
      type: DataTypes.TEXT,
    },
    cover_image: {
      type: DataTypes.STRING,
    },
    tags: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Post",
    tableName: "post",
  }
);
export { Post };
