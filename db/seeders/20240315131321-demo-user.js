"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("users", [
      {
        id: "1",
        first_name: "John",
        last_name: "Doe",
        email: "example@example.com",
        phone: "123-456-7890",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: "2",
        first_name: "Ian",
        last_name: "Lau",
        email: "example@IanLau.com",
        phone: "123-456-7890",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("users", null, {});
  },
};
