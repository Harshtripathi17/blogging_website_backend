/** @format */

import { DataTypes, Model } from "sequelize";
import sequelize from "../database";
import { Post } from "./post.interface";

interface AuthorInterface {
  id: number;
  isActive: boolean;
  isVerified: boolean;
  name: string;
  email: string;
  phone: number;
  profile_picture: string;
  website_name: string;
  linkedin_url: string;
  twitter_url: string;
  bio: string;
  password: string;
}

class Author extends Model<AuthorInterface> implements AuthorInterface {
  [x: string]: any;
  id!: number;
  isActive!: boolean;
  isVerified!: boolean;
  name!: string;
  email!: string;
  phone!: number;
  profile_picture!: string;
  website_name!: string;
  linkedin_url!: string;
  twitter_url!: string;
  bio!: string;
  password!: string;
}

Author.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    name: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
    phone: {
      type: DataTypes.BIGINT,
    },
    profile_picture: {
      type: DataTypes.STRING,
    },
    website_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    linkedin_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    twitter_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    bio: {
      type: DataTypes.TEXT,
    },
    password: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    modelName: "Author",
    tableName: "author",
  }
);
Author.hasMany(Post, {
  foreignKey: "author_id",
});
export { Author };
