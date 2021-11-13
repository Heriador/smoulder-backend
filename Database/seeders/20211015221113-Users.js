"use strict";
const bcrypt = require("bcrypt");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */

    await queryInterface.bulkInsert("Usuarios", [
      {
        nombre: "Angel Andres",
        apellido: "Miranda Castillo",
        correo: "mirandeangel83@gmail.com",
        contraseña: bcrypt.hashSync("Angel500", 10),
        rol: 1,
      },
      {
        nombre: "Santiago",
        apellido: "Cuadrado Puentes",
        correo: 'santiagopuentes23@gmail.com',
        contraseña: bcrypt.hashSync('santiago22', 10),
        rol: 2,
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    await queryInterface.bulkDelete("Usuarios", null, {});
  },
};
