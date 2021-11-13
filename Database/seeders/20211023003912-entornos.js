'use strict';

const models = require('../../models')
const Usuario  = models.Usuario
const Entorno = models.EntornoTrabajo
const UsuarioEmpleado = models.UsuarioEmpleado

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

    const users = await Usuario.findAll({ limit: 2 })

    const entorno = await Entorno.create({ 
      titulo: 'Entorno de prueba',
      descripcion: 'Entorno de prueba',
      creadorId: users[0].id,
    })

    await UsuarioEmpleado.bulkCreate([
      {
        usuarioId: users[0].id,
        entornoId: entorno.id,
      },
      {
        usuarioId: users[1].id,
        entornoId: entorno.id,
      }
    ])

  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await UsuarioEmpleado.destroy({ truncate: true })
    await Entorno.destroy({ truncate: true })
  }
};
