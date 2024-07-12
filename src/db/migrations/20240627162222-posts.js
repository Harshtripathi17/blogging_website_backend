/** @format */

"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("post", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      author_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: "author",
          },
          key: "id",
          onDelete: "cascade",
        },
        comment: "Foreign key of the author table.",
      },
      isPublished: {
        type: Sequelize.BOOLEAN,
        defaultValue: false, // means draft and true = published
      },
      title: {
        type: Sequelize.STRING,
      },
      summary: {
        type: Sequelize.STRING,
      },
      content: {
        type: Sequelize.INTEGER,
      },
      cover_image: {
        type: Sequelize.STRING,
      },
      tags: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("post");
  },
};
