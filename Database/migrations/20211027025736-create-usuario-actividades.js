'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('UsuarioActividades', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      actividadId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Actividades',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      usuarioId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Usuarios',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      estadoActividad: {
        type: Sequelize.STRING,
        defaultValue: 'Pendiente'
      },
      archivoId:{
        type: Sequelize.INTEGER,
        references: {
          model: 'Archivos',
          key: 'id'
        },
        onDelete: 'CASCADE'
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
    await queryInterface.dropTable('UsuarioActividades');
  }
};