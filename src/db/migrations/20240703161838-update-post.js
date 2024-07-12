/** @format */

"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("post", "content", {
      type: Sequelize.TEXT,
    });
    await queryInterface.changeColumn("post", "summary", {
      type: Sequelize.TEXT,
    });
    await queryInterface.changeColumn("author", "bio", {
      type: Sequelize.TEXT,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("post", "content");
    await queryInterface.removeColumn("post", "summary");
    await queryInterface.removeColumn("author", "bio");
  },
};
