'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Actividades', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      titulo: {
        type: Sequelize.STRING,
        allowNull: false
      },
      type: {
        type: Sequelize.STRING,
        defaultValue: 'Anuncio'
      },
      contenido: {
        type: Sequelize.TEXT,
        // allowNull: false
      },
      entornoId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'EntornoTrabajos',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      creadorId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Usuarios',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      fechaEntrega: {
        type: Sequelize.DATE,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Actividades');
  }
};