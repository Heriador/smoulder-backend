'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UsuarioActividades extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      //Relacion con la tabla usuario
      this.belongsTo(models.Usuario, { foreignKey: 'usuarioId' });

      //Relacion con la tabla actividades
      this.belongsTo(models.Actividades, { foreignKey: 'actividadId' });

      //Relacion con la tabla Archivos
      this.belongsTo(models.Archivos, { foreignKey: 'archivoId' })
    }
  };
  UsuarioActividades.init({
    actividadId: DataTypes.INTEGER,
    usuarioId: DataTypes.INTEGER,
    estadoActividad: DataTypes.STRING,
    archivoId: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'UsuarioActividade',
  });
  return UsuarioActividades;
};