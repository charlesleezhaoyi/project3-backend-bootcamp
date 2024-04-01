"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // await queryInterface.bulkInsert("books", [
    // {
    //   title: "The Gruffalo",
    //   author: "Julia Donaldson",
    //   description:
    //     "A mouse is taking a stroll through the deep, dark wood when along comes a hungry fox, then an owl, and then a snake.",
    //   released_year: 2006,
    //   condition: "New",
    //   review: "One of the best books",
    //   created_at: new Date(),
    //   updated_at: new Date(),
    // },
    // {
    //   title: "The Design of Everyday Things",
    //   author: "Don Norman",
    //   description:
    //     "he Ultimate Guide To Human-Centered Design Even The Smartest Among Us Can Feel Inept As We Fail To Figure Out Which Light Switch Or Oven Burner To Turn On, Or Whether To Push, Pull, Or Slide A Door. ",
    //   released_year: 2013,
    //   condition: "Used",
    //   review: "Awesome",
    //   created_at: new Date(),
    //   updated_at: new Date(),
    // },
    // {
    //   title: "The Little Book of Sloth Philosophy",
    //   author: "Jennifer McCartney",
    //   description:
    //     "From tidying and Hygge, to living Lagom, the endless pressure to be happier, live better, sleep soundly, and eat mindfully can be exhausting. ",
    //   released_year: 2018,
    //   condition: "New",
    //   review: "Best",
    //   created_at: new Date(),
    //   updated_at: new Date(),
    // },
    // ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("books", null, {});
  },
};
